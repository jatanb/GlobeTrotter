from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Expense(Base):
	__tablename__ = "expenses"

	id: Mapped[int] = mapped_column(primary_key=True, index=True)
	trip_id: Mapped[int] = mapped_column(ForeignKey("trips.id", ondelete="CASCADE"), index=True)
	category: Mapped[str] = mapped_column(String(50), nullable=False)
	amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
	note: Mapped[str] = mapped_column(String(255), default="", nullable=False)
	spent_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

	trip: Mapped["Trip"] = relationship(back_populates="expenses")
