from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Share(Base):
	__tablename__ = "shares"

	id: Mapped[int] = mapped_column(primary_key=True, index=True)
	trip_id: Mapped[int] = mapped_column(ForeignKey("trips.id", ondelete="CASCADE"), unique=True, index=True)
	token: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
	created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
