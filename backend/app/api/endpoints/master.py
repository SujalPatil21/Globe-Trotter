from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.master import City, Activity
from app.schemas.master import CityResponse, ActivityResponse

router = APIRouter(tags=["Master Data"])

@router.get("/cities", response_model=List[CityResponse])
def get_cities(
    q: Optional[str] = None,
    country: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(City)
    if q:
        query = query.filter(City.name.ilike(f"%{q}%"))
    if country:
        query = query.filter(City.country.ilike(f"%{country}%"))
    return query.all()

@router.get("/cities/{city_id}", response_model=CityResponse)
def get_city(city_id: int, db: Session = Depends(get_db)):
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    return city

@router.get("/activities", response_model=List[ActivityResponse])
def get_activities(
    city_id: Optional[int] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Activity)
    if city_id:
        query = query.filter(Activity.city_id == city_id)
    if type:
        query = query.filter(Activity.type == type)
    return query.all()
