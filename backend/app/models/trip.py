import datetime
import uuid
from sqlalchemy import String, Integer, Float, Text, Boolean, DateTime, ForeignKey, Date, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base

def get_utc_now() -> datetime.datetime:
    return datetime.datetime.now(datetime.timezone.utc)

def generate_share_id() -> str:
    return str(uuid.uuid4())

class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    start_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    end_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    budget_limit: Mapped[float | None] = mapped_column(Float, nullable=True)
    cover_image: Mapped[str | None] = mapped_column(String(255), nullable=True)
    share_id: Mapped[str] = mapped_column(String(100), unique=True, default=generate_share_id, nullable=False)
    
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now, nullable=False)

    stops: Mapped[list["TripStop"]] = relationship(back_populates="trip", cascade="all, delete-orphan", order_by="TripStop.display_order")
    expenses: Mapped[list["Expense"]] = relationship(back_populates="trip", cascade="all, delete-orphan")

class TripStop(Base):
    __tablename__ = "trip_stops"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    trip_id: Mapped[int] = mapped_column(ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    city_id: Mapped[int] = mapped_column(ForeignKey("cities.id"), nullable=False)
    start_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    end_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    trip: Mapped["Trip"] = relationship(back_populates="stops")
    city = relationship("City")
    activities: Mapped[list["TripActivity"]] = relationship(back_populates="trip_stop", cascade="all, delete-orphan", order_by="TripActivity.display_order")

class TripActivity(Base):
    __tablename__ = "trip_activities"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    trip_stop_id: Mapped[int] = mapped_column(ForeignKey("trip_stops.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_id: Mapped[int | None] = mapped_column(ForeignKey("activities.id"), nullable=True)
    custom_place_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    
    activity_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    start_time: Mapped[datetime.time | None] = mapped_column(Time, nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    custom_cost: Mapped[float | None] = mapped_column(Float, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    trip_stop: Mapped["TripStop"] = relationship(back_populates="activities")
    activity = relationship("Activity")

class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    trip_id: Mapped[int] = mapped_column(ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False) # TRANSPORT, ACCOMMODATION, MEAL, OTHER
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[str | None] = mapped_column(String(200), nullable=True)
    expense_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)

    trip: Mapped["Trip"] = relationship(back_populates="expenses")

class SavedDestination(Base):
    __tablename__ = "saved_destinations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    city_id: Mapped[int] = mapped_column(ForeignKey("cities.id", ondelete="CASCADE"), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    
    city = relationship("City")
