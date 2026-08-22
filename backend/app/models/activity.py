from datetime import time

from sqlalchemy import ForeignKey, Integer, Numeric, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Activity(Base):
	__tablename__ = "activities"

	id: Mapped[int] = mapped_column(primary_key=True, index=True)
	stop_id: Mapped[int] = mapped_column(ForeignKey("trip_stops.id", ondelete="CASCADE"), index=True)
	name: Mapped[str] = mapped_column(String(150), nullable=False)
	activity_type: Mapped[str] = mapped_column(String(50), default="Sightseeing", nullable=False)
	description: Mapped[str] = mapped_column(Text, default="", nullable=False)
	start_time: Mapped[time | None] = mapped_column(Time, nullable=True)
	estimated_cost: Mapped[float] = mapped_column(Numeric(12, 2), default=0, nullable=False)
	position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

	stop: Mapped["TripStop"] = relationship(back_populates="activities")
