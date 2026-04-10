from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
from .api.v1.api import api_router
from .db.session import engine
from .db.base import Base

# Create database tables
Base.metadata.create_all(bind=engine)

# Auto-seed initial exams if empty (for production migration)
from .db.session import SessionLocal
from .db.base import Paper
db = SessionLocal()
try:
    if not db.query(Paper).first():
        print("Seeding production database with initial exams...")
        exams = [
            Paper(id="Group_II", title="TSPSC Group II", exam_id="Group_II", description="Executive and Non-Executive Posts", order_index=1),
            Paper(id="Group_III", title="TSPSC Group III", exam_id="Group_III", description="Senior Accountant and Auditor Posts", order_index=2),
            Paper(id="Group_IV", title="TSPSC Group IV", exam_id="Group_IV", description="Junior Assistant and Typist Posts", order_index=3),
        ]
        db.add_all(exams)
        db.commit()
except Exception as e:
    print(f"Seed error: {e}")
finally:
    db.close()

app = FastAPI(
    title="CrackSarkar API",
    description="Backend for AI-powered CrackSarkar exam preparation platform",
    version="1.0.0"
)

# Set up CORS for all origins (Production Ready)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
