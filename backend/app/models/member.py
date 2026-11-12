from sqlalchemy import Column, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class Member(Base):
    __tablename__ = "members"
    __table_args__ = (UniqueConstraint("trip_id", "user_id"),)

    id = Column(Integer, primary_key=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User")
