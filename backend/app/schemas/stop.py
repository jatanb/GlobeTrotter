from pydantic import BaseModel, Field


class StopUpdate(BaseModel):
	city: str | None = Field(default=None, min_length=1, max_length=100)
	state: str | None = None
	start_date: str | None = None
	end_date: str | None = None
	position: int | None = Field(default=None, ge=0)
