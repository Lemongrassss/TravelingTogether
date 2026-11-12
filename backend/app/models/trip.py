from sqlalchemy import Column, Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    description = Column(Text, default="")
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    max_people = Column(Integer, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    members = relationship("Member", cascade="all, delete-orphan")
    plan_items = relationship("PlanItem", cascade="all, delete-orphan")
    expenses = relationship("Expense", cascade="all, delete-orphan")
    messages = relationship("Message", cascade="all, delete-orphan")
