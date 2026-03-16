from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


# ====================================
# 🔐 Authentication Schemas
# ====================================


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    is_admin: bool = False

    class Config:
        orm_mode = True


# ====================================
# 🚁 Drone Schemas
# ====================================


class DroneCreate(BaseModel):
    id: int
    name: str
    model: str = "Simulation"
    status: str = "active"
    max_speed: Optional[float] = 15.0
    owner_id: Optional[int] = None


class DroneOut(BaseModel):
    id: int
    name: str
    owner_id: Optional[int] = None
    max_speed: float
    model: str
    status: str

    class Config:
        orm_mode = True


# ====================================
# 🧭 Geofence Schemas
# ====================================


class GeofenceOut(BaseModel):
    id: int
    name: str
    polygon: List[List[float]]
    type: str
    created_at: datetime

    class Config:
        orm_mode = True


# ====================================
# 🗺️ Flight Plan Schemas
# ====================================


class FlightPlanCreate(BaseModel):
    drone_id: int
    plan: Any  # list of {lat, lon}, flexible format


class FlightPlanOut(BaseModel):
    id: int
    drone_id: int
    plan: Any
    created_at: datetime
    owner_email: Optional[str] = None  # To show who planned it

    class Config:
        orm_mode = True


# ====================================
# 📡 Telemetry & Status Schemas
# ====================================


class TelemetryIn(BaseModel):
    drone_id: int
    lat: float
    lon: float
    alt: Optional[float] = 0.0
    heading: Optional[float] = 0.0
    speed: Optional[float] = 0.0
    ts: Optional[datetime] = None


class DroneStatus(BaseModel):
    drone_id: int
    lat: float
    lon: float
    alt: float
    speed: float
    heading: float
    ts: datetime


# ====================================
# 🌍 Global Broadcast Messages
# ====================================


class BroadcastMessage(BaseModel):
    type: str  # e.g., "new_path", "drone_status"
    drone_id: Optional[int] = None
    path: Optional[List[dict]] = None
    status: Optional[DroneStatus] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
