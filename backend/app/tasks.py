
import asyncio
from .utils.simulator import start_default_simulator

async def start_simulator_task():
    await start_default_simulator()
