from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db
from app.routers import companies, customers, deals, auth, dashboard, deal_chat, activity_log
from app.config import get_settings
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup: Initialize database connection
    try:
        await init_db()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Warning: Database initialization failed: {e}")
        print("API will start but database operations may fail")
    yield
    # Shutdown: nothing to clean up (motor handles connection pooling)


app = FastAPI(
    title="CRM API",
    description="FastAPI CRM Backend with MongoDB",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware - get allowed origins from environment
cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(companies.router, prefix="/api")
app.include_router(customers.router, prefix="/api")
app.include_router(deals.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(deal_chat.router, prefix="/api")
app.include_router(activity_log.router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "CRM API is running"}


@app.get("/api/health")
async def health():
    return {"status": "healthy"}
