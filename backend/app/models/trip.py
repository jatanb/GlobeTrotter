from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Trip(Base):
	__tablename__ = "trips"

	id: Mapped[int] = mapped_column(primary_key=True, index=True)
	user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
	name: Mapped[str] = mapped_column(String(150), nullable=False)
	start_date: Mapped[date] = mapped_column(Date, nullable=False)
	end_date: Mapped[date] = mapped_column(Date, nullable=False)
	description: Mapped[str] = mapped_column(Text, default="", nullable=False)
	cover_path: Mapped[str | None] = mapped_column(String(255), nullable=True)
	budget_limit: Mapped[float] = mapped_column(Numeric(12, 2), default=0, nullable=False)
	created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
	updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

	stops: Mapped[list["TripStop"]] = relationship(back_populates="trip", cascade="all, delete-orphan", order_by="TripStop.position")
	expenses: Mapped[list["Expense"]] = relationship(back_populates="trip", cascade="all, delete-orphan")
