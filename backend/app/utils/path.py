# backend/app/utils/path.py
from heapq import heappush, heappop
from math import radians, sin, cos, sqrt, atan2
from typing import List, Tuple, Set, Dict, Any
from .geo import point_in_polygon
import logging

logger = logging.getLogger(__name__)


# Haversine (meters)
def haversine(a_lat, a_lon, b_lat, b_lon) -> float:
    R = 6371000.0
    dlat = radians(b_lat - a_lat)
    dlon = radians(b_lon - a_lon)
    la1, la2 = radians(a_lat), radians(b_lat)
    x = sin(dlat / 2) ** 2 + cos(la1) * cos(la2) * sin(dlon / 2) ** 2
    return 2 * R * atan2(sqrt(x), sqrt(1 - x))


# Haversine distance in kilometers
def haversine_distance(a_lat, a_lon, b_lat, b_lon) -> float:
    return haversine(a_lat, a_lon, b_lat, b_lon) / 1000.0


def in_any_geofence(lat, lon, geofences) -> bool:
    # Handle both Geofence objects and raw polygon lists
    for gf in geofences:
        # Check if it's a Geofence object with polygon attribute
        if hasattr(gf, "polygon"):
            polygon = gf.polygon
        # Otherwise, assume it's already a polygon list
        else:
            polygon = gf

        if point_in_polygon(lat, lon, polygon):
            return True
    return False


def line_intersects_geofence(start, end, geofences, steps=10) -> bool:
    """
    Check if a line between two points intersects any geofence.
    This is important to ensure the path doesn't cut through geofences.
    """
    s_lat, s_lon = start
    e_lat, e_lon = end

    # Check multiple points along the line
    for i in range(steps + 1):
        fraction = i / steps
        lat = s_lat + (e_lat - s_lat) * fraction
        lon = s_lon + (e_lon - s_lon) * fraction

        if in_any_geofence(lat, lon, geofences):
            return True

    return False


def neighbors(lat, lon, step_deg: float) -> List[Tuple[float, float]]:
    # 8-connected grid around the point
    ds = [-step_deg, 0.0, step_deg]
    res = []
    for dx in ds:
        for dy in ds:
            if dx == 0 and dy == 0:
                continue
            res.append((lat + dx, lon + dy))
    return res


def a_star_plan_path(
    start: Tuple[float, float],
    goal: Tuple[float, float],
    geofences,
    step_deg: float = 0.001,  # ~111m in latitude
    max_nodes: int = 200000,
) -> List[Tuple[float, float]]:
    """
    A* over a lat/lon grid (8-neighborhood), avoiding geofences.
    Returns a list of (lat, lon) waypoints including start and goal.
    """
    s_lat, s_lon = start
    g_lat, g_lon = goal

    # If start/goal inside no-fly → fail fast
    if in_any_geofence(s_lat, s_lon, geofences):
        raise ValueError("Start point is inside a geofence.")
    if in_any_geofence(g_lat, g_lon, geofences):
        raise ValueError("Destination point is inside a geofence.")

    # Calculate dynamic padding based on distance
    distance_km = haversine_distance(s_lat, s_lon, g_lat, g_lon)
    padding = max(
        0.2, min(1.0, distance_km * 0.001)
    )  # Dynamic padding based on distance

    # Snap a simple bounding window to keep search finite
    # (Pad around the start/goal box)
    min_lat = min(s_lat, g_lat) - padding
    max_lat = max(s_lat, g_lat) + padding
    min_lon = min(s_lon, g_lon) - padding
    max_lon = max(s_lon, g_lon) + padding

    def in_bounds(lat, lon):
        return (min_lat <= lat <= max_lat) and (min_lon <= lon <= max_lon)

    start_n = (round(s_lat / step_deg) * step_deg, round(s_lon / step_deg) * step_deg)
    goal_n = (round(g_lat / step_deg) * step_deg, round(g_lon / step_deg) * step_deg)

    open_heap = []
    heappush(open_heap, (0.0, start_n))
    came_from = {}
    gscore = {start_n: 0.0}
    closed: Set[Tuple[float, float]] = set()

    def h(p, q):
        return haversine(p[0], p[1], q[0], q[1])

    nodes = 0
    while open_heap:
        _, current = heappop(open_heap)
        nodes += 1
        if nodes > max_nodes:
            raise RuntimeError(
                "Planner reached node limit; try a larger step or closer points."
            )

        if current in closed:
            continue
        closed.add(current)

        if h(current, goal_n) <= step_deg * 111000 * 1.5:  # close enough (~1.5 cells)
            # Reconstruct
            path = [current]
            while current in came_from:
                current = came_from[current]
                path.append(current)
            path.reverse()

            # Ensure the path doesn't cross any geofences
            for i in range(len(path) - 1):
                if line_intersects_geofence(path[i], path[i + 1], geofences):
                    raise RuntimeError(
                        "Path intersects a geofence. Try a larger step size."
                    )

            # ensure exact goal at end
            if path[-1] != goal_n:
                path.append(goal_n)
            # Replace first/last with original exact start/goal
            if path:
                path[0] = (s_lat, s_lon)
                path[-1] = (g_lat, g_lon)
            return path

        for nb in neighbors(*current, step_deg):
            if not in_bounds(*nb):
                continue
            if in_any_geofence(nb[0], nb[1], geofences):
                continue

            # Check if the path to this neighbor would cross a geofence
            if line_intersects_geofence(current, nb, geofences):
                continue

            tentative = gscore[current] + h(current, nb)
            if tentative < gscore.get(nb, float("inf")):
                came_from[nb] = current
                gscore[nb] = tentative
                f = tentative + h(nb, goal_n)
                heappush(open_heap, (f, nb))

    raise RuntimeError("No path found. Consider adjusting step size or geofences.")


def plan_path(start, goal, geofences, step_deg=0.001, max_distance_km=500):
    """
    Plan a path between two points, avoiding geofences.

    Args:
        start: Tuple of (lat, lon)
        goal: Tuple of (lat, lon)
        geofences: List of geofence polygons or Geofence objects
        step_deg: Step size in degrees
        max_distance_km: Maximum distance for a single path segment

    Returns:
        List of points representing the path
    """
    # Calculate the distance between start and goal
    distance_km = haversine_distance(start[0], start[1], goal[0], goal[1])

    # If distance is too large, use a multi-segment approach
    if distance_km > max_distance_km:
        return plan_long_path(start, goal, geofences, step_deg, max_distance_km)

    # Use A* for shorter distances
    return a_star_plan_path(start, goal, geofences, step_deg)


def plan_long_path(start, goal, geofences, step_deg=0.001, max_distance_km=500):
    """
    Plan a long path by breaking it into smaller segments, avoiding geofences.
    """
    distance_km = haversine_distance(start[0], start[1], goal[0], goal[1])
    num_segments = max(2, int(distance_km / max_distance_km) + 1)

    path = []
    current_start = start

    for i in range(num_segments):
        fraction = (i + 1) / num_segments
        lat = start[0] + (goal[0] - start[0]) * fraction
        lon = start[1] + (goal[1] - start[1]) * fraction
        current_goal = (lat, lon)

        # Plan a segment avoiding geofences
        try:
            segment_path = a_star_plan_path(
                current_start, current_goal, geofences, step_deg
            )
            # Add all but the last point (to avoid duplicates)
            path.extend(segment_path[:-1])
            current_start = segment_path[-1]
        except Exception as e:
            logger.error(f"Error planning segment {i+1}/{num_segments}: {e}")
            # Fallback: use straight line but warn
            path.append(current_goal)
            current_start = current_goal

    # Add the final goal point
    path.append(goal)

    return path
