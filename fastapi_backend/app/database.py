from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import get_settings
from app.models.company import Company
from app.models.customer import Customer
from app.models.deal import Deal
from app.models.user import User
from app.models.activity_log import ActivityLog

# Global database connection
_db = None


async def get_db():
    """Get database instance."""
    global _db
    if _db is None:
        settings = get_settings()
        client = AsyncIOMotorClient(settings.mongo_uri)
        _db = client[settings.database_name]
    return _db


async def init_db():
    """Initialize MongoDB connection and Beanie ODM."""
    settings = get_settings()
    
    client = AsyncIOMotorClient(settings.mongo_uri)
    
    global _db
    _db = client[settings.database_name]
    
    await init_beanie(
        database=client[settings.database_name],
        document_models=[
            Company,
            Customer,
            Deal,
            User,
            ActivityLog,
        ]
    )
    
    return client
