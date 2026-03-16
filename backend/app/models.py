from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    JSON,
    ForeignKey,
    Boolean,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import datetime

Base = declarative_base()


# ========================
# USER MODEL
# ========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)  # ✅ for email verification
    verification_code = Column(String, nullable=True)  # ✅ email OTP code
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    drones = relationship("Drone", back_populates="owner", cascade="all, delete-orphan")
    flight_plans = relationship(
        "FlightPlan", back_populates="user", cascade="all, delete-orphan"
    )


# ========================
# DRONE MODEL
# ========================
class Drone(Base):
    __tablename__ = "drones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    model = Column(String, default="Generic")
    status = Column(String, default="inactive")
    max_speed = Column(Float, default=15.0)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="drones")
    telemetry = relationship(
        "Telemetry", back_populates="drone", cascade="all, delete-orphan"
    )
    flight_plans = relationship(
        "FlightPlan", back_populates="drone", cascade="all, delete-orphan"
    )


# ========================
# FLIGHT PLAN MODEL
# ========================
class FlightPlan(Base):
    __tablename__ = "flight_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    drone_id = Column(Integer, ForeignKey("drones.id"))  # ✅ added this link back
    drone_name = Column(String, nullable=False)
    source = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    path = Column(JSON, nullable=False)  # list of coordinates [{lat, lng}, ...]
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="flight_plans")
    drone = relationship("Drone", back_populates="flight_plans")


# ========================
# TELEMETRY MODEL
# ========================
class Telemetry(Base):
    __tablename__ = "telemetry"

    id = Column(Integer, primary_key=True, index=True)
    drone_id = Column(Integer, ForeignKey("drones.id"))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    lat = Column(Float)
    lon = Column(Float)
    alt = Column(Float, default=0.0)
    heading = Column(Float, default=0.0)
    speed = Column(Float, default=0.0)
    raw = Column(JSON, default={})

    # Relationship
    drone = relationship("Drone", back_populates="telemetry")


# ========================
# GEOFENCE MODEL
# ========================
class Geofence(Base):
    __tablename__ = "geofences"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    polygon = Column(JSON, nullable=False)
    type = Column(String, default="no-fly")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
