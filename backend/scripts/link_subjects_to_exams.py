import os
import sys

# Add the parent directory to the path so we can import the app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.db.base import Paper, Subject

def link_subjects():
    db = SessionLocal()
    try:
        # 1. Fetch all relevant papers
        g2 = db.query(Paper).filter(Paper.id == "Group_II").first()
        g3 = db.query(Paper).filter(Paper.id == "Group_III").first()
        g4 = db.query(Paper).filter(Paper.id == "Group_IV").first()
        
        if not g2 or not g3 or not g4:
            print("Error: Could not find all exam papers (Group II, III, IV).")
            return

        # 2. Fetch all unique subjects by title
        subjects = db.query(Subject).all()
        sub_map = {s.title.upper(): s for s in subjects}
        
        print(f"Found {len(subjects)} subjects in database.")

        # 3. Define the desired mappings
        mappings = {
            "Group_II": [
                "GENERAL STUDIES & GENERAL ABILITIES",
                "HISTORY",
                "POLITY",
                "SOCIETY",
                "INDIAN ECONOMY",
                "TELANGANA ECONOMY",
                "TELANGANA MOVEMENT",
                "DEVELOPMENT ISSUES"
            ],
            "Group_III": [
                "GENERAL STUDIES & GENERAL ABILITIES",
                "HISTORY",
                "POLITY",
                "SOCIETY",
                "INDIAN ECONOMY"
            ],
            "Group_IV": [
                "GENERAL STUDIES & GENERAL ABILITIES",
                "SECRETARIAL ABILITIES"
            ]
        }

        # 4. Apply the mappings
        for paper_id, sub_titles in mappings.items():
            paper = db.query(Paper).filter(Paper.id == paper_id).first()
            if not paper: continue
            
            # Clear current associations for this paper (to rebuild)
            paper.subjects = []
            
            for title in sub_titles:
                subject = sub_map.get(title.upper())
                if subject:
                    if subject not in paper.subjects:
                        paper.subjects.append(subject)
                        print(f"Linked '{title}' to {paper_id}")
                else:
                    print(f"Warning: Subject '{title}' not found in database.")

        db.commit()
        print("\nSUCCESS: All exam-subject mappings updated.")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    link_subjects()
