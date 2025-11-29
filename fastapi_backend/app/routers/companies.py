from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_db

router = APIRouter(prefix="/companies", tags=["companies"])

INDUSTRY_COLORS = {
    "TECHNOLOGY": "#3B82F6",
    "HEALTHCARE": "#10B981",
    "FINANCE": "#F59E0B",
    "RETAIL": "#EF4444",
    "MANUFACTURING": "#8B5CF6",
    "EDUCATION": "#EC4899",
    "ENERGY": "#14B8A6",
    "REAL_ESTATE": "#F97316",
    "OTHER": "#6B7280",
}


class CustomerInfo(BaseModel):
    id: str
    name: str
    email: str
    phone_number: Optional[str] = None
    position: Optional[str] = None


class CompanyResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    industry_color: str = "#6B7280"
    location: Optional[str] = None
    customers: List[CustomerInfo] = []


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


async def get_company_response(company: dict, db) -> CompanyResponse:
    """Convert company dict to response with customers."""
    customers = await db.customers.find({"company_id": company["_id"]}).to_list(length=100)
    customer_list = [
        CustomerInfo(
            id=str(c["_id"]),
            name=c["name"],
            email=c["email"],
            phone_number=c.get("phone_number"),
            position=c.get("position"),
        )
        for c in customers
    ]
    
    industry = company.get("industry", "OTHER")
    
    return CompanyResponse(
        id=str(company["_id"]),
        name=company["name"],
        description=company.get("description"),
        website=company.get("website"),
        industry=industry,
        industry_color=INDUSTRY_COLORS.get(industry, "#6B7280"),
        location=company.get("location"),
        customers=customer_list,
    )


@router.get("/", response_model=List[CompanyResponse])
async def list_companies():
    """Get all companies."""
    db = await get_db()
    companies = await db.companies.find().to_list(length=1000)
    return [await get_company_response(c, db) for c in companies]


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(company_id: str):
    """Get a specific company by ID."""
    db = await get_db()
    try:
        company = await db.companies.find_one({"_id": ObjectId(company_id)})
    except:
        raise HTTPException(status_code=404, detail="Company not found")
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    return await get_company_response(company, db)


@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(company_data: CompanyCreate):
    """Create a new company."""
    db = await get_db()
    
    company = company_data.model_dump()
    result = await db.companies.insert_one(company)
    company["_id"] = result.inserted_id
    
    return await get_company_response(company, db)


@router.put("/{company_id}", response_model=CompanyResponse)
async def update_company(company_id: str, company_data: CompanyUpdate):
    """Update an existing company."""
    db = await get_db()
    
    try:
        company = await db.companies.find_one({"_id": ObjectId(company_id)})
    except:
        raise HTTPException(status_code=404, detail="Company not found")
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    update_data = company_data.model_dump(exclude_unset=True)
    
    if update_data:
        await db.companies.update_one({"_id": ObjectId(company_id)}, {"$set": update_data})
        company = await db.companies.find_one({"_id": ObjectId(company_id)})
    
    return await get_company_response(company, db)


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id: str):
    """Delete a company."""
    db = await get_db()
    
    try:
        result = await db.companies.delete_one({"_id": ObjectId(company_id)})
    except:
        raise HTTPException(status_code=404, detail="Company not found")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Company not found")
    
    return None
