from datetime import date, datetime

from pydantic import BaseModel, Field

from app.schemas.common import ORM
from app.schemas.user import UserOut


class PlanItemIn(BaseModel):
    day: date
    title: str = Field(min_length=2, max_length=100)
    note: str = Field("", max_length=500)


class PlanItemOut(ORM):
    id: int
    day: date
    title: str
    note: str


class ExpenseIn(BaseModel):
    title: str = Field(min_length=2, max_length=100)
    amount: float = Field(gt=0)


class ExpenseOut(ORM):
    id: int
    title: str
    amount: float
    paid_by: int
    payer: UserOut


class MessageIn(BaseModel):
    text: str = Field(min_length=1, max_length=500)


class MessageOut(ORM):
    id: int
    text: str
    created_at: datetime
    user: UserOut
