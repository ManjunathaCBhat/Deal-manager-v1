from fastapi import APIRouter
from pydantic import BaseModel
from app.database import get_db

router = APIRouter(prefix="/dashboard-metrics", tags=["dashboard"])


class DashboardMetrics(BaseModel):
    total_companies: int
    total_contacts: int
    total_deals: int
    total_deal_value: float
    won_deal_value: float


@router.get("/", response_model=DashboardMetrics)
async def get_dashboard_metrics():
    """Get dashboard metrics."""
    db = await get_db()
    
    # Count companies
    total_companies = await db.companies.count_documents({})
    
    # Count contacts (customers)
    total_contacts = await db.customers.count_documents({})
    
    # Get all deals
    deals = await db.deals.find().to_list(length=10000)
    total_deals = len(deals)
    
    # Calculate total and won deal values
    total_deal_value = sum(deal.get("amount", 0) for deal in deals)
    won_deal_value = sum(deal.get("amount", 0) for deal in deals if deal.get("stage") == "WON")
    
    return DashboardMetrics(
        total_companies=total_companies,
        total_contacts=total_contacts,
        total_deals=total_deals,
        total_deal_value=total_deal_value,
        won_deal_value=won_deal_value,
    )
