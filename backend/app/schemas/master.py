from pydantic import BaseModel
from typing import Optional

class CityBase(BaseModel):
    name: str
    country: str
    region: Optional[str] = None
    cost_index: int
    popularity: int
    image_url: Optional[str] = None
    description: Optional[str] = None

class CityResponse(CityBase):
    id: int
    
    class Config:
        from_attributes = True

class ActivityBase(BaseModel):
    name: str
    type: str
    description: Optional[str] = None
    cost: float
    duration_minutes: int
    image_url: Optional[str] = None

class ActivityResponse(ActivityBase):
    id: int
    city_id: int
    
    class Config:
        from_attributes = True
