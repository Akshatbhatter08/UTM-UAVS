# backend/app/utils/geofences.py
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from backend.app.config import settings

# Create DB session
engine = create_engine(settings.DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Geofence:
    """
    Simple object to hold geofence data
    """

    def __init__(self, id, name, polygon, type):
        self.id = id
        self.name = name
        self.polygon = polygon  # already list of [lat, lon]
        self.type = type


def load_geofences() -> list:
    """
    Loads all geofences from Postgres (table: geofences).
    Returns a list of Geofence objects.
    """
    session = SessionLocal()
    try:
        rows = session.execute(
            text("SELECT id, name, polygon, type FROM geofences")
        ).fetchall()
        geofences = []
        for row in rows:
            # polygon is stored as jsonb → already a Python list/dict
            poly = row.polygon
            # Ensure polygon is a list of [lat, lon]
            if isinstance(poly, dict) and "coordinates" in poly:
                # Handle GeoJSON style { "coordinates": [[lon,lat], ...] }
                coords = poly["coordinates"]
            else:
                coords = poly
            geofences.append(
                Geofence(id=row.id, name=row.name, polygon=coords, type=row.type)
            )
        return geofences
    finally:
        session.close()
