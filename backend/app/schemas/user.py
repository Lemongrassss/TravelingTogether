from pydantic import EmailStr, Field

from app.schemas.common import ORM


class UserCreate(ORM):
    email: EmailStr
    name: str = Field(min_length=2, max_length=50)


class UserOut(ORM):
    id: int
    email: EmailStr
    name: str
