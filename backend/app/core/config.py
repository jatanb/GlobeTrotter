from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "GlobeTrotter API"
    app_version: str = "1.0.0"
    debug: bool = True

    database_url: str = "sqlite:///./globetrotter.db"

    frontend_url: str = "http://localhost:5173"

    jwt_secret_key: str = "CHANGE_THIS_IN_PRODUCTION"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()