# # backend/app/api/path.py
# from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
# from sqlalchemy.orm import Session
# from math import radians, sin, cos, sqrt, atan2
# from ..deps import get_db
# from .. import crud
# from ..utils.path import plan_path
# from ..utils.simulator_path import simulate_path, get_drone_status
# import asyncio
# import json

# router = APIRouter(prefix="/api/path", tags=["path"])

# # Active websocket connections
# active_drone_connections = {}
# global_clients = set()

# # ✅ Maintain colors for each drone
# drone_colors = {}
# color_palette = [
#     "#FF0000",
#     "#00FF00",
#     "#0000FF",
#     "#FFA500",
#     "#800080",
#     "#00FFFF",
#     "#FF1493",
#     "#FFD700",
#     "#00CED1",
#     "#8B0000",
# ]
# color_index = 0


# def calculate_distance_km(lat1, lon1, lat2, lon2):
#     """Calculate great-circle distance using Haversine formula."""
#     lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
#     dlon, dlat = lon2 - lon1, lat2 - lat1
#     a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
#     return 6371 * 2 * atan2(sqrt(a), sqrt(1 - a))


# @router.post("/plan")
# def plan_route(payload: dict, db: Session = Depends(get_db)):
#     """Plan a path avoiding geofences."""
#     try:
#         s, g = payload["start"], payload["goal"]
#         step = float(payload.get("step_deg", 0.001))
#         distance_km = calculate_distance_km(s["lat"], s["lon"], g["lat"], g["lon"])

#         # Adjust step dynamically
#         if distance_km > 1000:
#             step = max(step, 0.1)
#         elif distance_km > 500:
#             step = max(step, 0.05)
#         elif distance_km > 100:
#             step = max(step, 0.01)

#         geofences = crud.list_geofences(db)
#         geofence_polygons = [gf.polygon for gf in geofences]

#         path = plan_path(
#             (s["lat"], s["lon"]), (g["lat"], g["lon"]), geofence_polygons, step_deg=step
#         )

#         result_path = [{"lat": p[0], "lon": p[1]} for p in path]
#         return {"ok": True, "path": result_path}

#     except KeyError as e:
#         raise HTTPException(status_code=400, detail=f"Missing field: {e}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


# @router.post("/simulate")
# async def simulate(payload: dict):
#     """Start simulating a drone flight path and broadcast to all clients."""
#     global color_index

#     try:
#         drone_id = int(payload["drone_id"])
#         path = payload["path"]
#         speed = float(payload.get("speed_mps", 12))
#         altitude = float(payload.get("altitude_m", 100))

#         # ✅ Assign a unique color to this drone if not assigned
#         if drone_id not in drone_colors:
#             drone_colors[drone_id] = color_palette[color_index % len(color_palette)]
#             color_index += 1
#         color = drone_colors[drone_id]

#         # Start simulation asynchronously
#         asyncio.create_task(simulate_path(drone_id, path, speed, altitude))

#         # Broadcast to all clients with color info
#         data = {"type": "new_path", "drone_id": drone_id, "path": path, "color": color}
#         await broadcast_to_all(data)

#         return {"ok": True, "message": f"Simulation started for drone {drone_id}."}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")


# @router.websocket("/ws/global")
# async def websocket_all_clients(websocket: WebSocket):
#     """Global WebSocket — all users receive live updates of all drones."""
#     await websocket.accept()
#     global_clients.add(websocket)
#     print(f"Client connected: total {len(global_clients)}")

#     try:
#         while True:
#             await asyncio.sleep(1)
#     except WebSocketDisconnect:
#         global_clients.remove(websocket)
#         print(f"Client disconnected: total {len(global_clients)}")


# @router.websocket("/ws/drone/{drone_id}")
# async def websocket_drone_tracking(websocket: WebSocket, drone_id: int):
#     """WebSocket for individual drone updates + broadcast globally."""
#     await websocket.accept()
#     active_drone_connections[drone_id] = websocket
#     print(f"Drone {drone_id} connected.")

#     try:
#         while True:
#             status = get_drone_status(drone_id)
#             if status:
#                 await websocket.send_json(status)

#                 # ✅ Include color in global broadcast
#                 color = drone_colors.get(drone_id, "#000000")
#                 await broadcast_to_all(
#                     {
#                         "type": "drone_status",
#                         "drone_id": drone_id,
#                         "status": status,
#                         "color": color,
#                     }
#                 )

#             await asyncio.sleep(1)
#     except WebSocketDisconnect:
#         if drone_id in active_drone_connections:
#             del active_drone_connections[drone_id]
#         print(f"Drone {drone_id} disconnected.")


# async def broadcast_to_all(message: dict):
#     """Send JSON message to all connected global WebSocket clients."""
#     dead_clients = []
#     for ws in list(global_clients):
#         try:
#             await ws.send_json(message)
#         except Exception:
#             dead_clients.append(ws)
#     for ws in dead_clients:
#         global_clients.remove(ws)


# @router.get("/drone/{drone_id}/status")
# async def get_drone_status_endpoint(drone_id: int):
#     """Return the latest status for a given drone."""
#     status = get_drone_status(drone_id)
#     if not status:
#         raise HTTPException(status_code=404, detail="Drone not found")
#     return status


# @router.get("/geofences")
# def get_geofences(db: Session = Depends(get_db)):
#     """Return all geofences."""
#     geofences = crud.list_geofences(db)
#     result = []
#     for gf in geofences:
#         polygon = gf.polygon if isinstance(gf.polygon, list) else json.loads(gf.polygon)
#         result.append(
#             {"id": gf.id, "name": gf.name, "type": gf.type, "polygon": polygon}
#         )
#     return result


# from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
# from sqlalchemy.orm import Session
# from math import radians, sin, cos, sqrt, atan2
# from ..deps import get_db
# from .. import crud
# from ..utils.path import plan_path
# from ..utils.simulator_path import simulate_path, get_drone_status
# import asyncio
# import json

# router = APIRouter(prefix="/api/path", tags=["path"])

# # Active websocket connections
# active_drone_connections = {}
# global_clients = set()

# # ✅ Maintain state for active flight paths and colors
# drone_colors = {}
# active_paths = {}
# color_palette = [
#     "#FF0000",
#     "#00FF00",
#     "#0000FF",
#     "#FFA500",
#     "#800080",
#     "#00FFFF",
#     "#FF1493",
#     "#FFD700",
#     "#00CED1",
#     "#8B0000",
# ]
# color_index = 0


# def calculate_distance_km(lat1, lon1, lat2, lon2):
#     lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
#     dlon, dlat = lon2 - lon1, lat2 - lat1
#     a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
#     return 6371 * 2 * atan2(sqrt(a), sqrt(1 - a))


# @router.post("/plan")
# async def plan_route(payload: dict, db: Session = Depends(get_db)):
#     """Plan a path and broadcast it to all clients (before simulation)."""
#     global color_index

#     try:
#         s, g = payload["start"], payload["goal"]
#         step = float(payload.get("step_deg", 0.001))
#         distance_km = calculate_distance_km(s["lat"], s["lon"], g["lat"], g["lon"])

#         # Adjust step dynamically
#         if distance_km > 1000:
#             step = max(step, 0.1)
#         elif distance_km > 500:
#             step = max(step, 0.05)
#         elif distance_km > 100:
#             step = max(step, 0.01)

#         geofences = crud.list_geofences(db)
#         geofence_polygons = [gf.polygon for gf in geofences]

#         path = plan_path(
#             (s["lat"], s["lon"]), (g["lat"], g["lon"]), geofence_polygons, step_deg=step
#         )

#         result_path = [{"lat": p[0], "lon": p[1]} for p in path]

#         # Assign a new drone id & color
#         drone_id = max(active_paths.keys(), default=1000) + 1
#         if drone_id not in drone_colors:
#             drone_colors[drone_id] = color_palette[color_index % len(color_palette)]
#             color_index += 1
#         color = drone_colors[drone_id]

#         # Save in memory
#         active_paths[drone_id] = result_path

#         # ✅ Broadcast the new path to all connected users
#         await broadcast_to_all(
#             {
#                 "type": "new_path",
#                 "drone_id": drone_id,
#                 "path": result_path,
#                 "color": color,
#             }
#         )

#         return {"ok": True, "drone_id": drone_id, "path": result_path}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Path planning error: {str(e)}")


# @router.post("/simulate")
# async def simulate(payload: dict):
#     """Start simulating a drone and broadcast updates."""
#     try:
#         drone_id = int(payload["drone_id"])
#         path = payload["path"]
#         speed = float(payload.get("speed_mps", 12))
#         altitude = float(payload.get("altitude_m", 100))

#         # Ensure color assigned
#         if drone_id not in drone_colors:
#             drone_colors[drone_id] = color_palette[
#                 len(drone_colors) % len(color_palette)
#             ]
#         color = drone_colors[drone_id]

#         # Store path if not already
#         active_paths[drone_id] = path

#         asyncio.create_task(simulate_path(drone_id, path, speed, altitude))

#         # Broadcast to everyone so they know simulation started
#         await broadcast_to_all(
#             {"type": "new_path", "drone_id": drone_id, "path": path, "color": color}
#         )

#         return {"ok": True, "message": f"Simulation started for drone {drone_id}."}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")


# @router.websocket("/ws/global")
# async def websocket_all_clients(websocket: WebSocket):
#     """Each connected client receives all existing + future drone updates."""
#     await websocket.accept()
#     global_clients.add(websocket)
#     print(f"🌍 Client connected. Total clients: {len(global_clients)}")

#     # ✅ Send all existing paths immediately to new client
#     for drone_id, path in active_paths.items():
#         color = drone_colors.get(drone_id, "#008000")
#         await websocket.send_json(
#             {"type": "new_path", "drone_id": drone_id, "path": path, "color": color}
#         )

#     try:
#         while True:
#             await asyncio.sleep(1)
#     except WebSocketDisconnect:
#         global_clients.remove(websocket)
#         print(f"❌ Client disconnected. Total: {len(global_clients)}")


# @router.websocket("/ws/drone/{drone_id}")
# async def websocket_drone_tracking(websocket: WebSocket, drone_id: int):
#     """Dedicated WebSocket for drone simulation updates."""
#     await websocket.accept()
#     active_drone_connections[drone_id] = websocket
#     print(f"🛰️ Drone {drone_id} connected.")

#     try:
#         while True:
#             status = get_drone_status(drone_id)
#             if status:
#                 color = drone_colors.get(drone_id, "#000000")
#                 await broadcast_to_all(
#                     {
#                         "type": "drone_status",
#                         "drone_id": drone_id,
#                         "status": status,
#                         "color": color,
#                     }
#                 )
#             await asyncio.sleep(1)
#     except WebSocketDisconnect:
#         active_drone_connections.pop(drone_id, None)
#         print(f"❌ Drone {drone_id} disconnected.")


# async def broadcast_to_all(message: dict):
#     """Send JSON message to all connected global WebSocket clients."""
#     dead_clients = []
#     for ws in list(global_clients):
#         try:
#             await ws.send_json(message)
#         except Exception:
#             dead_clients.append(ws)
#     for ws in dead_clients:
#         global_clients.remove(ws)


# @router.get("/drone/{drone_id}/status")
# async def get_drone_status_endpoint(drone_id: int):
#     status = get_drone_status(drone_id)
#     if not status:
#         raise HTTPException(status_code=404, detail="Drone not found")
#     return status


# @router.get("/geofences")
# def get_geofences(db: Session = Depends(get_db)):
#     geofences = crud.list_geofences(db)
#     result = []
#     for gf in geofences:
#         polygon = gf.polygon if isinstance(gf.polygon, list) else json.loads(gf.polygon)
#         result.append(
#             {
#                 "id": gf.id,
#                 "name": gf.name,
#                 "type": gf.type,
#                 "polygon": polygon,
#             }
#         )
#     return result


# from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
# from sqlalchemy.orm import Session
# from math import radians, sin, cos, sqrt, atan2
# from ..deps import get_db
# from .. import crud
# from ..utils.path import plan_path
# from ..utils.simulator_path import simulate_path, get_drone_status
# import asyncio
# import json
# import random

# router = APIRouter(prefix="/api/path", tags=["path"])

# # ----------------------------
# # Global States
# # ----------------------------
# active_drone_connections = {}  # { drone_id: websocket }
# global_clients = set()  # set of WebSocket clients
# drone_colors = {}  # { drone_id: color }
# active_paths = {}  # { drone_id: path }
# client_to_drone = {}  # { websocket: drone_id }

# color_palette = [
#     "#FF0000",
#     "#00FF00",
#     "#0000FF",
#     "#FFA500",
#     "#800080",
#     "#00FFFF",
#     "#FF1493",
#     "#FFD700",
#     "#00CED1",
#     "#8B0000",
# ]


# # ----------------------------
# # Utility: distance in km
# # ----------------------------
# def calculate_distance_km(lat1, lon1, lat2, lon2):
#     lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
#     dlon, dlat = lon2 - lon1, lat2 - lat1
#     a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
#     return 6371 * 2 * atan2(sqrt(a), sqrt(1 - a))


# # ----------------------------
# # Path planning endpoint
# # ----------------------------
# @router.post("/plan")
# async def plan_route(payload: dict, db: Session = Depends(get_db)):
#     """Plans a path and broadcasts it to everyone (each user keeps their own drone)."""
#     try:
#         s, g = payload["start"], payload["goal"]
#         step = float(payload.get("step_deg", 0.001))
#         distance_km = calculate_distance_km(s["lat"], s["lon"], g["lat"], g["lon"])

#         # Adjust step dynamically based on distance
#         if distance_km > 1000:
#             step = max(step, 0.1)
#         elif distance_km > 500:
#             step = max(step, 0.05)
#         elif distance_km > 100:
#             step = max(step, 0.01)

#         geofences = crud.list_geofences(db)
#         geofence_polygons = [gf.polygon for gf in geofences]

#         path = plan_path(
#             (s["lat"], s["lon"]), (g["lat"], g["lon"]), geofence_polygons, step_deg=step
#         )

#         result_path = [{"lat": p[0], "lon": p[1]} for p in path]

#         # Assign a unique drone_id
#         drone_id = random.randint(1000, 9999)
#         while drone_id in active_paths:
#             drone_id = random.randint(1000, 9999)

#         # Assign a color
#         color = color_palette[len(drone_colors) % len(color_palette)]
#         drone_colors[drone_id] = color

#         # Save to active state
#         active_paths[drone_id] = result_path

#         # Broadcast to all
#         await broadcast_to_all(
#             {
#                 "type": "new_path",
#                 "drone_id": drone_id,
#                 "path": result_path,
#                 "color": color,
#             }
#         )

#         return {"ok": True, "drone_id": drone_id, "path": result_path}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Path planning error: {str(e)}")


# # ----------------------------
# # Simulation endpoint
# # ----------------------------
# @router.post("/simulate")
# async def simulate(payload: dict):
#     """Starts simulation for only the drone belonging to the user who pressed it."""
#     try:
#         drone_id = int(payload["drone_id"])
#         path = payload["path"]
#         speed = float(payload.get("speed_mps", 12))
#         altitude = float(payload.get("altitude_m", 100))

#         if drone_id not in active_paths:
#             raise HTTPException(
#                 status_code=400, detail="Path not found for this drone."
#             )

#         if drone_id not in drone_colors:
#             drone_colors[drone_id] = color_palette[
#                 len(drone_colors) % len(color_palette)
#             ]

#         color = drone_colors[drone_id]

#         # Start drone simulation
#         asyncio.create_task(simulate_path(drone_id, path, speed, altitude))

#         # Inform everyone that simulation started
#         await broadcast_to_all(
#             {
#                 "type": "simulation_start",
#                 "drone_id": drone_id,
#                 "path": path,
#                 "color": color,
#             }
#         )

#         return {"ok": True, "message": f"Simulation started for drone {drone_id}"}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")


# # ----------------------------
# # Global WebSocket (shared map)
# # ----------------------------
# @router.websocket("/ws/global")
# async def websocket_all_clients(websocket: WebSocket):
#     """Each connected client sees all drones' paths and updates."""
#     await websocket.accept()
#     global_clients.add(websocket)

#     # Assign a new unique drone to this client
#     drone_id = random.randint(1000, 9999)
#     client_to_drone[websocket] = drone_id
#     drone_colors[drone_id] = color_palette[len(drone_colors) % len(color_palette)]
#     print(
#         f"🌍 Client connected (drone {drone_id}). Total clients: {len(global_clients)}"
#     )

#     # Send all existing paths and their colors
#     for d_id, path in active_paths.items():
#         color = drone_colors.get(d_id, "#008000")
#         await websocket.send_json(
#             {
#                 "type": "new_path",
#                 "drone_id": d_id,
#                 "path": path,
#                 "color": color,
#             }
#         )

#     # Send back the user's assigned drone_id
#     await websocket.send_json({"type": "assign_drone", "drone_id": drone_id})

#     try:
#         while True:
#             await asyncio.sleep(1)
#     except WebSocketDisconnect:
#         global_clients.remove(websocket)
#         client_to_drone.pop(websocket, None)
#         print(f"❌ Client disconnected. Total: {len(global_clients)}")


# # ----------------------------
# # Drone-specific WebSocket
# # ----------------------------
# @router.websocket("/ws/drone/{drone_id}")
# async def websocket_drone_tracking(websocket: WebSocket, drone_id: int):
#     """Tracks live simulation of a drone."""
#     await websocket.accept()
#     active_drone_connections[drone_id] = websocket
#     print(f"🛰️ Drone {drone_id} connected for live updates.")

#     try:
#         while True:
#             status = get_drone_status(drone_id)
#             if status:
#                 color = drone_colors.get(drone_id, "#000000")
#                 await broadcast_to_all(
#                     {
#                         "type": "drone_status",
#                         "drone_id": drone_id,
#                         "status": status,
#                         "color": color,
#                     }
#                 )
#             await asyncio.sleep(1)
#     except WebSocketDisconnect:
#         active_drone_connections.pop(drone_id, None)
#         print(f"❌ Drone {drone_id} disconnected.")


# # ----------------------------
# # Broadcast helper
# # ----------------------------
# async def broadcast_to_all(message: dict):
#     """Send a JSON message to all global WebSocket clients."""
#     dead_clients = []
#     for ws in list(global_clients):
#         try:
#             await ws.send_json(message)
#         except Exception:
#             dead_clients.append(ws)
#     for ws in dead_clients:
#         global_clients.remove(ws)


# # ----------------------------
# # Drone status REST endpoint
# # ----------------------------
# @router.get("/drone/{drone_id}/status")
# async def get_drone_status_endpoint(drone_id: int):
#     status = get_drone_status(drone_id)
#     if not status:
#         raise HTTPException(status_code=404, detail="Drone not found")
#     return status


# # ----------------------------
# # Geofences
# # ----------------------------
# @router.get("/geofences")
# def get_geofences(db: Session = Depends(get_db)):
#     geofences = crud.list_geofences(db)
#     result = []
#     for gf in geofences:
#         polygon = gf.polygon if isinstance(gf.polygon, list) else json.loads(gf.polygon)
#         result.append(
#             {
#                 "id": gf.id,
#                 "name": gf.name,
#                 "type": gf.type,
#                 "polygon": polygon,
#             }
#         )
#     return result


# from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
# from sqlalchemy.orm import Session
# from math import radians, sin, cos, sqrt, atan2
# from ..deps import get_db
# from .. import crud
# from ..utils.path import plan_path
# from ..utils.simulator_path import simulate_path, get_drone_status
# import asyncio
# import json

# router = APIRouter(prefix="/api/path", tags=["path"])

# # Global state
# active_paths = {}
# drone_colors = {}
# global_clients = set()
# color_palette = [
#     "#FF0000",
#     "#00FF00",
#     "#0000FF",
#     "#FFA500",
#     "#800080",
#     "#00FFFF",
#     "#FF1493",
#     "#FFD700",
#     "#00CED1",
#     "#8B0000",
# ]
# color_index = 0


# def calculate_distance_km(lat1, lon1, lat2, lon2):
#     lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
#     dlon, dlat = lon2 - lon1, lat2 - lat1
#     a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
#     return 6371 * 2 * atan2(sqrt(a), sqrt(1 - a))


# @router.post("/plan")
# async def plan_route(payload: dict, db: Session = Depends(get_db)):
#     """Plan a flight path and broadcast to all clients."""
#     global color_index
#     try:
#         s, g = payload["start"], payload["goal"]
#         step = float(payload.get("step_deg", 0.001))
#         distance_km = calculate_distance_km(s["lat"], s["lon"], g["lat"], g["lon"])

#         if distance_km > 1000:
#             step = max(step, 0.1)
#         elif distance_km > 500:
#             step = max(step, 0.05)
#         elif distance_km > 100:
#             step = max(step, 0.01)

#         geofences = crud.list_geofences(db)
#         geofence_polygons = [gf.polygon for gf in geofences]

#         path = plan_path(
#             (s["lat"], s["lon"]), (g["lat"], g["lon"]), geofence_polygons, step_deg=step
#         )

#         result_path = [{"lat": p[0], "lon": p[1]} for p in path]
#         drone_id = max(active_paths.keys(), default=1000) + 1

#         if drone_id not in drone_colors:
#             drone_colors[drone_id] = color_palette[color_index % len(color_palette)]
#             color_index += 1
#         color = drone_colors[drone_id]

#         active_paths[drone_id] = result_path

#         await broadcast_to_all(
#             {
#                 "type": "new_path",
#                 "drone_id": drone_id,
#                 "path": result_path,
#                 "color": color,
#             }
#         )

#         return {"ok": True, "drone_id": drone_id, "path": result_path}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Path planning error: {str(e)}")


# @router.post("/simulate")
# async def simulate(payload: dict):
#     """Start simulation for the given drone."""
#     try:
#         drone_id = int(payload["drone_id"])
#         path = payload["path"]
#         speed = float(payload.get("speed_mps", 12))
#         altitude = float(payload.get("altitude_m", 100))

#         if drone_id not in active_paths:
#             active_paths[drone_id] = path

#         if drone_id not in drone_colors:
#             drone_colors[drone_id] = color_palette[
#                 len(drone_colors) % len(color_palette)
#             ]
#         color = drone_colors[drone_id]

#         # ✅ Launch a dedicated async simulation for this drone
#         asyncio.create_task(
#             run_drone_simulation(drone_id, path, speed, altitude, color)
#         )

#         return {"ok": True, "message": f"Simulation started for drone {drone_id}"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")


# async def run_drone_simulation(drone_id, path, speed, altitude, color):
#     """Simulate and broadcast drone's live position."""
#     async for status in simulate_path(drone_id, path, speed, altitude):
#         await broadcast_to_all(
#             {
#                 "type": "drone_status",
#                 "drone_id": drone_id,
#                 "status": status,
#                 "color": color,
#             }
#         )


# @router.websocket("/ws/global")
# async def websocket_all_clients(websocket: WebSocket):
#     """Each client sees all flight paths and drone simulations."""
#     await websocket.accept()
#     global_clients.add(websocket)
#     print(f"🌍 Client connected. Total clients: {len(global_clients)}")

#     # Send all existing flight paths
#     for drone_id, path in active_paths.items():
#         color = drone_colors.get(drone_id, "#008000")
#         await websocket.send_json(
#             {"type": "new_path", "drone_id": drone_id, "path": path, "color": color}
#         )

#     try:
#         while True:
#             await asyncio.sleep(1)
#     except WebSocketDisconnect:
#         global_clients.remove(websocket)
#         print(f"❌ Client disconnected. Total: {len(global_clients)}")


# async def broadcast_to_all(message: dict):
#     """Send JSON to all connected global clients."""
#     disconnected = []
#     for ws in list(global_clients):
#         try:
#             await ws.send_json(message)
#         except Exception:
#             disconnected.append(ws)
#     for ws in disconnected:
#         global_clients.remove(ws)


# @router.get("/drone/{drone_id}/status")
# async def get_drone_status_endpoint(drone_id: int):
#     status = get_drone_status(drone_id)
#     if not status:
#         raise HTTPException(status_code=404, detail="Drone not found")
#     return status


# @router.get("/geofences")
# def get_geofences(db: Session = Depends(get_db)):
#     geofences = crud.list_geofences(db)
#     result = []
#     for gf in geofences:
#         polygon = gf.polygon if isinstance(gf.polygon, list) else json.loads(gf.polygon)
#         result.append(
#             {
#                 "id": gf.id,
#                 "name": gf.name,
#                 "type": gf.type,
#                 "polygon": polygon,
#             }
#         )
#     return result


# Current

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from math import radians, sin, cos, sqrt, atan2
from ..deps import get_db
from .. import crud
from ..utils.path import plan_path
from ..utils.simulator_path import simulate_path, get_drone_status
import asyncio
import json
import random
import time

router = APIRouter(prefix="/api/path", tags=["path"])

# 🌍 Global state
active_paths = {}
drone_colors = {}
drone_positions = {}
global_clients = set()
weather_zones = []
color_palette = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFA500",
    "#800080",
    "#00FFFF",
    "#FF1493",
    "#FFD700",
    "#00CED1",
    "#8B0000",
]
color_index = 0


# ============================================================
# 🧭 Utility Functions
# ============================================================
def calculate_distance_km(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlon, dlat = lon2 - lon1, lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    return 6371 * 2 * atan2(sqrt(a), sqrt(1 - a))


def random_weather_zone():
    """Generate random dynamic weather zones (bad weather areas)."""
    lat = random.uniform(-90, 90)
    lon = random.uniform(-180, 180)
    radius = random.uniform(0.1, 2.0)  # degrees
    return {"center": (lat, lon), "radius": radius}


def is_in_weather_zone(lat, lon):
    """Check if a point is inside any weather zone."""
    for wz in weather_zones:
        clat, clon = wz["center"]
        dist = calculate_distance_km(lat, lon, clat, clon)
        if dist < wz["radius"] * 100:  # 1 deg ≈ 111 km
            return True
    return False


# ============================================================
# 🚀 Path Planning Endpoint
# ============================================================
@router.post("/plan")
async def plan_route(payload: dict, db: Session = Depends(get_db)):
    global color_index
    try:
        s, g = payload["start"], payload["goal"]
        step = float(payload.get("step_deg", 0.001))
        distance_km = calculate_distance_km(s["lat"], s["lon"], g["lat"], g["lon"])

        # Adjust step dynamically for large distances
        if distance_km > 1000:
            step = max(step, 0.1)
        elif distance_km > 500:
            step = max(step, 0.05)
        elif distance_km > 100:
            step = max(step, 0.01)

        geofences = crud.list_geofences(db)
        geofence_polygons = [gf.polygon for gf in geofences]

        path = plan_path(
            (s["lat"], s["lon"]), (g["lat"], g["lon"]), geofence_polygons, step_deg=step
        )

        result_path = [{"lat": p[0], "lon": p[1]} for p in path]
        drone_id = max(active_paths.keys(), default=1000) + 1

        # Assign color
        if drone_id not in drone_colors:
            drone_colors[drone_id] = color_palette[color_index % len(color_palette)]
            color_index += 1

        color = drone_colors[drone_id]
        active_paths[drone_id] = result_path

        await broadcast_to_all(
            {
                "type": "new_path",
                "drone_id": drone_id,
                "path": result_path,
                "color": color,
            }
        )

        return {"ok": True, "drone_id": drone_id, "path": result_path}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Path planning error: {str(e)}")


# ============================================================
# ✈️ Simulation Endpoint
# ============================================================
@router.post("/simulate")
async def simulate(payload: dict):
    try:
        drone_id = int(payload["drone_id"])
        path = payload["path"]
        speed = float(payload.get("speed_mps", 20))  # ⏩ Adjusted faster default
        altitude = float(payload.get("altitude_m", 100))

        if drone_id not in active_paths:
            active_paths[drone_id] = path

        if drone_id not in drone_colors:
            drone_colors[drone_id] = color_palette[
                len(drone_colors) % len(color_palette)
            ]

        color = drone_colors[drone_id]

        asyncio.create_task(
            run_drone_simulation(drone_id, path, speed, altitude, color)
        )

        return {"ok": True, "message": f"Simulation started for drone {drone_id}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")


# ============================================================
# 🧠 Simulation Logic with Dynamic Rerouting
# ============================================================
async def run_drone_simulation(drone_id, path, speed, altitude, color):
    global weather_zones

    async for status in simulate_path(drone_id, path, speed, altitude):
        lat, lon = status["lat"], status["lon"]
        drone_positions[drone_id] = (lat, lon)

        # ⚠️ Predictive Collision Avoidance
        for other_id, (olat, olon) in drone_positions.items():
            if other_id != drone_id:
                dist = calculate_distance_km(lat, lon, olat, olon)
                if dist < 0.05:  # 50 meters
                    print(
                        f"🚨 Predicted Collision between Drone {drone_id} & {other_id}"
                    )
                    await reroute_drone(drone_id, path, lat, lon)
                    break

        # 🌦️ Dynamic Weather Updates
        if random.random() < 0.02:  # 2% chance to update weather zone
            weather_zones.append(random_weather_zone())

        if is_in_weather_zone(lat, lon):
            print(f"🌩️ Drone {drone_id} entered bad weather zone — rerouting...")
            await reroute_drone(drone_id, path, lat, lon)
            continue

        # 🛰️ Broadcast live drone position
        await broadcast_to_all(
            {
                "type": "drone_status",
                "drone_id": drone_id,
                "status": status,
                "color": color,
            }
        )

        await asyncio.sleep(0.2)  # 🔧 Adjust speed here (smaller = faster)

    print(f"✅ Drone {drone_id} simulation complete.")


# ============================================================
# 🔄 Dynamic Rerouting
# ============================================================
async def reroute_drone(drone_id, path, lat, lon):
    """Recalculate path from current position to goal avoiding geofences + weather."""
    try:
        goal = path[-1]
        new_path = await asyncio.to_thread(
            plan_path, (lat, lon), (goal["lat"], goal["lon"]), [], step_deg=0.001
        )

        new_result_path = [{"lat": p[0], "lon": p[1]} for p in new_path]
        active_paths[drone_id] = new_result_path

        await broadcast_to_all(
            {
                "type": "new_path",
                "drone_id": drone_id,
                "path": new_result_path,
                "color": drone_colors[drone_id],
                "rerouted": True,
            }
        )

    except Exception as e:
        print(f"❌ Rerouting failed for drone {drone_id}: {e}")


# ============================================================
# 🌐 WebSocket for Global Clients
# ============================================================
@router.websocket("/ws/global")
async def websocket_all_clients(websocket: WebSocket):
    await websocket.accept()
    global_clients.add(websocket)
    print(f"🌍 Client connected. Total clients: {len(global_clients)}")

    for drone_id, path in active_paths.items():
        color = drone_colors.get(drone_id, "#008000")
        await websocket.send_json(
            {
                "type": "new_path",
                "drone_id": drone_id,
                "path": path,
                "color": color,
            }
        )

    try:
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        global_clients.remove(websocket)
        print(f"❌ Client disconnected. Total: {len(global_clients)}")


# ============================================================
# 📡 Broadcast Utility
# ============================================================
async def broadcast_to_all(message: dict):
    disconnected = []
    for ws in list(global_clients):
        try:
            await ws.send_json(message)
        except Exception:
            disconnected.append(ws)
    for ws in disconnected:
        global_clients.remove(ws)


# ============================================================
# 🛰️ Drone Status + Geofence Endpoint
# ============================================================
@router.get("/drone/{drone_id}/status")
async def get_drone_status_endpoint(drone_id: int):
    status = get_drone_status(drone_id)
    if not status:
        raise HTTPException(status_code=404, detail="Drone not found")
    return status


@router.get("/geofences")
def get_geofences(db: Session = Depends(get_db)):
    geofences = crud.list_geofences(db)
    result = []
    for gf in geofences:
        polygon = gf.polygon if isinstance(gf.polygon, list) else json.loads(gf.polygon)
        result.append(
            {
                "id": gf.id,
                "name": gf.name,
                "type": gf.type,
                "polygon": polygon,
            }
        )
    return result
