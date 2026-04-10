import os
import sys

# Add the parent directory to sys.path so we can import 'app'
sys.path.append(os.getcwd())

from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.db.base import Base, Subject, Paper

def seed():
    db = SessionLocal()
    try:
        # 1. Ensure Papers (Exams) exist
        # Group II Papers
        p2_1 = db.query(Paper).filter(Paper.id == "G2_P1").first()
        if not p2_1:
            p2_1 = Paper(id="G2_P1", exam_id="Group_II", title="Paper I: General Studies & General Abilities", order_index=1)
            db.add(p2_1)
        
        p2_2 = db.query(Paper).filter(Paper.id == "G2_P2").first()
        if not p2_2:
            p2_2 = Paper(id="G2_P2", exam_id="Group_II", title="Paper II: History, Polity & Society", order_index=2)
            db.add(p2_2)

        p2_3 = db.query(Paper).filter(Paper.id == "G2_P3").first()
        if not p2_3:
            p2_3 = Paper(id="G2_P3", exam_id="Group_II", title="Paper III: Economy & Development", order_index=3)
            db.add(p2_3)

        p2_4 = db.query(Paper).filter(Paper.id == "G2_P4").first()
        if not p2_4:
            p2_4 = Paper(id="G2_P4", exam_id="Group_II", title="Paper IV: Telangana Movement & State Formation", order_index=4)
            db.add(p2_4)

        # 2. Define Subjects
        subjects_data = [
            {"id": "gs_ga", "title": "GENERAL STUDIES & GENERAL ABILITIES"},
            {"id": "history", "title": "HISTORY"},
            {"id": "polity", "title": "POLITY"},
            {"id": "society", "title": "SOCIETY"},
            {"id": "indian_economy", "title": "INDIAN ECONOMY"},
            {"id": "telangana_economy", "title": "TELANGANA ECONOMY"},
            {"id": "development_issues", "title": "DEVELOPMENT ISSUES"},
            {"id": "telangana_movement", "title": "TELANGANA MOVEMENT"},
            {"id": "secretarial_abilities", "title": "SECRETARIAL ABILITIES"},
        ]

        subjects_objs = {}
        for s in subjects_data:
            obj = db.query(Subject).filter(Subject.id == s["id"]).first()
            if not obj:
                obj = Subject(id=s["id"], title=s["title"])
                db.add(obj)
            subjects_objs[s["id"]] = obj

        db.commit() # Save subjects so we can link them

        # 3. Link Subjects to Papers (Standard Group II Mapping)
        # Paper 1
        if subjects_objs["gs_ga"] not in p2_1.subjects:
            p2_1.subjects.append(subjects_objs["gs_ga"])
        
        # Paper 2
        for sid in ["history", "polity", "society"]:
            if subjects_objs[sid] not in p2_2.subjects:
                p2_2.subjects.append(subjects_objs[sid])
        
        # Paper 3
        for sid in ["indian_economy", "telangana_economy", "development_issues"]:
            if subjects_objs[sid] not in p2_3.subjects:
                p2_3.subjects.append(subjects_objs[sid])
        
        # Paper 4
        if subjects_objs["telangana_movement"] not in p2_4.subjects:
            p2_4.subjects.append(subjects_objs["telangana_movement"])

        db.commit()
        print("Successfully seeded subjects and linked to Group II Papers.")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
