from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Get environment variables with fallbacks for Railway
mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME', 'test_database')

if not mongo_url:
    logging.warning("MONGO_URL not set. Using fallback for development.")
    # For Railway, you MUST set this in the dashboard
    # This fallback is only for local development
    mongo_url = "mongodb://localhost:27017"

try:
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    # Test connection
    client.admin.command('ping')
    logging.info(f"Successfully connected to MongoDB at {mongo_url}")
except Exception as e:
    logging.error(f"Failed to connect to MongoDB: {e}")
    # Create a dummy client for Railway deployment to not crash
    # The app will still start but API calls will fail until MongoDB is configured
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client[db_name]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class VisitorResponse(BaseModel):
    count: int
    latest_at: str

@app.on_event("startup")
async def create_indexes():
    try:
        await db.status_checks.create_index("timestamp")
        await db.visits.create_index("at")
        logging.info("Indexes created successfully")
    except Exception as e:
        logging.warning(f"Index creation failed: {e}")

@api_router.get("/")
async def root():
    return {"message": "trgdm terminal online"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    try:
        status_obj = StatusCheck(**input.model_dump())
        doc = status_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.status_checks.insert_one(doc)
        return status_obj
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    try:
        status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
        for check in status_checks:
            if isinstance(check['timestamp'], str):
                check['timestamp'] = datetime.fromisoformat(check['timestamp'])
        return status_checks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/visits", response_model=VisitorResponse)
async def register_visit():
    try:
        now = datetime.now(timezone.utc).isoformat()
        await db.visits.insert_one({"id": str(uuid.uuid4()), "at": now})
        count = await db.visits.count_documents({})
        return VisitorResponse(count=count, latest_at=now)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/visits", response_model=VisitorResponse)
async def get_visits():
    try:
        count = await db.visits.count_documents({})
        latest = await db.visits.find({}, {"_id": 0}).sort("at", -1).limit(1).to_list(1)
        latest_at = latest[0]["at"] if latest else datetime.now(timezone.utc).isoformat()
        return VisitorResponse(count=count, latest_at=latest_at)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
