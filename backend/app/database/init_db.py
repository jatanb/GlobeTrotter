from app.database.base import Base
from app.database.session import engine
from sqlalchemy import inspect, text

from app.models.user import User
from app.models import Activity, Expense, SavedDestination, Share, Trip, TripStop


def init_db():
    Base.metadata.create_all(bind=engine)

    # create_all does not alter tables that already exist.
    if engine.dialect.name == "sqlite":
        existing_columns = {
            column["name"] for column in inspect(engine).get_columns("users")
        }
        with engine.begin() as connection:
            if "password_reset_token" not in existing_columns:
                connection.execute(text("ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(128)"))
            if "password_reset_expires_at" not in existing_columns:
                connection.execute(text("ALTER TABLE users ADD COLUMN password_reset_expires_at DATETIME"))