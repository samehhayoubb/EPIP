from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    storage_dir: str = "storage"
    max_upload_mb: int = 100

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()