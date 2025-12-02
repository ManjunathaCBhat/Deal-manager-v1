from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path


# Find .env file - check current dir, then parent (root)
def find_env_file():
    current = Path(__file__).parent.parent / ".env"
    root = Path(__file__).parent.parent.parent / ".env"
    if current.exists():
        return str(current)
    elif root.exists():
        return str(root)
    return ".env"


class Settings(BaseSettings):
    # MongoDB
    mongo_uri: str = "mongodb://localhost:27017"
    database_name: str = "crm"

    # JWT
    secret_key: str = "your-secret-key-here-change-in-production"
    jwt_secret: str = ""
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # Azure AD SSO
    azure_tenant_id: str = ""
    azure_client_id: str = ""
    azure_client_secret: str = ""  # Optional, for confidential client flows

    # OpenRouter
    openrouter_api_key: str = ""
    openrouter_site_url: str = "http://localhost:3000"
    openrouter_site_name: str = "CRM Deal Assistant"

    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    frontend_url: str = "http://localhost:3000"

    class Config:
        env_file = find_env_file()
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
