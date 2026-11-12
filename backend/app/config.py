from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    cors_origins: str = "http://localhost:5173"  
    auth_secret_key: str = "dev-only-change-this-secret-key-before-deployment"
    access_token_minutes: int = 15
    refresh_token_days: int = 7

    model_config = SettingsConfigDict(env_file=Path(__file__).resolve().parents[2] / ".env")


settings = Settings()
