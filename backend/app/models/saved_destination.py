from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class SavedDestination(Base):
	__tablename__ = "saved_destinations"

	id: Mapped[int] = mapped_column(primary_key=True, index=True)
	user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
	city: Mapped[str] = mapped_column(String(100), nullable=False)
	state: Mapped[str] = mapped_column(String(100), default="", nullable=False)
	saved_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
