from beanie import Document, PydanticObjectId
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class Customer(Document):
    name: str
    email: EmailStr
    phone_number: Optional[str] = None
    position: Optional[str] = None
    company_id: PydanticObjectId  # Reference to Company

    class Settings:
        name = "customers"


# Pydantic schemas for request/response
class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone_number: Optional[str] = None
    position: Optional[str] = None
    company_id: str  # Company ID as string


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    position: Optional[str] = None
    company_id: Optional[str] = None


class CustomerResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone_number: Optional[str] = None
    position: Optional[str] = None
    company_id: str
    company_name: Optional[str] = None
    industry: Optional[str] = None

    class Config:
        from_attributes = True
