from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import trip_details, trips, users
from app.models import Expense, Member, Message, PlanItem, Trip, User

Base.metadata.create_all(engine)

app = FastAPI(title="Совместные путешествия")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(trips.router)
app.include_router(trip_details.router)
