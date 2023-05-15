import pathlib
from typing import Optional
from pydantic import BaseSettings



class Settings(BaseSettings):
    HOST: str
    PORT: int
    WORKERS_PER_CORE: int = 1
    WEB_CONCURRENCY: Optional[str] = None
    LOG_LEVEL: str = "error"

    # url naming: https://docs.sqlalchemy.org/en/20/core/engines.html#sqlite
    SQLALCHEMY_DATABASE_URI: str

    BEARER_TOKEN: str
    TOKEN_SERVICE_HOST: str
    TOKEN_SERVICE_PORT: str

    class Config:
        # case_sensitive: https://docs.pydantic.dev/usage/settings/#environment-variable-names
        case_sensitive = True

        # read settings from .env file
        env_file = ".env"
        env_file_encoding = 'utf-8'


settings = Settings(_env_file=f'{pathlib.Path(__file__).parents[3].resolve()}/.env')
