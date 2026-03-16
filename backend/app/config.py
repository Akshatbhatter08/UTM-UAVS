from dotenv import load_dotenv

load_dotenv()

from pydantic import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "1234"
    SMTP_EMAIL: str = "bhatterakshat4@gmail.com"
    SMTP_PASSWORD: str = "lkkx tcrt tpoi fwwk"
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    DB_URL: str = "postgresql+psycopg2://postgres:%40Maababaji1@localhost:5432/utm"
    SECRET_KEY: str = "@Maababaji1"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    REDIS_URL: str = "redis://localhost:6379/0"
    WEBSOCKET_ALLOWED_ORIGINS: list = ["*"]

    class Config:
        env_file = ".env"


settings = Settings()
