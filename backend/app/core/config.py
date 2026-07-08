from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Controls SQLAlchemy query logging. Set to "production" to silence echo.
    ENVIRONMENT: str = "development"

    # Comma-separated list of allowed CORS origins.
    # Example in .env:  CORS_ORIGINS=http://localhost:3000,http://localhost:5173
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    # Maximum size (in MB) for driver-monitor frame uploads.
    MAX_UPLOAD_SIZE_MB: int = 5

    # Comma-separated list of accepted MIME types for frame uploads.
    # Example in .env:  ALLOWED_UPLOAD_MIME_TYPES=image/jpeg,image/png,image/webp
    ALLOWED_UPLOAD_MIME_TYPES: str = "image/jpeg,image/png,image/webp"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | list) -> str:
        # Accept both a pre-split list (from test overrides) or a raw string.
        if isinstance(v, list):
            return ",".join(v)
        return v

    @field_validator("ALLOWED_UPLOAD_MIME_TYPES", mode="before")
    @classmethod
    def parse_mime_types(cls, v: str | list) -> str:
        if isinstance(v, list):
            return ",".join(v)
        return v

    @property
    def cors_origins_list(self) -> list[str]:
        """Parsed list of CORS origins for use with CORSMiddleware."""
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def allowed_mime_types_list(self) -> list[str]:
        """Parsed list of allowed MIME types for upload validation."""
        return [m.strip() for m in self.ALLOWED_UPLOAD_MIME_TYPES.split(",") if m.strip()]


settings = Settings()