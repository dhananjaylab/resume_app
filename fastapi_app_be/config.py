"""
Configuration management for the FastAPI Resume Standardizer application.
Loads environment variables from .env file.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    gemini_api_key: str
    gemini_model: str = "gemini-2.0-flash"
    gemini_api_url: str = "https://generativelanguage.googleapis.com/v1/models"
    
    # Server Configuration
    server_port: int = 8000
    server_host: str = "127.0.0.1"
    debug: bool = False
    
    # File Upload Configuration
    max_file_size: int = 10 * 1024 * 1024  # 10MB in bytes
    max_request_size: int = 15 * 1024 * 1024  # 15MB in bytes
    
    # Processing Configuration
    gemini_temperature: float = 0.3
    
    class Config:
        """Pydantic config."""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
