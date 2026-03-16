from shapely.geometry import Point, Polygon
import math


def point_in_polygon(lat, lon, polygon_coords):
    poly = Polygon([(c[1], c[0]) for c in polygon_coords])  # input as [(lat, lon), ...]
    return poly.contains(Point(lon, lat))


def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def check_proximity_m(lat1, lon1, lat2, lon2, threshold_m=50):
    return haversine_distance(lat1, lon1, lat2, lon2) <= threshold_m


def calculate_bearing(lat1, lon1, lat2, lon2):
    """
    Calculate the bearing between two points on the Earth.

    :param lat1: Latitude of first point in degrees
    :param lon1: Longitude of first point in degrees
    :param lat2: Latitude of second point in degrees
    :param lon2: Longitude of second point in degrees
    :return: Bearing in degrees from North (0-360)
    """
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    dlon = lon2 - lon1
    x = math.sin(dlon) * math.cos(lat2)
    y = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(
        dlon
    )

    bearing = math.atan2(x, y)
    bearing = math.degrees(bearing)
    bearing = (bearing + 360) % 360

    return bearing


def intermediate_point(lat1, lon1, lat2, lon2, fraction):
    """
    Calculate an intermediate point between two coordinates.

    :param lat1: Latitude of first point in degrees
    :param lon1: Longitude of first point in degrees
    :param lat2: Latitude of second point in degrees
    :param lon2: Longitude of second point in degrees
    :param fraction: Fraction of the distance from point1 to point2 (0-1)
    :return: Tuple of (lat, lon) for the intermediate point
    """
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Calculate the angular distance between points
    d = haversine_distance(
        math.degrees(lat1), math.degrees(lon1), math.degrees(lat2), math.degrees(lon2)
    )
    delta = d / 6371  # Earth radius in km

    # Calculate intermediate point
    a = math.sin((1 - fraction) * delta) / math.sin(delta)
    b = math.sin(fraction * delta) / math.sin(delta)

    x = a * math.cos(lat1) * math.cos(lon1) + b * math.cos(lat2) * math.cos(lon2)
    y = a * math.cos(lat1) * math.sin(lon1) + b * math.cos(lat2) * math.sin(lon2)
    z = a * math.sin(lat1) + b * math.sin(lat2)

    lat_i = math.atan2(z, math.sqrt(x**2 + y**2))
    lon_i = math.atan2(y, x)

    return math.degrees(lat_i), math.degrees(lon_i)
