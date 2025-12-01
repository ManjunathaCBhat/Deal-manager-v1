from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import timedelta
from typing import Optional
import logging
from app.models.user import User, UserCreate, UserResponse, Token
from app.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    get_current_active_user,
)
from app.azure_auth import (
    validate_azure_token,
    get_or_create_azure_user,
    get_azure_settings,
)
from app.config import get_settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


class AzureTokenRequest(BaseModel):
    """Request body for Azure AD token exchange"""
    access_token: str


class SSOConfigResponse(BaseModel):
    """SSO configuration for frontend"""
    enabled: bool
    tenant_id: Optional[str] = None
    client_id: Optional[str] = None
    redirect_uri: Optional[str] = None


@router.get("/sso-config", response_model=SSOConfigResponse)
async def get_sso_config():
    """Get SSO configuration for frontend MSAL setup"""
    azure_settings = get_azure_settings()
    settings = get_settings()
    
    if not azure_settings:
        return SSOConfigResponse(enabled=False)
    
    return SSOConfigResponse(
        enabled=True,
        tenant_id=azure_settings.tenant_id,
        client_id=azure_settings.client_id,
        redirect_uri=settings.openrouter_site_url
    )


@router.post("/azure/token", response_model=Token)
async def azure_login(request: AzureTokenRequest):
    """
    Exchange Azure AD access token for application JWT tokens.
    
    This endpoint:
    1. Validates the Azure AD token
    2. Creates or retrieves the user in our database
    3. Issues our own JWT tokens for subsequent API calls
    """
    try:
        logger.info("Received Azure token exchange request")
        
        # Validate Azure token and get user info
        azure_user = await validate_azure_token(request.access_token)
        logger.info(f"Azure user validated: {azure_user.preferred_username}")
        
        # Get or create user in our database
        user = await get_or_create_azure_user(azure_user)
        logger.info(f"User retrieved/created: {user.get('username')}")
        
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is disabled",
            )
        
        # Create our application tokens
        access_token = create_access_token(data={"sub": user["username"]})
        refresh_token = create_refresh_token(data={"sub": user["username"]})
        
        logger.info(f"Tokens created successfully for user: {user['username']}")
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Azure AD authentication failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Azure AD authentication failed: {str(e)}",
        )


@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get access token."""
    user = await User.find_one({"username": form_data.username})
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is disabled",
        )
    
    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )


@router.post("/token/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_active_user)):
    """Refresh access token."""
    access_token = create_access_token(data={"sub": current_user.username})
    refresh_token = create_refresh_token(data={"sub": current_user.username})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user."""
    # Check if username already exists
    existing_user = await User.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    
    # Check if email already exists
    existing_email = await User.find_one({"email": user_data.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create user
    user = User(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=get_password_hash(user_data.password),
        is_active=True,
        is_staff=False,
    )
    await user.insert()
    
    return UserResponse(
        id=str(user.id),
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_staff=user.is_staff,
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user info."""
    return UserResponse(
        id=str(current_user.id),
        username=current_user.username,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        is_staff=current_user.is_staff,
    )
