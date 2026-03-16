# from fastapi import WebSocket, WebSocketDisconnect
# import json
# from typing import List, Dict, Any


# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: List[WebSocket] = []

#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections.append(websocket)

#     def disconnect(self, websocket: WebSocket):
#         if websocket in self.active_connections:
#             self.active_connections.remove(websocket)

#     async def send_personal(self, websocket: WebSocket, message: Dict[str, Any]):
#         await websocket.send_text(json.dumps(message, default=str))

#     async def broadcast(self, message: Dict[str, Any]):
#         data = json.dumps(message, default=str)
#         to_remove = []
#         for conn in list(self.active_connections):
#             try:
#                 await conn.send_text(data)
#             except Exception:
#                 to_remove.append(conn)
#         for r in to_remove:
#             self.disconnect(r)


# manager = ConnectionManager()

# 2
# from fastapi import WebSocket, WebSocketDisconnect, APIRouter
# import asyncio
# import json
# from typing import List, Dict, Any

# router = APIRouter()


# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: List[WebSocket] = []

#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections.append(websocket)

#     def disconnect(self, websocket: WebSocket):
#         if websocket in self.active_connections:
#             self.active_connections.remove(websocket)

#     async def send_personal(self, websocket: WebSocket, message: Dict[str, Any]):
#         await websocket.send_text(json.dumps(message, default=str))

#     async def broadcast(self, message: Dict[str, Any]):
#         data = json.dumps(message, default=str)
#         to_remove = []
#         for conn in list(self.active_connections):
#             try:
#                 await conn.send_text(data)
#             except Exception:
#                 to_remove.append(conn)
#         for r in to_remove:
#             self.disconnect(r)


# manager = ConnectionManager()


# @router.websocket("/ws/telemetry")
# async def websocket_endpoint(websocket: WebSocket):
#     """Main telemetry WebSocket endpoint."""
#     await manager.connect(websocket)
#     try:
#         while True:
#             data = await websocket.receive_text()
#             message = json.loads(data)

#             # Handle simulation command
#             if message.get("type") == "start_simulation":
#                 path = message.get("path", [])
#                 drone_id = message.get("drone_id", "SimDrone-1")
#                 speed = float(message.get("speed", 1.0))  # seconds between updates
#                 await simulate_drone_path(drone_id, path, speed)
#             else:
#                 # Any other messages (e.g., telemetry broadcasts)
#                 await manager.broadcast(message)

#     except WebSocketDisconnect:
#         manager.disconnect(websocket)
#     except Exception as e:
#         print(f"WebSocket error: {e}")
#         manager.disconnect(websocket)


# async def simulate_drone_path(
#     drone_id: str, path: List[Dict[str, float]], speed: float = 1.0
# ):
#     """Simulate drone moving along given path and broadcast position updates."""
#     if not path:
#         return

#     for i, point in enumerate(path):
#         telemetry = {
#             "type": "telemetry",
#             "drone_id": drone_id,
#             "lat": point["lat"],
#             "lon": point["lon"],
#             "alt": 100 + i * 0.5,  # fake altitude
#             "heading": 90,
#             "speed": 10,
#         }
#         await manager.broadcast(telemetry)
#         await asyncio.sleep(speed)

#     await manager.broadcast(
#         {
#             "type": "telemetry_done",
#             "drone_id": drone_id,
#             "message": "Simulation complete",
#         }
#     )

# 3
import json
import asyncio
from typing import List, Dict, Any
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print("✅ Client connected")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print("⚠️ Client disconnected")

    async def send_personal(self, websocket: WebSocket, message: Dict[str, Any]):
        await websocket.send_text(json.dumps(message, default=str))

    async def broadcast(self, message: Dict[str, Any]):
        data = json.dumps(message, default=str)
        to_remove = []
        for conn in list(self.active_connections):
            try:
                await conn.send_text(data)
            except Exception:
                to_remove.append(conn)
        for r in to_remove:
            self.disconnect(r)


manager = ConnectionManager()


async def simulate_drone_flight(
    websocket: WebSocket, path: list, drone_id: str = "SimDrone-1", delay: float = 1.0
):
    """Simulate a drone flying through the provided path, sending telemetry updates."""
    for idx, point in enumerate(path):
        lat = point.get("lat") if isinstance(point, dict) else point[0]
        lon = point.get("lon") if isinstance(point, dict) else point[1]
        telemetry = {
            "type": "telemetry",
            "drone_id": drone_id,
            "lat": lat,
            "lon": lon,
            "alt": 100 + idx * 2,  # altitude increases slightly
            "heading": 90,
            "speed": 15,
        }
        await manager.broadcast(telemetry)
        await asyncio.sleep(delay)

    # send final message
    await manager.broadcast({"type": "telemetry_done", "drone_id": drone_id})
