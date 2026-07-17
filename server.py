from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# In-memory storage (data resets when server restarts)
visits = []
status_checks = []

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

@api_router.get("/")
async def root():
    return {"message": "trgdm terminal online"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    try:
        status_obj = StatusCheck(**input.model_dump())
        status_checks.append(status_obj)
        return status_obj
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    return status_checks[-100:]  # Return last 100

@api_router.post("/visits", response_model=VisitorResponse)
async def register_visit():
    try:
        now = datetime.now(timezone.utc).isoformat()
        visits.append({"id": str(uuid.uuid4()), "at": now})
        return VisitorResponse(count=len(visits), latest_at=now)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/visits", response_model=VisitorResponse)
async def get_visits():
    now = datetime.now(timezone.utc).isoformat()
    latest_at = visits[-1]["at"] if visits else now
    return VisitorResponse(count=len(visits), latest_at=latest_at)

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
