from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class IndustryEnum(str, Enum):
    technology = "technology"
    healthcare = "healthcare"
    finance = "finance"
    sports = "sports"
    manufacturing = "manufacturing"
    retail = "retail"
    energy = "energy"
    aviation = "aviation"
    other = "other"
    real_estate = "real estate"
    food_beverage = "food & beverage"


INDUSTRY_COLORS = {
    "technology": "blue",
    "healthcare": "green",
    "finance": "orange",
    "sports": "purple",
    "manufacturing": "gray",
    "retail": "pink",
    "energy": "yellow",
    "aviation": "teal",
    "real estate": "magenta",
    "food & beverage": "gold",
}


class Company(Document):
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None

    def industry_color(self) -> str:
        return INDUSTRY_COLORS.get(self.industry, "default")

    class Settings:
        name = "companies"


# Pydantic schemas for request/response
class CompanyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None


class CompanyResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    industry_color: str
    location: Optional[str] = None
    customers: List[dict] = []

    class Config:
        from_attributes = True
