from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from typing import List
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.database import get_db

router = APIRouter(prefix="/customers", tags=["customers"])


class CustomerResponse(BaseModel):
    id: str
    name: str
    email: str
    phone_number: Optional[str] = None
    position: Optional[str] = None
    company_id: str
    company_name: Optional[str] = None
    industry: Optional[str] = None


class CustomerCreate(BaseModel):
    name: str
    email: str
    phone_number: Optional[str] = None
    position: Optional[str] = None
    company_id: str


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    position: Optional[str] = None
    company_id: Optional[str] = None


async def get_customer_response(customer: dict, db) -> CustomerResponse:
    """Convert customer dict to response with company info."""
    company = None
    if customer.get("company_id"):
        company = await db.companies.find_one({"_id": customer["company_id"]})
    
    return CustomerResponse(
        id=str(customer["_id"]),
        name=customer["name"],
        email=customer["email"],
        phone_number=customer.get("phone_number"),
        position=customer.get("position"),
        company_id=str(customer["company_id"]) if customer.get("company_id") else "",
        company_name=company["name"] if company else None,
        industry=company.get("industry") if company else None,
    )


@router.get("/", response_model=List[CustomerResponse])
async def list_customers():
    """Get all customers."""
    db = await get_db()
    customers = await db.customers.find().to_list(length=1000)
    return [await get_customer_response(c, db) for c in customers]


@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(customer_id: str):
    """Get a specific customer by ID."""
    db = await get_db()
    try:
        customer = await db.customers.find_one({"_id": ObjectId(customer_id)})
    except:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return await get_customer_response(customer, db)


@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def create_customer(customer_data: CustomerCreate):
    """Create a new customer."""
    db = await get_db()
    
    # Verify company exists
    try:
        company = await db.companies.find_one({"_id": ObjectId(customer_data.company_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid company ID")
    
    if not company:
        raise HTTPException(status_code=400, detail="Company not found")
    
    customer = {
        "name": customer_data.name,
        "email": customer_data.email,
        "phone_number": customer_data.phone_number,
        "position": customer_data.position,
        "company_id": ObjectId(customer_data.company_id),
    }
    result = await db.customers.insert_one(customer)
    customer["_id"] = result.inserted_id
    
    return await get_customer_response(customer, db)


@router.put("/{customer_id}", response_model=CustomerResponse)
async def update_customer(customer_id: str, customer_data: CustomerUpdate):
    """Update an existing customer."""
    db = await get_db()
    
    try:
        customer = await db.customers.find_one({"_id": ObjectId(customer_id)})
    except:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    update_data = customer_data.model_dump(exclude_unset=True)
    
    if "company_id" in update_data:
        update_data["company_id"] = ObjectId(update_data["company_id"])
    
    if update_data:
        await db.customers.update_one({"_id": ObjectId(customer_id)}, {"$set": update_data})
        customer = await db.customers.find_one({"_id": ObjectId(customer_id)})
    
    return await get_customer_response(customer, db)


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_customer(customer_id: str):
    """Delete a customer."""
    db = await get_db()
    
    try:
        result = await db.customers.delete_one({"_id": ObjectId(customer_id)})
    except:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return None
