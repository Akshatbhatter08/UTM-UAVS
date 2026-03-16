
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from ..deps import get_db
# from .. import schemas, crud
# from ..websocket import manager

# router = APIRouter(prefix='/api/telemetry', tags=['telemetry'])

# @router.post('/ingest')
# def ingest_telemetry(t: schemas.TelemetryIn, db: Session = Depends(get_db)):
#     # save to DB
#     saved = crud.save_telemetry(db, t)
#     # broadcast to websocket clients
#     payload = {'type':'telemetry','drone_id': t.drone_id, 'lat': t.lat, 'lon': t.lon, 'alt': t.alt}
#     # fire and forget
#     import asyncio
#     asyncio.create_task(manager.broadcast(payload))
#     return {'status':'ok', 'id': saved.id}






# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from ..deps import get_db
# from .. import schemas, crud
# from ..websocket import manager
# import logging

# logger = logging.getLogger(__name__)

# router = APIRouter(prefix="/api/telemetry", tags=["telemetry"])

# @router.post("/ingest")
# async def ingest_telemetry(t: schemas.TelemetryIn, db: Session = Depends(get_db)):
#     try:
#         logger.info(f"Received telemetry: {t}")
#         # save to DB
#         saved = crud.save_telemetry(db, t)
#         # broadcast to websocket clients
#         payload = {
#             "type": "telemetry",
#             "drone_id": t.drone_id,
#             "lat": t.lat,
#             "lon": t.lon,
#             "alt": t.alt,
#         }
#         await manager.broadcast(payload)
#         return {"status": "ok", "id": saved.id}
#     except Exception as e:
#         logger.exception("Error ingesting telemetry")
#         raise HTTPException(status_code=500, detail=str(e))





from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..deps import get_db
from .. import schemas, crud
from ..websocket import manager
import asyncio

router = APIRouter(prefix='/api/telemetry', tags=['telemetry'])

@router.post('/ingest')
async def ingest_telemetry(t: schemas.TelemetryIn, db: Session = Depends(get_db)):
    # Save to DB
    saved = crud.save_telemetry(db, t)
    # Prepare WS payload
    payload = {
        'type': 'telemetry',
        'drone_id': t.drone_id,
        'lat': t.lat,
        'lon': t.lon,
        'alt': t.alt
    }
    # Broadcast in background
    asyncio.create_task(manager.broadcast(payload))
    return {'status': 'ok', 'id': saved.id}
