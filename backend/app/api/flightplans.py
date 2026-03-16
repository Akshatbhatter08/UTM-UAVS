
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import get_db
from .. import schemas, crud, models
from ..utils.geo import point_in_polygon, haversine_distance
from typing import List

router = APIRouter(prefix='/api/flightplans', tags=['flightplans'])

@router.post('/', response_model=schemas.FlightPlanCreate)
def create_fp(fp: schemas.FlightPlanCreate, db: Session = Depends(get_db)):
    # Validate: ensure waypoints are not inside any no-fly geofence
    geofences = crud.list_geofences(db)
    # each geofence.polygon is stored as [[lat, lon], ...]
    for wp in fp.plan:
        lat = wp.get('lat'); lon = wp.get('lon')
        for gf in geofences:
            if point_in_polygon(lat, lon, gf.polygon):
                raise HTTPException(status_code=400, detail=f'Waypoint inside geofence: {gf.name} (type={gf.type})')
    # Conflict detection: ensure waypoints aren't too close to recent telemetry (within 100m)
    recent = crud.get_recent_telemetry(db, seconds=120)
    for wp in fp.plan:
        for t in recent:
            d = haversine_distance(wp.get('lat'), wp.get('lon'), t.lat, t.lon)
            if d < 100:
                raise HTTPException(status_code=400, detail=f'Waypoint too close to recent traffic (drone {t.drone_id}, {int(d)} m)')
    # If passes checks, create flightplan
    return crud.create_flightplan(db, fp)
