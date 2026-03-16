
# UTM UAV - Complete Implementation

This repository contains a complete advanced UTM UAV stack:
- FastAPI backend with JWT auth, Postgres (SQLAlchemy), Alembic placeholders, WebSocket telemetry broadcasting, telemetry ingestion, proximity detection (Shapely), and background simulator.
- Frontend (Vite + React) with authentication UI, flight plan submission, geofence editor scaffold, and real-time map with toasts.

Download, configure `.env` and run the backend + frontend locally.


## Database initialization & migrations

- You can apply the SQL migration template in `alembic/versions/0001_initial.sql` directly to your Postgres DB.
- Or use SQLAlchemy + Alembic locally:
  1. Configure `.env` with DB_URL.
  2. Run `python scripts/init_db.py` to create tables and seed sample data.
  3. To use Alembic autogenerate: install alembic, then run `alembic revision --autogenerate -m "init"` and `alembic upgrade head`.

