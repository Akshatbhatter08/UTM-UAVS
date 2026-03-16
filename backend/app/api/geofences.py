
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..deps import get_db
from .. import crud, schemas

router = APIRouter(prefix='/api/geofences', tags=['geofences'])

@router.post('/')
def create_geofence(payload: dict, db: Session = Depends(get_db)):
    name = payload.get('name'); polygon = payload.get('polygon'); gtype = payload.get('type','no-fly')
    gf = crud.create_geofence(db, name, polygon, gtype)
    return {'status':'ok', 'id': gf.id}

@router.get('/')
def list_geofences(db: Session = Depends(get_db)):
    gfs = crud.list_geofences(db)
    return [{'id': g.id, 'name': g.name, 'polygon': g.polygon, 'type': g.type} for g in gfs]
