# # backend/app/utils/simulator_path.py
# import asyncio
# from typing import List, Dict
# from ..websocket import manager
# from ..schemas import TelemetryIn, DroneCreate
# from ..crud import save_telemetry, create_drone, get_drone
# from ..database import SessionLocal  # Add this import
# from ..models import Drone
# from .geo import haversine_distance, calculate_bearing, intermediate_point
# import logging
# import math
# import random
# from datetime import datetime

# logger = logging.getLogger(__name__)

# # In-memory storage for drone status
# drone_statuses = {}


# async def simulate_path(
#     drone_id: int, path: List[Dict], speed_mps: float = 12.0, altitude_m: float = 100.0
# ):
#     """
#     Simulate a drone moving along a given path with realistic movement patterns.
#     """
#     if not path or len(path) < 2:
#         logger.warning("Simulation skipped: path too short or empty.")
#         return

#     # Use SessionLocal instead of get_db()
#     db = SessionLocal()
#     try:
#         # Check if drone exists, create if it doesn't
#         existing_drone = get_drone(db, drone_id)
#         if not existing_drone:
#             # Create a new drone
#             drone_data = DroneCreate(
#                 id=drone_id,
#                 name=f"Simulated Drone {drone_id}",
#                 model="Simulation",
#                 status="active",
#                 max_speed=speed_mps * 3.6,  # Convert m/s to km/h
#             )
#             create_drone(db, drone_data)
#             db.commit()
#             logger.info(f"Created new drone with ID {drone_id}")

#         # Rest of your simulation code...
#         # [Keep your existing simulation logic here]

#     except Exception as e:
#         logger.exception(f"Error during simulation for drone {drone_id}: {e}")
#         # Send error notification to WebSocket clients
#         await manager.broadcast(
#             {
#                 "type": "error",
#                 "drone_id": drone_id,
#                 "message": f"Simulation error: {str(e)}",
#                 "timestamp": datetime.now().isoformat(),
#             }
#         )

#     finally:
#         db.close()


# def get_drone_status(drone_id: int):
#     """Get current status of a drone"""
#     return drone_statuses.get(drone_id, None)


# def get_all_drone_statuses():
#     """Get status of all active drones"""
#     return drone_statuses


# import asyncio
# import math

# # Track status for all drones
# drone_statuses = {}


# async def simulate_path(drone_id, path, speed_mps=12, altitude_m=100):
#     """
#     Async generator that simulates drone flight along path points.
#     Yields a dict of current drone position + altitude + progress.
#     """
#     total_points = len(path)
#     if total_points == 0:
#         return

#     for i, point in enumerate(path):
#         lat, lon = point["lat"], point["lon"]

#         # Update and store drone's current status
#         drone_statuses[drone_id] = {
#             "lat": lat,
#             "lon": lon,
#             "altitude": altitude_m,
#             "progress": round((i + 1) / total_points * 100, 2),
#         }

#         # ✅ yield current position for broadcast
#         yield drone_statuses[drone_id]

#         # simulate motion delay based on speed
#         await asyncio.sleep(0.3)

#     # Mark drone as completed
#     drone_statuses[drone_id]["completed"] = True


# def get_drone_status(drone_id):
#     """Return latest known position of drone."""
#     return drone_statuses.get(drone_id)

'''
import asyncio
import math

drone_statuses = {}


def haversine(lat1, lon1, lat2, lon2):
    """Calculate distance between two points (meters)."""
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


async def simulate_path(drone_id, path, speed_mps=12, altitude_m=100):
    """
    Async generator that simulates drone flight along path points.
    Moves proportionally to distance/speed, so motion looks real-time.
    """
    total_points = len(path)
    if total_points < 2:
        return

    for i in range(total_points - 1):
        lat1, lon1 = path[i]["lat"], path[i]["lon"]
        lat2, lon2 = path[i + 1]["lat"], path[i + 1]["lon"]

        # Calculate distance & estimated travel time
        distance_m = haversine(lat1, lon1, lat2, lon2)
        travel_time = distance_m / speed_mps  # seconds

        # Divide segment into smaller steps for smooth movement
        steps = max(5, int(travel_time * 2))  # 2 steps per second minimum
        for step in range(steps):
            frac = step / steps
            lat = lat1 + frac * (lat2 - lat1)
            lon = lon1 + frac * (lon2 - lon1)

            drone_statuses[drone_id] = {
                "lat": lat,
                "lon": lon,
                "altitude": altitude_m,
                "progress": round((i + frac) / total_points * 100, 2),
            }
            yield drone_statuses[drone_id]

            # Delay between updates (~0.5s for visible motion)
            await asyncio.sleep(0.1)

    # Final position
    final_lat, final_lon = path[-1]["lat"], path[-1]["lon"]
    drone_statuses[drone_id] = {
        "lat": final_lat,
        "lon": final_lon,
        "altitude": altitude_m,
        "completed": True,
        "progress": 100,
    }
    yield drone_statuses[drone_id]


def get_drone_status(drone_id):
    """Return latest known position of drone."""
    return drone_statuses.get(drone_id)
'''

# backend/app/utils/simulator_path.py
import asyncio
import math
import time
import random
from typing import List, Tuple, Dict, Optional, AsyncGenerator

# ------------------------
# Configuration knobs
# ------------------------
SAFE_DISTANCE_M = 30.0  # if predicted closest approach < SAFE_DISTANCE_M -> avoid
PREDICTION_SECONDS = 6.0  # seconds ahead to predict collisions
MIN_SPEED_MPS = 1.0  # lower bound on speed on slowdowns
DEFAULT_SPEED_MPS = 24.0  # default cruising speed
WEATHER_SLOW_FACTOR = 0.5  # multiply speed by this inside weather zone
REPLAN_COOLDOWN = 2.0  # seconds to wait after issuing reroute before next reroute
GRID_RES_DEG = 0.0005  # grid resolution for A* ~ ~50m (approx)
ASTAR_MAX_NODES = 12000  # hard cap to avoid runaway A*
SIM_STEP_SECONDS = 0.12  # how often we yield status (seconds)
EARTH_R = 6371000.0  # meters

# ------------------------
# Global drone state
# ------------------------
# drone_states[drone_id] = {
#   "lat": float,
#   "lon": float,
#   "alt": float,
#   "speed_mps": float,
#   "path": [[lat,lon], ...],
#   "dest": [lat,lon],
#   "last_reroute": timestamp
# }
drone_states: Dict[int, Dict] = {}

# weather_zones: list of dicts {"center": [lat,lon], "radius_m": float, "vx_mps": float, "vy_mps": float}
weather_zones: List[Dict] = []


# ------------------------
# Small geo helpers
# ------------------------
def haversine_meters(a: Tuple[float, float], b: Tuple[float, float]) -> float:
    lat1, lon1 = map(math.radians, a)
    lat2, lon2 = map(math.radians, b)
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    sin_dlat = math.sin(dlat / 2.0)
    sin_dlon = math.sin(dlon / 2.0)
    a_ = sin_dlat * sin_dlat + math.cos(lat1) * math.cos(lat2) * sin_dlon * sin_dlon
    c = 2.0 * math.atan2(math.sqrt(a_), math.sqrt(1 - a_))
    return EARTH_R * c


def bearing_deg(a: Tuple[float, float], b: Tuple[float, float]) -> float:
    lat1, lon1 = map(math.radians, a)
    lat2, lon2 = map(math.radians, b)
    dlon = lon2 - lon1
    y = math.sin(dlon) * math.cos(lat2)
    x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(
        dlon
    )
    theta = math.atan2(y, x)
    return (math.degrees(theta) + 360.0) % 360.0


def dest_from(
    a: Tuple[float, float], bearing_deg_: float, distance_m: float
) -> Tuple[float, float]:
    # returns lat,lon of point distance_m meters from a along bearing
    lat1 = math.radians(a[0])
    lon1 = math.radians(a[1])
    br = math.radians(bearing_deg_)
    dr = distance_m / EARTH_R
    lat2 = math.asin(
        math.sin(lat1) * math.cos(dr) + math.cos(lat1) * math.sin(dr) * math.cos(br)
    )
    lon2 = lon1 + math.atan2(
        math.sin(br) * math.sin(dr) * math.cos(lat1),
        math.cos(dr) - math.sin(lat1) * math.sin(lat2),
    )
    return (math.degrees(lat2), math.degrees(lon2))


# ------------------------
# Weather zone simulation
# ------------------------
def init_random_weather_zones(n=3, around_center=(22.57, 88.36), spread_deg=0.5):
    """Create moving circular weather hazards for demo/testing."""
    global weather_zones
    weather_zones = []
    for i in range(n):
        lat = around_center[0] + (random.random() - 0.5) * spread_deg
        lon = around_center[1] + (random.random() - 0.5) * spread_deg
        radius_m = random.uniform(500, 3000)  # 0.5km - 3km
        # random drift velocity in m/s
        vx = random.uniform(-2.0, 2.0)
        vy = random.uniform(-2.0, 2.0)
        weather_zones.append(
            {
                "center": [lat, lon],
                "radius_m": radius_m,
                "vx_mps": vx,
                "vy_mps": vy,
                "id": f"w{i}",
            }
        )


def advance_weather_zones(dt_s=1.0):
    """Move weather zones by their velocities (approx)."""
    for z in weather_zones:
        # we approximate small-movement translation: convert vx/vy (meters) to lat/lon delta
        # 1 deg lat ~ 111320 m; 1 deg lon ~ 111320*cos(lat) m
        lat, lon = z["center"]
        delta_lat = (z["vy_mps"] * dt_s) / 111320.0
        delta_lon = (z["vx_mps"] * dt_s) / (
            111320.0 * math.cos(math.radians(lat)) + 1e-9
        )
        z["center"][0] += delta_lat
        z["center"][1] += delta_lon


def point_in_weather(lat, lon) -> Optional[Dict]:
    """Return the weather zone containing the point, or None."""
    for z in weather_zones:
        d = haversine_meters((lat, lon), tuple(z["center"]))
        if d <= z["radius_m"]:
            return z
    return None


# init on import for demo
init_random_weather_zones(n=3)


# ------------------------
# Collision prediction
# ------------------------
def predict_closest_approach(
    a_pos, a_vel_mps, b_pos, b_vel_mps, predict_T=PREDICTION_SECONDS
) -> Tuple[float, float]:
    """
    Predict closest approach between two straight-line constant-velocity objects in local meters.
    Returns (t_closest, distance_m_closest)
    a_pos, b_pos: (lat,lon)
    a_vel_mps, b_vel_mps: velocity vectors in m/s as (vx, vy) local east,north (approx)
    """
    # convert lat/lon offsets to meters in an equirectangular approx around a reference
    # We'll compute relative motion r(t) = r0 + v_rel * t; distance = |r(t)|
    # First compute r0 in meters (b - a)
    lat0 = (a_pos[0] + b_pos[0]) / 2.0
    # meters per deg
    mx = 111320.0 * math.cos(math.radians(lat0))  # meters per deg lon
    my = 111320.0  # meters per deg lat

    r0_x = (b_pos[1] - a_pos[1]) * mx  # east
    r0_y = (b_pos[0] - a_pos[0]) * my  # north

    vr_x = b_vel_mps[0] - a_vel_mps[0]
    vr_y = b_vel_mps[1] - a_vel_mps[1]

    vr2 = vr_x * vr_x + vr_y * vr_y
    if vr2 < 1e-6:
        # velocities nearly identical -> distance is constant
        t_closest = 0.0
    else:
        t_closest = -(r0_x * vr_x + r0_y * vr_y) / vr2
        t_closest = max(0.0, min(predict_T, t_closest))
    closest_x = r0_x + vr_x * t_closest
    closest_y = r0_y + vr_y * t_closest
    dist = math.hypot(closest_x, closest_y)
    return t_closest, dist


def latlon_to_local_vel(from_latlon, to_latlon, dt_s):
    """Compute approximate local east/north velocity vector (vx, vy) in m/s from two latlon points separated by dt_s seconds."""
    if dt_s <= 0.0:
        return (0.0, 0.0)
    lat0 = (from_latlon[0] + to_latlon[0]) / 2.0
    mx = 111320.0 * math.cos(math.radians(lat0))
    my = 111320.0
    dx = (to_latlon[1] - from_latlon[1]) * mx  # east
    dy = (to_latlon[0] - from_latlon[0]) * my  # north
    return (dx / dt_s, dy / dt_s)


# ------------------------
# Simple A* planning on lat/lon grid (approx)
# ------------------------
import heapq


def astar_plan(
    start: Tuple[float, float],
    goal: Tuple[float, float],
    obstacles_polygons: List[List[Tuple[float, float]]] = None,
    obstacle_circle_list: List[Tuple[float, float, float]] = None,
    max_nodes=ASTAR_MAX_NODES,
) -> List[Tuple[float, float]]:
    """
    A* planning on a grid around start/goal. This is approximate and meant
    for demonstration. Returns list of (lat,lon).
    - obstacles_polygons: list of polygons (list of (lat,lon) tuples) to avoid.
    - obstacle_circle_list: list of (lat,lon,radius_m) circles to avoid.
    """
    obstacles_polygons = obstacles_polygons or []
    obstacle_circle_list = obstacle_circle_list or []

    # bounding box cover
    min_lat = min(start[0], goal[0]) - 0.02
    max_lat = max(start[0], goal[0]) + 0.02
    min_lon = min(start[1], goal[1]) - 0.02
    max_lon = max(start[1], goal[1]) + 0.02

    # grid resolution
    res = GRID_RES_DEG

    def to_cell(p):
        return (int(round((p[0] - min_lat) / res)), int(round((p[1] - min_lon) / res)))

    def from_cell(c):
        return (min_lat + c[0] * res, min_lon + c[1] * res)

    start_c = to_cell(start)
    goal_c = to_cell(goal)

    # quick fail safe
    if start_c == goal_c:
        return [start, goal]

    def in_bounds(c):
        lat, lon = from_cell(c)
        return (min_lat <= lat <= max_lat) and (min_lon <= lon <= max_lon)

    # precompute simple obstacle test: circle membership and polygon using ray casting
    def point_blocked(lat, lon):
        # circle obstacles
        for clat, clon, crad in obstacle_circle_list:
            if haversine_meters((lat, lon), (clat, clon)) <= crad + 1.0:
                return True
        # polygon obstacles (point in polygon)
        for poly in obstacles_polygons:
            if point_in_polygon((lat, lon), poly):
                return True
        return False

    # early exit if start or goal in obstacle -> return direct but flagged
    if point_blocked(start[0], start[1]) or point_blocked(goal[0], goal[1]):
        # can't find clean route — fallback to straight line (caller must handle)
        return [start, goal]

    open_heap = []
    gscore = {start_c: 0.0}
    fscore = {start_c: heuristic_cell(start_c, goal_c, res)}
    heapq.heappush(open_heap, (fscore[start_c], start_c))
    came_from = {}
    visited = set()
    nodes = 0

    while open_heap:
        _, cur = heapq.heappop(open_heap)
        nodes += 1
        if nodes > max_nodes:
            break
        if cur == goal_c:
            # reconstruct
            path = []
            while cur in came_from:
                path.append(from_cell(cur))
                cur = came_from[cur]
            path.append(from_cell(start_c))
            path.reverse()
            # add exact start/goal
            path[0] = start
            path[-1] = goal
            return path

        visited.add(cur)
        # neighbors: 8-connected
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                if dx == 0 and dy == 0:
                    continue
                nb = (cur[0] + dx, cur[1] + dy)
                if not in_bounds(nb) or nb in visited:
                    continue
                latlon = from_cell(nb)
                if point_blocked(latlon[0], latlon[1]):
                    continue
                tentative_g = gscore[cur] + math.hypot(dx * res, dy * res)
                if tentative_g < gscore.get(nb, float("inf")):
                    came_from[nb] = cur
                    gscore[nb] = tentative_g
                    fscore[nb] = tentative_g + heuristic_cell(nb, goal_c, res)
                    heapq.heappush(open_heap, (fscore[nb], nb))

    # failed to find path: fallback to straight line
    return [start, goal]


def heuristic_cell(a, b, res):
    dx = (b[0] - a[0]) * res
    dy = (b[1] - a[1]) * res
    # convert degree-based heuristic to meters approx
    # we use haversine on approximate coords
    latlon_a = (a[0] * res, a[1] * res)  # crude
    return math.hypot(dx, dy)


def point_in_polygon(point, polygon):
    # classic ray-casting algorithm
    x, y = point[1], point[0]  # lon, lat
    inside = False
    n = len(polygon)
    for i in range(n):
        xi, yi = polygon[i][1], polygon[i][0]
        xj, yj = polygon[(i + 1) % n][1], polygon[(i + 1) % n][0]
        intersect = ((yi > y) != (yj > y)) and (
            x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi
        )
        if intersect:
            inside = not inside
    return inside


# ------------------------
# get_drone_status helper
# ------------------------
def get_drone_status(drone_id: int) -> Optional[Dict]:
    st = drone_states.get(drone_id)
    if not st:
        return None
    return {
        "lat": st["lat"],
        "lon": st["lon"],
        "altitude_m": st.get("altitude_m", 100.0),
        "speed_mps": st.get("speed_mps", DEFAULT_SPEED_MPS),
        "index": st.get("index", 0),
    }


# ------------------------
# Reroute handler
# ------------------------
async def handle_reroute(
    drone_id: int,
    current_pos: Tuple[float, float],
    dest: Tuple[float, float],
    geofence_polygons: List[List[Tuple[float, float]]] = None,
) -> List[Tuple[float, float]]:
    """
    Compute a new path using A* avoiding geofences, weather, and predicted positions of other drones.
    Returns a list of (lat,lon).
    """
    # Build obstacle circles: current weather zones
    circles = []
    for z in weather_zones:
        circles.append((z["center"][0], z["center"][1], z["radius_m"]))

    # Also add predicted positions of other drones as small circles (predict few seconds ahead)
    for other_id, st in drone_states.items():
        if other_id == drone_id:
            continue
        # predict a few positions forward based on current velocity (if available)
        speed = st.get("speed_mps", DEFAULT_SPEED_MPS)
        # assume next-second movement vector toward next waypoint or bearing
        next_pos = st.get("next_pos")
        if next_pos:
            predict_pos = next_pos
        else:
            predict_pos = (st["lat"], st["lon"])
        circles.append(
            (predict_pos[0], predict_pos[1], 50.0)
        )  # avoid ~50m around predicted

    # call astar_plan
    obstacles_polygons = geofence_polygons or []
    new_path = astar_plan(
        current_pos,
        dest,
        obstacles_polygons=obstacles_polygons,
        obstacle_circle_list=circles,
    )
    return new_path


# ------------------------
# Main simulate_path async generator
# ------------------------
async def simulate_path(
    drone_id: int,
    path: List[Dict],  # list of {lat,lon} or [lat,lon]
    speed_mps: float = DEFAULT_SPEED_MPS,
    altitude_m: float = 100.0,
    geofences: List = None,
) -> AsyncGenerator[Dict, None]:
    """
    Async generator that yields telemetry/status dicts while simulating the drone along the path.
    Yields status dictionaries which the caller should broadcast to clients.
    Example usage:
      async for status in simulate_path(drone_id, path, speed_mps):
          await broadcast_to_all(status)
    """
    # normalize path to list of (lat,lon)
    normalized = []
    for p in path:
        if isinstance(p, (list, tuple)):
            normalized.append((p[0], p[1]))
        elif isinstance(p, dict):
            normalized.append((p.get("lat"), p.get("lon")))
        else:
            raise ValueError("Unsupported path point format")
    if len(normalized) == 0:
        return

    # init drone state
    drone_states.setdefault(drone_id, {})
    st = drone_states[drone_id]
    st["path"] = normalized
    st["dest"] = normalized[-1]
    st["lat"], st["lon"] = normalized[0]
    st["altitude_m"] = altitude_m
    st["speed_mps"] = speed_mps
    st["index"] = 0
    st["last_reroute"] = 0.0
    st["next_pos"] = None

    # iterate segments with interpolation
    for idx in range(1, len(normalized)):
        start = normalized[idx - 1]
        end = normalized[idx]

        # compute segment distance in meters
        seg_dist = haversine_meters(start, end)
        if seg_dist < 0.5:
            # snap and yield
            st["lat"], st["lon"] = end
            st["index"] = idx
            yield {
                "type": "drone_status",
                "drone_id": drone_id,
                "lat": st["lat"],
                "lon": st["lon"],
                "altitude_m": altitude_m,
                "speed_mps": st["speed_mps"],
                "index": st["index"],
                "event": None,
            }
            continue

        # determine heading and segment travel time using current speed (may be changed in-loop)
        heading = bearing_deg(start, end)
        # number of substeps for the segment based on SIM_STEP_SECONDS and current speed (recomputed)
        traveled = 0.0
        t0 = time.time()

        while traveled < seg_dist - 0.001:
            # update weather zones movement
            advance_weather_zones(dt_s=SIM_STEP_SECONDS)

            # check environment: if in weather zone -> slow down
            wz = point_in_weather(st["lat"], st["lon"])
            effective_speed = st.get("speed_mps", speed_mps)
            event = None
            if wz:
                # slow down inside weather
                effective_speed = max(
                    MIN_SPEED_MPS, effective_speed * WEATHER_SLOW_FACTOR
                )
                event = "weather_slowdown"

            # Predict collisions with other drones
            # compute this drone's local velocity vector given heading and effective_speed
            # convert to east,north components
            vx = effective_speed * math.sin(math.radians(heading))
            vy = effective_speed * math.cos(math.radians(heading))
            # predict each other drone and check closest approach
            collision_threat = None
            for other_id, other in drone_states.items():
                if other_id == drone_id:
                    continue
                # estimate other velocity (if next_pos exists, assume dt)
                other_next = other.get("next_pos") or (
                    other.get("lat"),
                    other.get("lon"),
                )
                # approximate dt of next_pos as SIM_STEP_SECONDS (best-effort)
                other_vx, other_vy = latlon_to_local_vel(
                    (other.get("lat"), other.get("lon")), other_next, SIM_STEP_SECONDS
                )
                t_closest, dist_closest = predict_closest_approach(
                    (st["lat"], st["lon"]),
                    (vx, vy),
                    (other.get("lat"), other.get("lon")),
                    (other_vx, other_vy),
                    predict_T=PREDICTION_SECONDS,
                )
                if dist_closest <= SAFE_DISTANCE_M:
                    collision_threat = {
                        "other_id": other_id,
                        "t": t_closest,
                        "dist": dist_closest,
                    }
                    break

            if collision_threat:
                # attempt collision avoidance
                now_ts = time.time()
                if now_ts - st.get("last_reroute", 0.0) > REPLAN_COOLDOWN:
                    # compute new path from current location to destination avoiding others + weather + geofences
                    new_path = await handle_reroute(
                        drone_id,
                        (st["lat"], st["lon"]),
                        st["dest"],
                        geofence_polygons=geofences,
                    )
                    st["last_reroute"] = now_ts
                    st["path"] = new_path
                    # yield an event notifying reroute
                    yield {
                        "type": "drone_status",
                        "drone_id": drone_id,
                        "lat": st["lat"],
                        "lon": st["lon"],
                        "altitude_m": altitude_m,
                        "speed_mps": effective_speed,
                        "index": idx,
                        "event": "collision_avoidance",
                        "new_path": new_path,
                    }
                    # restart simulation following the new path recursively
                    async for status in simulate_path(
                        drone_id,
                        new_path,
                        speed_mps=st.get("speed_mps", speed_mps),
                        altitude_m=altitude_m,
                        geofences=geofences,
                    ):
                        yield status
                    return
                else:
                    # if recently rerouted, reduce speed to be safe and broadcast slowdown
                    effective_speed = max(MIN_SPEED_MPS, effective_speed * 0.5)
                    event = "collision_slowdown"

            # move forward by effective_speed * SIM_STEP_SECONDS but clamp to seg_dist - traveled
            step_m = effective_speed * SIM_STEP_SECONDS
            remaining = seg_dist - traveled
            if step_m > remaining:
                step_m = remaining

            # compute interpolation t along segment
            frac = (traveled + step_m) / (seg_dist + 1e-12)
            new_lat = start[0] + (end[0] - start[0]) * frac
            new_lon = start[1] + (end[1] - start[1]) * frac

            # update state
            st["lat"], st["lon"] = (new_lat, new_lon)
            st["speed_mps"] = effective_speed
            st["index"] = idx
            # set next_pos approximate for others to predict
            # compute next pos after one SIM_STEP_SECONDS along heading
            next_lat, next_lon = dest_from(
                (st["lat"], st["lon"]), heading, effective_speed * SIM_STEP_SECONDS
            )
            st["next_pos"] = (next_lat, next_lon)

            # yield status update
            yield {
                "type": "drone_status",
                "drone_id": drone_id,
                "lat": st["lat"],
                "lon": st["lon"],
                "altitude_m": altitude_m,
                "speed_mps": effective_speed,
                "index": st["index"],
                "event": event,
            }

            # advance traveled and sleep
            traveled += step_m
            await asyncio.sleep(SIM_STEP_SECONDS)

        # finish segment: snap to exact end
        st["lat"], st["lon"] = end
        st["index"] = idx
        # small yield after finishing segment
        yield {
            "type": "drone_status",
            "drone_id": drone_id,
            "lat": st["lat"],
            "lon": st["lon"],
            "altitude_m": altitude_m,
            "speed_mps": st["speed_mps"],
            "index": st["index"],
            "event": None,
        }

    # final completion
    yield {
        "type": "simulation_complete",
        "drone_id": drone_id,
        "lat": st["lat"],
        "lon": st["lon"],
    }
