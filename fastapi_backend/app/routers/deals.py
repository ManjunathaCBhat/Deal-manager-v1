from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_db

router = APIRouter(prefix="/deals", tags=["deals"])

MUSTAFA_AVATAR_URL = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"


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
    close_date: Optional[str] = None
    contacts: List[ContactInfo] = []


class DealCreate(BaseModel):
    title: str
    amount: float
    company_id: str
    stage: str = "NEW"
    close_date: Optional[str] = None
    contact_ids: List[str] = []


class DealUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    company_id: Optional[str] = None
    stage: Optional[str] = None
    close_date: Optional[str] = None
    contact_ids: Optional[List[str]] = None


async def get_deal_response(deal: dict, db) -> DealResponse:
    """Convert deal dict to response with company and contacts info."""
    company = None
    if deal.get("company_id"):
        company = await db.companies.find_one({"_id": deal["company_id"]})
    
    contacts = []
    for contact_id in deal.get("contact_ids", []):
        customer = await db.customers.find_one({"_id": contact_id})
        if customer:
            contacts.append(ContactInfo(
                id=str(customer["_id"]),
                name=customer["name"],
                email=customer["email"],
                phone_number=customer.get("phone_number"),
                avatar_url=MUSTAFA_AVATAR_URL,
                position=customer.get("position"),
            ))
    
    return DealResponse(
        id=str(deal["_id"]),
        title=deal["title"],
        amount=deal["amount"],
        company_id=str(deal["company_id"]) if deal.get("company_id") else "",
        company_name=company["name"] if company else None,
        stage=deal.get("stage", "NEW"),
        close_date=deal.get("close_date"),
        contacts=contacts,
    )


@router.get("/", response_model=List[DealResponse])
async def list_deals():
    """Get all deals."""
    db = await get_db()
    deals = await db.deals.find().to_list(length=1000)
    return [await get_deal_response(d, db) for d in deals]


@router.get("/{deal_id}", response_model=DealResponse)
async def get_deal(deal_id: str):
    """Get a specific deal by ID."""
    db = await get_db()
    try:
        deal = await db.deals.find_one({"_id": ObjectId(deal_id)})
    except:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    return await get_deal_response(deal, db)


@router.post("/", response_model=DealResponse, status_code=status.HTTP_201_CREATED)
async def create_deal(deal_data: DealCreate):
    """Create a new deal."""
    db = await get_db()
    
    # Verify company exists
    try:
        company = await db.companies.find_one({"_id": ObjectId(deal_data.company_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid company ID")
    
    if not company:
        raise HTTPException(status_code=400, detail="Company not found")
    
    # Convert contact IDs
    contact_ids = [ObjectId(cid) for cid in deal_data.contact_ids]
    
    deal = {
        "title": deal_data.title,
        "amount": deal_data.amount,
        "company_id": ObjectId(deal_data.company_id),
        "stage": deal_data.stage,
        "close_date": deal_data.close_date,
        "contact_ids": contact_ids,
    }
    result = await db.deals.insert_one(deal)
    deal["_id"] = result.inserted_id
    
    return await get_deal_response(deal, db)


@router.put("/{deal_id}", response_model=DealResponse)
async def update_deal(deal_id: str, deal_data: DealUpdate):
    """Update an existing deal."""
    db = await get_db()
    
    try:
        deal = await db.deals.find_one({"_id": ObjectId(deal_id)})
    except:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    update_data = deal_data.model_dump(exclude_unset=True)
    
    if "company_id" in update_data:
        update_data["company_id"] = ObjectId(update_data["company_id"])
    
    if "contact_ids" in update_data:
        update_data["contact_ids"] = [ObjectId(cid) for cid in update_data["contact_ids"]]
    
    if update_data:
        await db.deals.update_one({"_id": ObjectId(deal_id)}, {"$set": update_data})
        deal = await db.deals.find_one({"_id": ObjectId(deal_id)})
    
    return await get_deal_response(deal, db)


@router.delete("/{deal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deal(deal_id: str):
    """Delete a deal."""
    db = await get_db()
    
    try:
        result = await db.deals.delete_one({"_id": ObjectId(deal_id)})
    except:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    return None
