from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from app.llm import generate_reply

router = APIRouter(prefix="/deal-chat", tags=["deal-chat"])


class DealState(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    company_name: Optional[str] = None
    stage: Optional[str] = None
    close_date: Optional[str] = None


class DealChatRequest(BaseModel):
    message: str
    deal_state: Optional[DealState] = None


class DealChatResponse(BaseModel):
    ai_message: str
    deal_state: Optional[DealState] = None


@router.post("/", response_model=DealChatResponse)
async def chat_about_deal(request: DealChatRequest):
    """AI chat to help create or discuss a deal."""
    
    # Build context based on deal state
    if request.deal_state:
        context = f"""You are a helpful CRM assistant helping to create or manage a deal.
Current deal information:
- Title: {request.deal_state.title or 'Not set'}
- Amount: ${request.deal_state.amount or 0:,.2f}
- Company: {request.deal_state.company_name or 'Not set'}
- Stage: {request.deal_state.stage or 'NEW'}
- Close Date: {request.deal_state.close_date or 'Not set'}

Help the user with their request. If they're starting a new deal, ask for the deal title first, then amount, company, and expected close date."""
    else:
        context = """You are a helpful CRM assistant. The user wants to create a new deal.
Start by asking them for the deal title. Then you'll ask for the deal amount, company, and expected close date.
Be friendly and helpful. Keep your responses concise."""

    # Generate reply
    messages = [{"role": "user", "content": request.message}]
    
    try:
        reply = await generate_reply(context, messages)
    except Exception as e:
        reply = "I'm here to help you create and manage deals. What would you like to do?"
    
    # Return response with updated deal state
    return DealChatResponse(
        ai_message=reply,
        deal_state=request.deal_state or DealState()
    )
