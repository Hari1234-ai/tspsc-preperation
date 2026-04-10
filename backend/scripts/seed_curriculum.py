import os
import sys

# Add current directory to path
sys.path.append(os.getcwd())

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.db.base import Base, Subject, Topic, Paper

def slugify(text):
    return text.lower().replace(" & ", "_").replace(" ", "_").replace("-", "_").replace("&", "_").replace("(", "").replace(")", "").replace("__", "_").strip("_")

def seed():
    db = SessionLocal()
    try:
        print("Starting curriculum reconstruction...")
        
        # 1. Ensure Exams/Papers exist (Group II as primary structure)
        papers_info = [
            {"id": "G2_P1", "title": "Paper I: General Studies & General Abilities", "order": 1},
            {"id": "G2_P2", "title": "Paper II: History, Polity & Society", "order": 2},
            {"id": "G2_P3", "title": "Paper III: Economy & Development", "order": 3},
            {"id": "G2_P4", "title": "Paper IV: Telangana Movement & State Formation", "order": 4},
        ]
        
        paper_objs = {}
        for p in papers_info:
            obj = db.query(Paper).filter(Paper.id == p["id"]).first()
            if not obj:
                obj = Paper(id=p["id"], exam_id="Group_II", title=p["title"], order_index=p["order"])
                db.add(obj)
            paper_objs[p["id"]] = obj
        
        # 2. Define Subjects and their Topics
        curriculum = {
            "GENERAL STUDIES & GENERAL ABILITIES": {
                "id": "gs_ga",
                "paper": "G2_P1",
                "topics": [
                    "Current Affairs & Events", "Science & Technology", "Environment & Disaster Management",
                    "Geography", "History & Culture", "Telangana Specific", "Society & Social Issues",
                    "Aptitude & Skills", "Language"
                ]
            },
            "HISTORY": {
                "id": "history",
                "paper": "G2_P2",
                "topics": ["Ancient India", "Medieval India", "Modern India", "Telangana History", "Modern Telangana"]
            },
            "POLITY": {
                "id": "polity",
                "paper": "G2_P2",
                "topics": ["Indian Constitution", "Governance", "Federal System", "Local Governance", "Elections & Judiciary", "Welfare & Rights"]
            },
            "SOCIETY": {
                "id": "society",
                "paper": "G2_P2",
                "topics": ["Social Structure", "Social Issues", "Social Movements", "Telangana Social Issues", "Welfare Policies"]
            },
            "INDIAN ECONOMY": {
                "id": "indian_economy",
                "paper": "G2_P3",
                "topics": ["Growth & Development", "National Income", "Poverty & Unemployment", "Economic Planning"]
            },
            "TELANGANA ECONOMY": {
                "id": "telangana_economy",
                "paper": "G2_P3",
                "topics": ["Historical Economy", "Land Reforms", "Agriculture", "Industry & Services"]
            },
            "DEVELOPMENT ISSUES": {
                "id": "development_issues",
                "paper": "G2_P3",
                "topics": ["Inequality & Migration", "Displacement", "Economic Reforms", "Sustainable Development"]
            },
            "TELANGANA MOVEMENT": {
                "id": "telangana_movement",
                "paper": "G2_P4",
                "topics": ["Background", "Pre-Formation Issues", "Formation of Andhra Pradesh", "Telangana Agitation", "Mobilisation Phase", "Final Formation"]
            },
            "SECRETARIAL ABILITIES": {
                "id": "secretarial_abilities",
                "paper": "G2_P1", # Also linked to GP1 or specialized papers
                "topics": ["Mental Ability", "Logical Reasoning", "Comprehension", "Sentence Arrangement", "Numerical Ability"]
            }
        }

        # 3. Create Subjects and Topics
        for s_title, s_data in curriculum.items():
            # Subject
            s_obj = db.query(Subject).filter(Subject.id == s_data["id"]).first()
            if not s_obj:
                s_obj = Subject(id=s_data["id"], title=s_title)
                db.add(s_obj)
            
            # Link Subject to Paper
            p_obj = paper_objs.get(s_data["paper"])
            if p_obj and s_obj not in p_obj.subjects:
                p_obj.subjects.append(s_obj)
            
            # Topics
            for t_title in s_data["topics"]:
                t_id = slugify(t_title)
                t_obj = db.query(Topic).filter(Topic.id == t_id).first()
                if not t_obj:
                    t_obj = Topic(id=t_id, title=t_title)
                    db.add(t_obj)
                
                # Link Topic to Subject
                if t_obj not in s_obj.topics:
                    s_obj.topics.append(t_obj)
        
        db.commit()
        print("Curriculum reconstruction complete! 🚀")
        print(f"Total Subjects: {len(curriculum)}")
        
    except Exception as e:
        print(f"Error reconstruction: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
