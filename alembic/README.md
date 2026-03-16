
Alembic migrations folder. To generate initial migration:
1. Install alembic in your venv
2. cd alembic
3. alembic revision --autogenerate -m "create initial tables"
4. alembic upgrade head
