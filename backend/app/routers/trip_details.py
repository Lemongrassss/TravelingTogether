from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas
from ..database import get_db
from ..deps import get_current_user, get_my_trip
from ..models import Expense, Message, PlanItem, Trip, User

router = APIRouter(prefix="/trips/{trip_id}", tags=["plan, budget, chat"])


def find(db: Session, model, item_id: int, trip_id: int):
    item = db.get(model, item_id)
    if item is None or item.trip_id != trip_id:
        raise HTTPException(404, "Запись не найдена")
    return item


@router.get("/plan", response_model=list[schemas.PlanItemOut])
def get_plan(trip: Trip = Depends(get_my_trip)):
    return sorted(trip.plan_items, key=lambda p: (p.day, p.id))


@router.post("/plan", response_model=schemas.PlanItemOut, status_code=201)
def add_plan_item(data: schemas.PlanItemIn, trip: Trip = Depends(get_my_trip), db: Session = Depends(get_db)):
    item = PlanItem(**data.model_dump(), trip_id=trip.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/plan/{item_id}", response_model=schemas.PlanItemOut)
def update_plan_item(item_id: int, data: schemas.PlanItemIn, trip: Trip = Depends(get_my_trip), db: Session = Depends(get_db)):
    item = find(db, PlanItem, item_id, trip.id)
    for key, value in data.model_dump().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/plan/{item_id}", status_code=204)
def delete_plan_item(item_id: int, trip: Trip = Depends(get_my_trip), db: Session = Depends(get_db)):
    db.delete(find(db, PlanItem, item_id, trip.id))
    db.commit()


def find_my_expense(db: Session, item_id: int, trip: Trip, user: User) -> Expense:
    expense = find(db, Expense, item_id, trip.id)
    if expense.paid_by != user.id:
        raise HTTPException(403, "Можно менять только свои траты")
    return expense


@router.get("/expenses", response_model=list[schemas.ExpenseOut])
def get_expenses(trip: Trip = Depends(get_my_trip)):
    return sorted(trip.expenses, key=lambda e: e.id)


@router.post("/expenses", response_model=schemas.ExpenseOut, status_code=201)
def add_expense(data: schemas.ExpenseIn, trip: Trip = Depends(get_my_trip),
                user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    expense = Expense(**data.model_dump(), trip_id=trip.id, paid_by=user.id)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.put("/expenses/{item_id}", response_model=schemas.ExpenseOut)
def update_expense(item_id: int, data: schemas.ExpenseIn, trip: Trip = Depends(get_my_trip),
                   user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    expense = find_my_expense(db, item_id, trip, user)
    expense.title = data.title
    expense.amount = data.amount
    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/expenses/{item_id}", status_code=204)
def delete_expense(item_id: int, trip: Trip = Depends(get_my_trip),
                   user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.delete(find_my_expense(db, item_id, trip, user))
    db.commit()


@router.get("/messages", response_model=list[schemas.MessageOut])
def get_messages(trip: Trip = Depends(get_my_trip)):
    return sorted(trip.messages, key=lambda m: m.id)[-100:]  


@router.post("/messages", response_model=schemas.MessageOut, status_code=201)
def send_message(data: schemas.MessageIn, trip: Trip = Depends(get_my_trip),
                 user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    message = Message(text=data.text, trip_id=trip.id, user_id=user.id)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message
