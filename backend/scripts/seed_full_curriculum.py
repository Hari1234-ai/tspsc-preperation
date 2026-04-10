import os
import sys

# Add current directory to path
sys.path.append(os.getcwd())

from sqlalchemy.orm import Session
from sqlalchemy import delete
from app.db.session import SessionLocal
from app.db.base import Base, Subject, Topic, Subtopic, Paper, paper_subject_association

def slugify(text):
    return text.lower().replace(" & ", "_").replace(" ", "_").replace("-", "_").replace("&", "_").replace("(", "").replace(")", "").replace("__", "_").replace("/", "_").strip("_")

def seed():
    db = SessionLocal()
    try:
        print("Starting Global Curriculum Ingestion... 🏗️")
        
        # 1. Clear any accidental links to Papers (as requested: "link later")
        print("Clearing exam-to-subject links...")
        db.execute(delete(paper_subject_association))
        
        # 2. Data Structure
        curriculum_data = {
            "GENERAL STUDIES & GENERAL ABILITIES": {
                "id": "gs_ga",
                "topics": {
                    "Current Affairs & Events": ["Current affairs (regional, national, international)", "Events of national & international importance", "International relations and events"],
                    "Science & Technology": ["General Science", "Applications of Science", "India’s achievements in Science & Technology"],
                    "Environment & Disaster Management": ["Environmental issues", "Disaster management (prevention & mitigation)"],
                    "Geography": ["World Geography", "Indian Geography", "Telangana Geography"],
                    "History & Culture": ["Indian History", "Cultural Heritage of India"],
                    "Telangana Specific": ["Telangana culture, arts, literature", "Telangana State policies"],
                    "Society & Social Issues": ["Social exclusion", "Rights issues", "Inclusive policies"],
                    "Aptitude & Skills": ["Logical reasoning", "Analytical ability", "Data interpretation"],
                    "Language": ["Basic English"]
                }
            },
            "HISTORY": {
                "id": "history",
                "topics": {
                    "Ancient India": ["Indus Valley Civilization", "Vedic Civilization (Early & Later)", "Jainism & Buddhism", "Mauryas, Guptas, Cholas, etc.", "Harsha & Rajput Age"],
                    "Medieval India": ["Delhi Sultanate", "Sufi & Bhakti Movements", "Mughal Empire", "Marathas", "Deccan Kingdoms"],
                    "Modern India": ["Advent of Europeans", "Rise & Expansion of British Rule", "Socio-cultural reforms", "Reform movements (Phule, Ambedkar, Gandhi, etc.)"],
                    "Telangana History": ["Ancient Telangana dynasties", "Medieval Telangana (Kakatiyas, Qutub Shahis)", "Socio-cultural developments", "Festivals & traditions"],
                    "Modern Telangana": ["Asaf Jahi dynasty", "Social systems (Vetti, Zamindars)", "Tribal & peasant movements"]
                }
            },
            "POLITY": {
                "id": "polity",
                "topics": {
                    "Indian Constitution": ["Preamble", "Fundamental Rights & Duties", "Directive Principles"],
                    "Governance": ["Union & State Government", "President, PM, Governor, CM", "Legislature"],
                    "Federal System": ["Centre-State relations", "Administrative powers"],
                    "Local Governance": ["Panchayati Raj (73rd Amendment)", "Urban governance (74th Amendment)"],
                    "Elections & Judiciary": ["Electoral system", "Election Commission", "Judicial system & activism"],
                    "Welfare & Rights": ["SC/ST/BC provisions", "National Commissions"]
                }
            },
            "SOCIETY": {
                "id": "society",
                "topics": {
                    "Social Structure": ["Caste system", "Family & marriage", "Religion & kinship", "Women in society"],
                    "Social Issues": ["Casteism", "Communalism", "Gender issues", "Child labour", "Human trafficking"],
                    "Social Movements": ["Tribal movements", "Dalit movements", "Women’s movements", "Environmental movements"],
                    "Telangana Social Issues": ["Vetti system", "Jogini system", "Migration", "Farmer distress"],
                    "Welfare Policies": ["Government welfare schemes", "Poverty alleviation", "Social security"]
                }
            },
            "INDIAN ECONOMY": {
                "id": "indian_economy",
                "topics": {
                    "Growth & Development": ["Concepts of growth & development", "Measurement methods"],
                    "National Income": ["Nominal vs Real income"],
                    "Poverty & Unemployment": ["Types", "Measurement"],
                    "Economic Planning": ["Five Year Plans", "NITI Aayog", "Inclusive growth"]
                }
            },
            "TELANGANA ECONOMY": {
                "id": "telangana_economy",
                "topics": {
                    "Historical Economy": ["Telangana in Andhra Pradesh (1956–2014)", "Zamindari abolition"],
                    "Land Reforms": ["Land ceiling"],
                    "Agriculture": ["Irrigation", "Dryland farming", "Credit"],
                    "Industry & Services": ["MSMEs", "Industrial policy", "Service sector"]
                }
            },
            "DEVELOPMENT ISSUES": {
                "id": "development_issues",
                "topics": {
                    "Inequality & Migration": ["Regional inequality", "Social inequality", "Migration"],
                    "Displacement": ["Land acquisition", "Rehabilitation"],
                    "Economic Reforms": ["Poverty & inequality"],
                    "Sustainable Development": ["Social development", "SDGs", "Measurement"]
                }
            },
            "TELANGANA MOVEMENT": {
                "id": "telangana_movement",
                "topics": {
                    "Background": ["Historical background"],
                    "Pre-Formation Issues": ["Cultural & social features", "Hyderabad State", "Mulki rules", "Employment issues"],
                    "Formation of Andhra Pradesh": ["SRC debates", "Gentlemen’s Agreement"],
                    "Telangana Agitation": ["Regional imbalance", "1969 movement", "Role of students & leaders"],
                    "Mobilisation Phase": ["Political movements", "TRS formation", "Committees"],
                    "Final Formation": ["Parliamentary process", "Telangana state formation (2014)"]
                }
            },
            "SECRETARIAL ABILITIES": {
                "id": "secretarial_abilities",
                "topics": {
                    "Mental Ability": ["Verbal reasoning", "Non-verbal reasoning"],
                    "Logical Reasoning": ["Analytical ability", "Logical thinking"],
                    "Comprehension": ["Reading comprehension"],
                    "Sentence Arrangement": ["Rearranging sentences"],
                    "Numerical Ability": ["Basic arithmetic", "Data interpretation"]
                }
            }
        }

        # 3. Create Hierarchical Structure
        for s_title, s_data in curriculum_data.items():
            # Subject
            s_obj = db.query(Subject).filter(Subject.id == s_data["id"]).first()
            if not s_obj:
                s_obj = Subject(id=s_data["id"], title=s_title)
                db.add(s_obj)
                db.flush()
            
            # Topics
            for t_title, st_titles in s_data["topics"].items():
                t_id = slugify(t_title)
                t_obj = db.query(Topic).filter(Topic.id == t_id).first()
                if not t_obj:
                    t_obj = Topic(id=t_id, title=t_title)
                    db.add(t_obj)
                    db.flush()
                
                # Link Topic to Subject
                if t_obj not in s_obj.topics:
                    s_obj.topics.append(t_obj)
                
                # Sub-topics
                for st_title in st_titles:
                    st_id = slugify(st_title)
                    st_obj = db.query(Subtopic).filter(Subtopic.id == st_id).first()
                    if not st_obj:
                        st_obj = Subtopic(id=st_id, title=st_title)
                        db.add(st_obj)
                        db.flush()
                    
                    # Link Sub-topic to Topic
                    if st_obj not in t_obj.subtopics:
                        t_obj.subtopics.append(st_obj)
        
        db.commit()
        print("Global Curriculum Ingestion Complete! 🦁")
        print("------------------------------------")
        print(f"Subjects: {db.query(Subject).count()}")
        print(f"Topics:   {db.query(Topic).count()}")
        print(f"Sub-topics: {db.query(Subtopic).count()}")
        print("All data is now in the Global Lists, unlinked to any Exam.")

    except Exception as e:
        print(f"Error during ingestion: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
