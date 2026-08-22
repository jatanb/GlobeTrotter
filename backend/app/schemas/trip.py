from datetime import date, datetime, time

from pydantic import BaseModel, Field, model_validator


class ActivityCreate(BaseModel):
	name: str = Field(min_length=1, max_length=150)
	activity_type: str = Field(default="Sightseeing", max_length=50)
	description: str = ""
	start_time: time | None = None
	estimated_cost: float = Field(default=0, ge=0)


class ActivityResponse(ActivityCreate):
	id: int
	position: int

	model_config = {"from_attributes": True}


class StopCreate(BaseModel):
	city: str = Field(min_length=1, max_length=100)
	state: str = ""
	start_date: date
	end_date: date

	@model_validator(mode="after")
	def validate_dates(self):
		if self.end_date < self.start_date:
			raise ValueError("end_date must be on or after start_date")
		return self


class StopResponse(StopCreate):
	id: int
	position: int
	activities: list[ActivityResponse] = []

	model_config = {"from_attributes": True}


class TripCreate(BaseModel):
	name: str = Field(min_length=2, max_length=150)
	start_date: date
	end_date: date
	description: str = ""
	budget_limit: float = Field(default=0, ge=0)

	@model_validator(mode="after")
	def validate_dates(self):
		if self.end_date < self.start_date:
			raise ValueError("end_date must be on or after start_date")
		return self


class TripUpdate(BaseModel):
	name: str | None = Field(default=None, min_length=2, max_length=150)
	start_date: date | None = None
	end_date: date | None = None
	description: str | None = None
	budget_limit: float | None = Field(default=None, ge=0)


class TripResponse(TripCreate):
	id: int
	user_id: int
	created_at: datetime
	stops: list[StopResponse] = []

	model_config = {"from_attributes": True}
