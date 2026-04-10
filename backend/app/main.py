from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from .api.v1.api import api_router
from .db.session import engine
from .db.base import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CrackSarkar API",
    description="Backend for AI-powered CrackSarkar exam preparation platform",
    version="1.0.0"
)

# Set up CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to CrackSarkar API", "status": "online"}

app.include_router(api_router, prefix="/api/v1")
