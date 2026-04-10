import sys
import os
sys.path.append(os.getcwd())

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base, Paper

SQLALCHEMY_DATABASE_URL = "sqlite:///./cracksarkar.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_exams():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    exams = [
        {"id": "group-2", "title": "Group II", "exam_id": "Group_II", "order_index": 1, "description": "Group II Services competitive examination for state level administrative posts."},
        {"id": "group-3", "title": "Group III", "exam_id": "Group_III", "order_index": 2, "description": "Group III Services competitive examination for non-gazetted posts."},
        {"id": "group-4", "title": "Group IV", "exam_id": "Group_IV", "order_index": 3, "description": "Group IV Services competitive examination for junior assistants and equivalent posts."},
    ]
    
    for ex in exams:
        # Check if exists
        existing = db.query(Paper).filter(Paper.id == ex["id"]).first()
        if existing:
            existing.title = ex["title"]
            existing.exam_id = ex["exam_id"]
            existing.order_index = ex["order_index"]
            existing.description = ex["description"]
        else:
            paper = Paper(**ex)
            db.add(paper)
    
    db.commit()
    print("Seeded/Updated 3 exams: Group II, Group III, Group IV")
    db.close()

if __name__ == "__main__":
    seed_exams()
