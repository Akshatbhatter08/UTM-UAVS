
import asyncio, random, datetime
from .geo import haversine_distance
from ..websocket import manager

DRONE_COUNT = 8
STARTS = [
    (28.6139,77.2090),
    (19.07598,72.87766),
    (12.9716,77.5946),
    (13.0827,80.2707),
    (22.5726,88.3639),
    (23.2599,77.4126),
    (26.9124,75.7873),
    (21.1458,79.0882)
]

async def simulate(drones, interval=1):
    while True:
        for i in drones:
            d = drones[i]
            d['lat'] += (random.random()-0.5)/500
            d['lon'] += (random.random()-0.5)/500
            d['alt'] += (random.random()-0.5)*0.8
            d['ts'] = datetime.datetime.utcnow().isoformat()
            await manager.broadcast({'type':'telemetry', **d})

        # proximity checks
        ids = list(drones.keys())
        for a in range(len(ids)):
            for b in range(a+1, len(ids)):
                d1 = drones[ids[a]]; d2 = drones[ids[b]]
                dist = haversine_distance(d1['lat'], d1['lon'], d2['lat'], d2['lon'])
                if dist < 150:  # 150m demo proximity threshold
                    await manager.broadcast({'type':'alert','alert_type':'proximity','drones':[d1['drone_id'], d2['drone_id']],'distance_m': dist})
        await asyncio.sleep(interval)

async def start_default_simulator():
    drones = {}
    for i in range(1, DRONE_COUNT+1):
        lat, lon = STARTS[(i-1) % len(STARTS)]
        drones[i] = {'drone_id': i, 'lat': lat + random.random()/10000, 'lon': lon + random.random()/10000, 'alt': 60+random.random()*50}
    await simulate(drones, interval=1)
