from datetime import date

from pydantic import BaseModel, Field, model_validator

from app.schemas.common import ORM
from app.schemas.user import UserOut


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
