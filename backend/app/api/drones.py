# backend/app/api/drones.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..deps import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/drones", tags=["drones"])


@router.post("/", response_model=schemas.DroneOut)
def create_drone(
    drone: schemas.DroneCreate, owner_id: int = 1, db: Session = Depends(get_db)
):
    return crud.create_drone(db, owner_id, drone)


@router.get("/", response_model=List[schemas.DroneOut])
def get_drones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    drones = crud.get_drones(db, skip=skip, limit=limit)
    return drones
