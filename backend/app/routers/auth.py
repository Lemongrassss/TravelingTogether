import hashlib
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, Response
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app import schemas
from app.config import settings
from app.database import get_db
from app.deps import get_current_user
from app.models import RefreshToken, User

router = APIRouter(prefix="/auth", tags=["authentication"])
password_hash = PasswordHash.recommended()


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def issue_tokens(user: User, db: Session) -> schemas.TokenOut:
    now = datetime.now(timezone.utc)
    access = jwt.encode(
        {"sub": str(user.id), "exp": now + timedelta(minutes=settings.access_token_minutes)},
        settings.auth_secret_key,
        algorithm="HS256",
    )
    refresh = secrets.token_urlsafe(48)
    db.add(RefreshToken(
        user_id=user.id,
        token_hash=token_hash(refresh),
        expires_at=now + timedelta(days=settings.refresh_token_days),
    ))
    db.commit()
    return schemas.TokenOut(
        access_token=access,
        refresh_token=refresh,
        user=schemas.UserOut.model_validate(user),
    )


@router.post("/register", response_model=schemas.TokenOut, status_code=201)
def register(data: schemas.RegisterIn, db: Session = Depends(get_db)):
    email = str(data.email).lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(409, "Пользователь с таким email уже существует")
    user = User(email=email, name=data.name.strip(), hashed_password=password_hash.hash(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return issue_tokens(user, db)


@router.post("/login", response_model=schemas.TokenOut)
def login(data: schemas.LoginIn, db: Session = Depends(get_db)):
    email = str(data.email).lower()
    user = db.query(User).filter(User.email == email).first()
    if user is None or not user.hashed_password or not password_hash.verify(data.password, user.hashed_password):
        raise HTTPException(401, "Неверный email или пароль")
    return issue_tokens(user, db)


@router.post("/refresh", response_model=schemas.TokenOut)
def refresh(data: schemas.RefreshIn, db: Session = Depends(get_db)):
    stored = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash(data.refresh_token)).first()
    now = datetime.now(timezone.utc)
    if stored is None or stored.revoked or stored.expires_at <= now:
        raise HTTPException(401, "Refresh token недействителен или истёк")
    user = db.get(User, stored.user_id)
    if user is None:
        raise HTTPException(401, "Пользователь не найден")
    stored.revoked = True
    return issue_tokens(user, db)


@router.get("/me", response_model=schemas.UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.post("/logout", status_code=204)
def logout(data: schemas.RefreshIn, db: Session = Depends(get_db)):
    stored = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash(data.refresh_token)).first()
    if stored and not stored.revoked:
        stored.revoked = True
        db.commit()
    return Response(status_code=204)
