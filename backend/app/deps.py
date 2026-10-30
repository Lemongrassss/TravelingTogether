from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from .database import get_db
from .models import Trip, User


def get_current_user(x_user_id: int | None = Header(None), db: Session = Depends(get_db)) -> User:
    user = db.get(User, x_user_id) if x_user_id else None
    if user is None:
        raise HTTPException(401, "Укажите заголовок X-User-Id существующего пользователя")
    return user


def get_trip(trip_id: int, db: Session = Depends(get_db)) -> Trip:
    trip = db.get(Trip, trip_id)
    if trip is None:
        raise HTTPException(404, "Поездка не найдена")
    return trip


def get_my_trip(trip: Trip = Depends(get_trip), user: User = Depends(get_current_user)) -> Trip:
    if user.id not in [m.user_id for m in trip.members]:
        raise HTTPException(403, "Вы не участник этой поездки")
    return trip


def get_own_trip(trip: Trip = Depends(get_trip), user: User = Depends(get_current_user)) -> Trip:
    if trip.owner_id != user.id:
        raise HTTPException(403, "Это может сделать только организатор")
    return trip
