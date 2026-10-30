from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas
from ..database import get_db
from ..deps import get_current_user, get_own_trip, get_trip
from ..models import Member, Trip, User

router = APIRouter(prefix="/trips", tags=["trips"])


@router.get("", response_model=list[schemas.TripOut])
def list_trips(db: Session = Depends(get_db)):
    return db.query(Trip).order_by(Trip.start_date).all()


@router.get("/{trip_id}", response_model=schemas.TripOut)
def read_trip(trip: Trip = Depends(get_trip)):
    return trip


@router.post("", response_model=schemas.TripOut, status_code=201)
def create_trip(data: schemas.TripIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    trip = Trip(**data.model_dump(), owner_id=user.id)
    trip.members.append(Member(user_id=user.id))  
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@router.put("/{trip_id}", response_model=schemas.TripOut)
def update_trip(data: schemas.TripIn, trip: Trip = Depends(get_own_trip), db: Session = Depends(get_db)):
    if data.max_people < len(trip.members):
        raise HTTPException(400, "Участников уже больше, чем мест")
    for key, value in data.model_dump().items():
        setattr(trip, key, value)
    db.commit()
    db.refresh(trip)
    return trip


@router.delete("/{trip_id}", status_code=204)
def delete_trip(trip: Trip = Depends(get_own_trip), db: Session = Depends(get_db)):
    db.delete(trip)
    db.commit()


@router.post("/{trip_id}/join", response_model=schemas.TripOut)
def join_trip(trip: Trip = Depends(get_trip), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.id in [m.user_id for m in trip.members]:
        raise HTTPException(409, "Вы уже участник этой поездки")
    if len(trip.members) >= trip.max_people:
        raise HTTPException(400, "В поездке нет свободных мест")
    trip.members.append(Member(user_id=user.id))
    db.commit()
    db.refresh(trip)
    return trip


@router.delete("/{trip_id}/leave", status_code=204)
def leave_trip(trip: Trip = Depends(get_trip), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    member = next((m for m in trip.members if m.user_id == user.id), None)
    if member is None:
        raise HTTPException(400, "Вы не участник этой поездки")
    if trip.owner_id == user.id:
        raise HTTPException(400, "Организатор не может выйти, можно только удалить поездку")
    db.delete(member)
    db.commit()
