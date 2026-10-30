from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator


class ORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(min_length=2, max_length=50)


class UserOut(ORM):
    id: int
    email: EmailStr
    name: str


class TripIn(BaseModel):
    title: str = Field(min_length=3, max_length=100)
    destination: str = Field(min_length=2, max_length=100)
    description: str = Field("", max_length=1000)
    start_date: date
    end_date: date
    max_people: int = Field(ge=2, le=50)

    @model_validator(mode="after")
    def check_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("Дата окончания раньше даты начала")
        return self


class MemberOut(ORM):
    id: int
    user: UserOut


class TripOut(ORM):
    id: int
    title: str
    destination: str
    description: str
    start_date: date
    end_date: date
    max_people: int
    owner_id: int
    members: list[MemberOut]


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
