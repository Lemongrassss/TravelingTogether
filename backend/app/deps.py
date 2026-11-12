import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import Trip, User

bearer = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(401, "Требуется Bearer access token")
    try:
        payload = jwt.decode(credentials.credentials, settings.auth_secret_key, algorithms=["HS256"])
        user_id = int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        raise HTTPException(401, "Access token недействителен или истёк")
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(401, "Пользователь не найден")
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
