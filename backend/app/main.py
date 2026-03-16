# # import asyncio
# # from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# # from fastapi.middleware.cors import CORSMiddleware
# # from .websocket import manager
# # from .tasks import start_simulator_task
# # from .api import (
# #     auth as auth_router,
# #     drones as drones_router,
# #     flightplans as fps_router,
# #     users as users_router,
# #     telemetry as telemetry_router,
# #     geofences as geofences_router,
# # )

# # # new
# # from .api import path as path_router

# # app = FastAPI(title="UTM UAV Backend")

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # app.include_router(auth_router.router)
# # app.include_router(drones_router.router)
# # app.include_router(fps_router.router)
# # app.include_router(users_router.router)
# # app.include_router(telemetry_router.router)
# # app.include_router(geofences_router.router)
# # # new
# # app.include_router(path_router.router)


# # @app.get("/")
# # async def root():
# #     return {"message": "UTM UAV Backend running"}


# # @app.on_event("startup")
# # async def startup():
# #     # kick off simulator in background
# #     app.state.sim_task = asyncio.create_task(start_simulator_task())


# # # @app.websocket('/ws/telemetry')
# # # async def ws_endpoint(ws: WebSocket):
# # #     await manager.connect(ws)
# # #     try:
# # #         while True:
# # #             # keep alive; frontend doesn't need to send anything
# # #             await ws.receive_text()
# # #     except WebSocketDisconnect:
# # #         manager.disconnect(ws)


# # @app.websocket("/ws/telemetry")
# # async def ws_endpoint(ws: WebSocket):
# #     await manager.connect(ws)
# #     try:
# #         while True:
# #             message = await ws.receive_text()
# #             try:
# #                 data = json.loads(message)
# #                 if data.get("type") == "start_simulation":
# #                     path = data.get("path", [])
# #                     drone_id = data.get("drone_id", "SimDrone-1")
# #                     speed = float(data.get("speed", 1.0))
# #                     print(
# #                         f"🚀 Starting simulation for {drone_id} with {len(path)} points"
# #                     )
# #                     asyncio.create_task(
# #                         simulate_drone_flight(ws, path, drone_id, speed)
# #                     )
# #                 else:
# #                     print("Unknown message:", data)
# #             except Exception as e:
# #                 print("❌ Error handling WebSocket message:", e)

# #     except WebSocketDisconnect:
# #         manager.disconnect(ws)


# import asyncio
# import json
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.middleware.cors import CORSMiddleware
# from .websocket import manager
# from .tasks import start_simulator_task
# from .api import (
#     auth as auth_router,
#     drones as drones_router,
#     flightplans as fps_router,
#     users as users_router,
#     telemetry as telemetry_router,
#     geofences as geofences_router,
# )

# # new
# from .api import path as path_router

# app = FastAPI(title="UTM UAV Backend")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(auth_router.router)
# app.include_router(drones_router.router)
# app.include_router(fps_router.router)
# app.include_router(users_router.router)
# app.include_router(telemetry_router.router)
# app.include_router(geofences_router.router)
# # new
# app.include_router(path_router.router)


# @app.get("/")
# async def root():
#     return {"message": "UTM UAV Backend running"}


# @app.on_event("startup")
# async def startup():
#     # kick off simulator in background
#     app.state.sim_task = asyncio.create_task(start_simulator_task())


# # 🧠 DRONE FLIGHT SIMULATION FUNCTION
# # async def simulate_drone_flight(
# #     ws: WebSocket, drone_id: str, path: list, speed: float = 1.0
# # ):
# #     """
# #     Simulate drone movement along the given path and send telemetry updates over WebSocket.
# #     """
# #     print(f"🚀 Starting simulation for {drone_id} with {len(path)} waypoints...")

# #     for idx, point in enumerate(path):
# #         lat, lon = point.get("lat"), point.get("lon")
# #         telemetry_data = {
# #             "type": "telemetry",
# #             "drone_id": drone_id,
# #             "lat": lat,
# #             "lon": lon,
# #             "alt": 100 + idx,  # just a dummy altitude increasing slightly
# #             "heading": 90,
# #             "speed": 5,
# #         }
# #         await ws.send_text(json.dumps(telemetry_data))
# #         await asyncio.sleep(speed)

# #     # Send a completion message
# #     await ws.send_text(json.dumps({"type": "telemetry_done", "drone_id": drone_id}))
# #     print(f"✅ Simulation completed for {drone_id}")


# async def simulate_drone_flight(websocket, drone_id, path, speed):
#     import asyncio, json

#     print(
#         f"🚀 Starting simulation for {drone_id} with {len(path)} waypoints at {speed} m/s..."
#     )

#     for point in path:
#         # point should be a dict like {'lat': ..., 'lon': ...}
#         if isinstance(point, (list, tuple)):
#             lat, lon = point
#         else:
#             lat, lon = point.get("lat"), point.get("lon")

#         await websocket.send_json(
#             {"type": "drone_position", "drone_id": drone_id, "lat": lat, "lon": lon}
#         )

#         await asyncio.sleep(1 / speed)  # Slower = smaller speed value

#     await websocket.send_json({"type": "simulation_complete", "drone_id": drone_id})

#     print(f"✅ Simulation complete for {drone_id}")


# # 🛰️ WebSocket endpoint
# @app.websocket("/ws/telemetry")
# async def ws_endpoint(ws: WebSocket):
#     await manager.connect(ws)
#     try:
#         while True:
#             message = await ws.receive_text()
#             data = json.loads(message)

#             if data.get("type") == "start_simulation":
#                 path = data.get("path", [])
#                 drone_id = data.get("drone_id", "SimDrone-1")
#                 speed = data.get("speed", 1.0)
#                 asyncio.create_task(simulate_drone_flight(ws, drone_id, path, speed))
#     except WebSocketDisconnect:
#         manager.disconnect(ws)
#     except Exception as e:

#         print(f"❌ Error in WebSocket: {e}")


# with user registration and login routes

"""
import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .websocket import manager
from .tasks import start_simulator_task
from .api import (
    auth as auth_router,
    drones as drones_router,
    flightplans as fps_router,
    users as users_router,
    telemetry as telemetry_router,
    geofences as geofences_router,
    path as path_router,
)

app = FastAPI(title="UTM UAV Backend")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth_router.router)
app.include_router(drones_router.router)
app.include_router(fps_router.router)
app.include_router(users_router.router)
app.include_router(telemetry_router.router)
app.include_router(geofences_router.router)
app.include_router(path_router.router)


@app.get("/")
async def root():
    return {"message": "UTM UAV Backend running"}


@app.on_event("startup")
async def startup():
    app.state.sim_task = asyncio.create_task(start_simulator_task())


# ---------------------------
# 🧠 DRONE FLIGHT SIMULATION
# ---------------------------
async def simulate_drone_flight(
    websocket: WebSocket, drone_id: str, path: list, speed: float = 1.0
):
    print(
        f"🚀 Starting simulation for {drone_id} with {len(path)} waypoints at {speed} m/s..."
    )
    for point in path:
        if isinstance(point, (list, tuple)):
            lat, lon = point
        else:
            lat, lon = point.get("lat"), point.get("lon")

        await websocket.send_json(
            {"type": "drone_position", "drone_id": drone_id, "lat": lat, "lon": lon}
        )
        await asyncio.sleep(1 / speed)
    await websocket.send_json({"type": "simulation_complete", "drone_id": drone_id})
    print(f"✅ Simulation complete for {drone_id}")


@app.websocket("/ws/telemetry")
async def ws_endpoint(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            message = await ws.receive_text()
            data = json.loads(message)
            if data.get("type") == "start_simulation":
                path = data.get("path", [])
                drone_id = data.get("drone_id", "SimDrone-1")
                speed = float(data.get("speed", 1.0))
                asyncio.create_task(simulate_drone_flight(ws, drone_id, path, speed))
    except WebSocketDisconnect:
        manager.disconnect(ws)
    except Exception as e:
        print(f"❌ Error in WebSocket: {e}")
"""

import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware

from .websocket import manager
from .tasks import start_simulator_task
from .api import (
    auth as auth_router,
    drones as drones_router,
    flightplans as fps_router,
    users as users_router,
    telemetry as telemetry_router,
    geofences as geofences_router,
    path as path_router,
)

app = FastAPI(title="UTM UAV Backend")

# ---------------------------
# 🌐 CORS + WebSocket Friendly Setup
# ---------------------------
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "*",  # fallback for testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 🧩 Allow WebSocket CORS headers for upgrade requests
@app.middleware("http")
async def websocket_cors_middleware(request: Request, call_next):
    if request.url.path.startswith("/api/path/ws") or request.url.path.startswith(
        "/ws/telemetry"
    ):
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response
    return await call_next(request)


# ---------------------------
# 🚀 Register API Routers
# ---------------------------
app.include_router(auth_router.router)
app.include_router(drones_router.router)
app.include_router(fps_router.router)
app.include_router(users_router.router)
app.include_router(telemetry_router.router)
app.include_router(geofences_router.router)
app.include_router(path_router.router)


# ---------------------------
# 🏁 Root Endpoint
# ---------------------------
@app.get("/")
async def root():
    return {"message": "UTM UAV Backend running"}


# ---------------------------
# ⚙️ Startup Event
# ---------------------------
@app.on_event("startup")
async def startup():
    app.state.sim_task = asyncio.create_task(start_simulator_task())


# ---------------------------
# 🧠 Drone Flight Simulation
# ---------------------------
async def simulate_drone_flight(
    websocket: WebSocket, drone_id: str, path: list, speed: float = 1.0
):
    """
    Simulates drone movement along a given path and sends live position updates.
    """
    print(
        f"🚀 Starting simulation for {drone_id} with {len(path)} waypoints at {speed} m/s..."
    )

    for point in path:
        if isinstance(point, (list, tuple)):
            lat, lon = point
        else:
            lat, lon = point.get("lat"), point.get("lon")

        await websocket.send_json(
            {"type": "drone_position", "drone_id": drone_id, "lat": lat, "lon": lon}
        )
        await asyncio.sleep(1 / speed)

    await websocket.send_json({"type": "simulation_complete", "drone_id": drone_id})
    print(f"✅ Simulation complete for {drone_id}")


# ---------------------------
# 🛰️ WebSocket Telemetry Endpoint
# ---------------------------
@app.websocket("/ws/telemetry")
async def ws_endpoint(ws: WebSocket):
    await manager.connect(ws)
    print("📡 Telemetry WebSocket connected")

    try:
        while True:
            message = await ws.receive_text()
            data = json.loads(message)

            if data.get("type") == "start_simulation":
                path = data.get("path", [])
                drone_id = data.get("drone_id", "SimDrone-1")
                speed = float(data.get("speed", 1.0))
                print(f"🎮 Simulation request received for {drone_id}")
                asyncio.create_task(simulate_drone_flight(ws, drone_id, path, speed))

    except WebSocketDisconnect:
        manager.disconnect(ws)
        print("❌ Telemetry WebSocket disconnected")
    except Exception as e:
        print(f"❌ Error in WebSocket: {e}")
