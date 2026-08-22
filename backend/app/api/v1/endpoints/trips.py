from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.activity import Activity
from app.models.trip import Trip
from app.models.trip_stop import TripStop
from app.models.user import User
from app.schemas.trip import (
	ActivityCreate,
	ActivityResponse,
	StopCreate,
	StopResponse,
	TripCreate,
	TripResponse,
	TripUpdate,
)


router = APIRouter()


def load_trip(db: Session, trip_id: int, user_id: int) -> Trip:
	trip = db.scalar(
		select(Trip)
		.options(selectinload(Trip.stops).selectinload(TripStop.activities))
		.where(Trip.id == trip_id, Trip.user_id == user_id)
	)
	if not trip:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
	return trip


@router.get("", response_model=list[TripResponse])
def list_trips(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	return db.scalars(
		select(Trip)
		.options(selectinload(Trip.stops).selectinload(TripStop.activities))
		.where(Trip.user_id == current_user.id)
		.order_by(Trip.created_at.desc())
	).all()


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(data: TripCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	trip = Trip(user_id=current_user.id, **data.model_dump())
	db.add(trip)
	db.commit()
	return load_trip(db, trip.id, current_user.id)


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	return load_trip(db, trip_id, current_user.id)


@router.patch("/{trip_id}", response_model=TripResponse)
def update_trip(trip_id: int, data: TripUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	trip = load_trip(db, trip_id, current_user.id)
	changes = data.model_dump(exclude_unset=True)
	start_date = changes.get("start_date", trip.start_date)
	end_date = changes.get("end_date", trip.end_date)
	if end_date < start_date:
		raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="end_date must be on or after start_date")
	for key, value in changes.items():
		setattr(trip, key, value)
	db.commit()
	return load_trip(db, trip.id, current_user.id)


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(trip_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	trip = load_trip(db, trip_id, current_user.id)
	db.delete(trip)
	db.commit()


@router.post("/{trip_id}/stops", response_model=StopResponse, status_code=status.HTTP_201_CREATED)
def create_stop(trip_id: int, data: StopCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	trip = load_trip(db, trip_id, current_user.id)
	position = db.scalar(select(TripStop.position).where(TripStop.trip_id == trip.id).order_by(TripStop.position.desc()))
	stop = TripStop(trip_id=trip.id, position=(position + 1 if position is not None else 0), **data.model_dump())
	db.add(stop)
	db.commit()
	db.refresh(stop)
	return stop


@router.post("/stops/{stop_id}/activities", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def create_activity(stop_id: int, data: ActivityCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	stop = db.scalar(select(TripStop).join(Trip).where(TripStop.id == stop_id, Trip.user_id == current_user.id))
	if not stop:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")
	position = db.scalar(select(Activity.position).where(Activity.stop_id == stop.id).order_by(Activity.position.desc()))
	activity = Activity(stop_id=stop.id, position=(position + 1 if position is not None else 0), **data.model_dump())
	db.add(activity)
	db.commit()
	db.refresh(activity)
	return activity


@router.delete("/activities/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(activity_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
	activity = db.scalar(select(Activity).join(TripStop).join(Trip).where(Activity.id == activity_id, Trip.user_id == current_user.id))
	if not activity:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
	db.delete(activity)
	db.commit()
