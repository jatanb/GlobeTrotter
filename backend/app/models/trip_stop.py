from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class TripStop(Base):
	__tablename__ = "trip_stops"

	id: Mapped[int] = mapped_column(primary_key=True, index=True)
	trip_id: Mapped[int] = mapped_column(ForeignKey("trips.id", ondelete="CASCADE"), index=True)
	city: Mapped[str] = mapped_column(String(100), nullable=False)
	state: Mapped[str] = mapped_column(String(100), default="", nullable=False)
	start_date: Mapped[date] = mapped_column(Date, nullable=False)
	end_date: Mapped[date] = mapped_column(Date, nullable=False)
	position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

	trip: Mapped["Trip"] = relationship(back_populates="stops")
	activities: Mapped[list["Activity"]] = relationship(back_populates="stop", cascade="all, delete-orphan", order_by="Activity.position")
