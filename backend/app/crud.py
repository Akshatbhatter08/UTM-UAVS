# backend/app/crud.py
import logging
from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime, timedelta

# Add logger
logger = logging.getLogger(__name__)


def create_user(db: Session, user: schemas.UserCreate):
    from .auth import get_password_hash

    hashed = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_drone(db: Session, drone: schemas.DroneCreate, owner_id: int = None):
    """
    Create a new drone. If owner_id is provided, use it. Otherwise, use the owner_id from the schema.
    """
    # Use owner_id from parameters if provided, otherwise use from schema
    final_owner_id = owner_id if owner_id is not None else drone.owner_id

    db_drone = models.Drone(
        id=drone.id,
        name=drone.name,
        model=drone.model,
        status=drone.status,
        max_speed=drone.max_speed,
        owner_id=final_owner_id,
    )
    db.add(db_drone)
    db.commit()
    db.refresh(db_drone)
    return db_drone


def get_drones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Drone).offset(skip).limit(limit).all()


def get_drone(db: Session, drone_id: int):
    return db.query(models.Drone).filter(models.Drone.id == drone_id).first()


def create_flightplan(db: Session, fp: schemas.FlightPlanCreate):
    db_fp = models.FlightPlan(
        drone_id=fp.drone_id, plan=fp.plan, created_at=datetime.utcnow()
    )
    db.add(db_fp)
    db.commit()
    db.refresh(db_fp)
    return db_fp


def save_telemetry(db: Session, telemetry: schemas.TelemetryIn):
    try:
        # Handle timestamp - use provided ts or current time
        timestamp = telemetry.ts if telemetry.ts else datetime.utcnow()

        db_t = models.Telemetry(
            drone_id=telemetry.drone_id,
            lat=telemetry.lat,
            lon=telemetry.lon,
            alt=telemetry.alt,
            heading=telemetry.heading if hasattr(telemetry, "heading") else 0.0,
            speed=telemetry.speed if hasattr(telemetry, "speed") else 0.0,
            timestamp=timestamp,
        )
        db.add(db_t)
        db.commit()
        db.refresh(db_t)
        logger.info(f"Saved telemetry for drone {telemetry.drone_id}")
        return db_t
    except Exception as e:
        logger.error(f"Error saving telemetry: {e}")
        db.rollback()
        raise


def get_recent_telemetry(db: Session, seconds: int = 60):
    cutoff = datetime.utcnow() - timedelta(seconds=seconds)
    return db.query(models.Telemetry).filter(models.Telemetry.timestamp >= cutoff).all()


def create_geofence(db: Session, name: str, polygon: list, type: str = "no-fly"):
    gf = models.Geofence(name=name, polygon=polygon, type=type)
    db.add(gf)
    db.commit()
    db.refresh(gf)
    return gf


def list_geofences(db: Session):
    return db.query(models.Geofence).all()
