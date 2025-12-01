from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from enum import Enum


class StageEnum(str, Enum):
    proposal = "proposal"
    qualified = "qualified"
    negotiation = "negotiation"


class Deal(Document):
    title: str
    amount: float = 0.0
    company_id: PydanticObjectId  # Reference to Company
    stage: str = "proposal"
    close_date: Optional[date] = None
    contact_ids: List[PydanticObjectId] = []  # References to Customers

    class Settings:
        name = "deals"


# Pydantic schemas for request/response
class DealCreate(BaseModel):
    title: str
    amount: float = 0.0
    company_id: str
    stage: str = "proposal"
    close_date: Optional[date] = None
    contact_ids: List[str] = []


class DealUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    company_id: Optional[str] = None
    stage: Optional[str] = None
    close_date: Optional[date] = None
    contact_ids: Optional[List[str]] = None


class ContactInfo(BaseModel):
    id: str
    name: str
    email: str
    phone_number: Optional[str] = None
    avatar_url: str
    position: Optional[str] = None


class DealResponse(BaseModel):
    id: str
    title: str
    amount: float
    company_id: str
    company_name: Optional[str] = None
    stage: str
    close_date: Optional[date] = None
    contacts: List[ContactInfo] = []

    class Config:
        from_attributes = True
