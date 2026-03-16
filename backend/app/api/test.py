# backend/app/api/test.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..deps import get_db

router = APIRouter(prefix="/api/test", tags=["test"])


@router.get("/db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        # Simple query to test database connection
        result = db.execute("SELECT 1")
        return {"status": "success", "message": "Database connection is working"}
    except Exception as e:
        return {"status": "error", "message": f"Database connection failed: {str(e)}"}
