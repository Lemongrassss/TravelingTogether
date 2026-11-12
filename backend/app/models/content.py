from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.database import Base


class PlanItem(Base):
    __tablename__ = "plan_items"

    id = Column(Integer, primary_key=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    day = Column(Date, nullable=False)
    title = Column(String, nullable=False)
    note = Column(Text, default="")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    paid_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    payer = relationship("User")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User")
