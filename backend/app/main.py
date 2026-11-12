from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.config import settings
from app.database import Base, engine
from app.routers import auth, trip_details, trips, users
from app.models import Expense, Member, Message, PlanItem, RefreshToken, Trip, User

Base.metadata.create_all(engine)
if "hashed_password" not in {column["name"] for column in inspect(engine).get_columns("users")}:
    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE users ADD COLUMN hashed_password VARCHAR"))

app = FastAPI(title="Совместные путешествия")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(trips.router)
app.include_router(trip_details.router)
