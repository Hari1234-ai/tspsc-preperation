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
# --- Robust Syllabus Seeding & Repair ---
from .db.session import SessionLocal
from .db.base import Paper, Subject, Topic, Subtopic, paper_subject_association, subject_topic_association

def perform_syllabus_repair(db):
    """Deep Clean: Wipes existing syllabus data and restores a clean, high-fidelity hierarchy."""
    try:
        print("🚀 [REPAIR] Starting Deep Clean and Hierarchy Restoration...")
        
        # 0. Wipe existing data for a clean slate (Crucial for production recovery)
        db.execute(paper_subject_association.delete())
        db.execute(subject_topic_association.delete())
        from .db.base import topic_subtopic_association, subtopic_concept_association
        db.execute(topic_subtopic_association.delete())
        db.execute(subtopic_concept_association.delete())
        
        db.query(Subtopic).delete()
        db.query(Topic).delete()
        db.query(Subject).delete()
        db.query(Paper).delete()
        db.flush()

        # 1. High-level Papers
        paper_data = [
            ("P1", "Paper I - General Studies & General Abilities", 1),
            ("P2", "Paper II - History, Polity & Society", 2),
            ("P3", "Paper III - Economy & Development", 3),
            ("P4", "Paper IV - Telangana Movement & State Formation", 4),
        ]
        
        for pid, title, idx in paper_data:
            p = db.query(Paper).filter(Paper.id == pid).first()
            if not p:
                p = Paper(id=pid, title=title, exam_id="Group_II", order_index=idx)
                db.add(p)
            else:
                p.title = title
                p.order_index = idx
        db.flush()

        # 2. Paper I: General Studies Section
        gs_section = db.query(Subject).filter(Subject.id == "P1-S1").first()
        if not gs_section:
            gs_section = Subject(id="P1-S1", title="General Studies", order_index=1)
            db.add(gs_section)
        db.flush()
        
        # Link Section to Paper I
        link = db.execute(paper_subject_association.select().where(
            paper_subject_association.c.paper_id == "P1",
            paper_subject_association.c.subject_id == "P1-S1"
        )).first()
        if not link:
            db.execute(paper_subject_association.insert().values(paper_id="P1", subject_id="P1-S1"))

        # 3. Paper I Topics
        p1_topics = [
            "National & International Important Events",
            "Current Affairs (Regional, National & International)",
            "General Science & Applications",
            "India’s Achievements in Science & Technology",
            "Disaster Management (Prevention & Mitigation)",
            "Environmental Issues",
            "Geography (World, India, Telangana)",
            "Indian History & Cultural Heritage",
            "Telangana Society, Culture, Arts & Literature",
            "Telangana State Policies",
            "Social Exclusion, Rights Issues & Inclusive Policies",
            "Logical Reasoning, Analytical Ability & Data Interpretation",
            "Basic English"
        ]
        for idx, title in enumerate(p1_topics, 1):
            tid = f"P1-S1-T{idx}"
            t = db.query(Topic).filter(Topic.id == tid).first()
            if not t:
                t = Topic(id=tid, title=title, order_index=idx, weightage="High")
                db.add(t)
                db.flush()
            
            # Link Topic to Subject
            t_link = db.execute(subject_topic_association.select().where(
                subject_topic_association.c.subject_id == "P1-S1",
                subject_topic_association.c.topic_id == tid
            )).first()
            if not t_link:
                db.execute(subject_topic_association.insert().values(subject_id="P1-S1", topic_id=tid))

        # 4. Paper II Sections
        p2_sections = {
            "P2-S1": "History",
            "P2-S2": "Indian Constitution & Politics",
            "P2-S3": "Social Structure & Issues"
        }
        for sid, title in p2_sections.items():
            s = db.query(Subject).filter(Subject.id == sid).first()
            if not s:
                s = Subject(id=sid, title=title, order_index=1)
                db.add(s)
                db.flush()
            
            s_link = db.execute(paper_subject_association.select().where(
                paper_subject_association.c.paper_id == "P2",
                paper_subject_association.c.subject_id == sid
            )).first()
            if not s_link:
                db.execute(paper_subject_association.insert().values(paper_id="P2", subject_id=sid))

        db.commit()
        print("✅ [SUCCESS] Syllabus hierarchy synchronized.")
        return True
    except Exception as e:
        db.rollback()
        print(f"❌ [ERROR] Syllabus repair failed: {e}")
        return False

def auto_repair_on_startup():
    db = SessionLocal()
    try:
        # Check if Paper I has its subject linked
        has_links = db.execute(paper_subject_association.select().where(
            paper_subject_association.c.paper_id == "P1"
        )).first()
        
        if not has_links:
            perform_syllabus_repair(db)
    finally:
        db.close()

auto_repair_on_startup()

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
