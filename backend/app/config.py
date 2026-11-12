from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    cors_origins: str = "http://localhost:5173"  

    model_config = SettingsConfigDict(env_file=Path(__file__).resolve().parents[2] / ".env")


settings = Settings()
