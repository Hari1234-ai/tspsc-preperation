import os
import sys

# Add current directory to path
sys.path.append(os.getcwd())

from sqlalchemy.orm import Session
from sqlalchemy import delete
from app.db.session import SessionLocal
from app.db.base import Paper, Subject, Topic, Subtopic, paper_subject_association, subject_topic_association, topic_subtopic_association

def slugify(text):
    return text.lower().replace(" & ", "_").replace(" ", "_").replace("-", "_").replace("&", "_").replace("(", "").replace(")", "").replace("__", "_").replace("/", "_").strip("_")

def seed():
    db = SessionLocal()
    try:
        print("Starting Deep Curriculum Hierarchical Linking... ⛓️🚀")
        
        # 1. Subject to Exams Mapping
        exam_subject_map = {
            "Group_I": ["gs_ga", "history", "polity", "society", "indian_economy", "telangana_economy", "development_issues", "telangana_movement"],
            "Group_III": ["gs_ga", "history", "polity", "society", "indian_economy"],
            "Group_IV": ["gs_ga", "telangana_movement", "secretarial_abilities"]
        }

        # 2. Topic to Subjects Mapping
        subject_topic_map = {
            "gs_ga": ["Current Affairs & Events", "Science & Technology", "Environment & Disaster Management", "Geography", "History & Culture", "Telangana Specific", "Society & Social Issues", "Aptitude & Skills", "Language"],
            "history": ["Ancient India", "Medieval India", "Modern India", "Telangana History", "Modern Telangana"],
            "polity": ["Indian Constitution", "Governance", "Federal System", "Local Governance", "Elections & Judiciary", "Welfare & Rights"],
            "society": ["Social Structure", "Social Issues", "Social Movements", "Telangana Social Issues", "Welfare Policies"],
            "indian_economy": ["Growth & Development", "National Income", "Poverty & Unemployment", "Economic Planning"],
            "telangana_economy": ["Historical Economy", "Land Reforms", "Agriculture", "Industry & Services"],
            "development_issues": ["Inequality & Migration", "Displacement", "Economic Reforms", "Sustainable Development"],
            "telangana_movement": ["Background", "Pre-Formation Issues", "Formation of Andhra Pradesh", "Telangana Agitation", "Mobilisation Phase", "Final Formation"],
            "secretarial_abilities": ["Mental Ability", "Logical Reasoning", "Comprehension", "Sentence Arrangement", "Numerical Ability"]
        }

        # 3. Sub-topics to Topics Mapping
        topic_subtopic_map = {
            "Current Affairs & Events": ["Current affairs (regional, national, international)", "Events of national & international importance", "International relations and events"],
            "Science & Technology": ["General Science", "Applications of Science", "India’s achievements in Science & Technology"],
            "Environment & Disaster Management": ["Environmental issues", "Disaster management (prevention & mitigation)"],
            "Geography": ["World Geography", "Indian Geography", "Telangana Geography"],
            "History & Culture": ["Indian History", "Cultural Heritage of India", "Telangana culture, arts, literature"],
            "Telangana Specific": ["Telangana State policies"],
            "Society & Social Issues": ["Social exclusion", "Rights issues", "Inclusive policies"],
            "Aptitude & Skills": ["Logical reasoning", "Analytical ability", "Data interpretation"],
            "Language": ["Basic English"],
            "Ancient India": ["Indus Valley Civilization", "Vedic Civilization (Early & Later)", "Jainism & Buddhism", "Mauryas, Guptas, Cholas, etc.", "Harsha & Rajput Age"],
            "Medieval India": ["Delhi Sultanate", "Sufi & Bhakti Movements", "Mughal Empire", "Marathas", "Deccan Kingdoms"],
            "Modern India": ["Advent of Europeans", "Rise & Expansion of British Rule", "Socio-cultural reforms", "Reform movements (Phule, Ambedkar, Gandhi, etc.)"],
            "Telangana History": ["Ancient Telangana dynasties", "Medieval Telangana (Kakatiyas, Qutub Shahis)", "Socio-cultural developments", "Festivals & traditions"],
            "Modern Telangana": ["Asaf Jahi dynasty", "Social systems (Vetti, Zamidars)", "Tribal & peasant movements"],
            "Indian Constitution": ["Preamble", "Fundamental Rights & Duties", "Directive Principles"],
            "Governance": ["Union & State Government", "President, PM, Governor, CM", "Legislature"],
            "Federal System": ["Centre-State relations", "Administrative powers"],
            "Local Governance": ["Panchayati Raj (73rd Amendment)", "Urban governance (74th Amendment)"],
            "Elections & Judiciary": ["Electoral system", "Election Commission", "Judicial system & activism"],
            "Welfare & Rights": ["SC/ST/BC provisions", "National Commissions"],
            "Social Structure": ["Caste system", "Family & marriage", "Religion & kinship", "Women in society"],
            "Social Issues": ["Casteism", "Communalism", "Gender issues", "Child labour", "Human trafficking"],
            "Social Movements": ["Tribal movements", "Dalit movements", "Women’s movements", "Environmental movements"],
            "Telangana Social Issues": ["Vetti system", "Jogini system", "Migration", "Farmer distress"],
            "Welfare Policies": ["Government welfare schemes", "Poverty alleviation", "Social security"],
            "Growth & Development": ["Concepts of growth & development"],
            "National Income": ["Measurement methods", "Nominal vs Real income"],
            "Poverty & Unemployment": ["Types", "Measurement"],
            "Economic Planning": ["Five Year Plans", "NITI Aayog", "Inclusive growth"],
            "Historical Economy": ["Telangana in Andhra Pradesh (1956–2014)"],
            "Land Reforms": ["Zamindari abolition", "Land ceiling"],
            "Agriculture": ["Irrigation", "Dryland farming", "Credit"],
            "Industry & Services": ["MSMEs", "Industrial policy", "Service sector"],
            "Inequality & Migration": ["Regional inequality", "Social inequality", "Migration"],
            "Displacement": ["Land acquisition", "Rehabilitation"],
            "Economic Reforms": ["Poverty & inequality", "Social development"],
            "Sustainable Development": ["SDGs", "Measurement"],
            "Background": ["Historical background", "Cultural & social features", "Hyderabad State"],
            "Pre-Formation Issues": ["Mulki rules", "Employment issues", "SRC debates"],
            "Formation of Andhra Pradesh": ["Gentlemen’s Agreement", "Regional imbalance"],
            "Telangana Agitation": ["1969 movement", "Role of students & leaders"],
            "Mobilisation Phase": ["Political movements", "TRS formation", "Committees"],
            "Final Formation": ["Parliamentary process", "Telangana state formation (2014)"],
            "Mental Ability": ["Verbal reasoning", "Non-verbal reasoning"]
        }

        # --- EXECUTION ---

        # 1. Subject to Exams
        for exam_id, subject_ids in exam_subject_map.items():
            exam = db.query(Paper).filter(Paper.id == exam_id).first()
            if not exam: continue
            exam.subjects = [] # Fresh link
            db.flush()
            for s_id in subject_ids:
                subject = db.query(Subject).filter(Subject.id == s_id).first()
                if subject:
                    exam.subjects.append(subject)

        # 2. Topic to Subjects
        for s_id, t_titles in subject_topic_map.items():
            subject = db.query(Subject).filter(Subject.id == s_id).first()
            if not subject: continue
            subject.topics = []
            db.flush()
            for t_title in t_titles:
                t_id = slugify(t_title)
                topic = db.query(Topic).filter(Topic.id == t_id).first()
                if not topic:
                    topic = Topic(id=t_id, title=t_title)
                    db.add(topic)
                    db.flush()
                subject.topics.append(topic)

        # 3. Sub-topics to Topics
        for t_title, st_titles in topic_subtopic_map.items():
            t_id = slugify(t_title)
            topic = db.query(Topic).filter(Topic.id == t_id).first()
            if not topic: continue
            topic.subtopics = []
            db.flush()
            for st_title in st_titles:
                st_id = slugify(st_title)
                st_obj = db.query(Subtopic).filter(Subtopic.id == st_id).first()
                if not st_obj:
                    st_obj = Subtopic(id=st_id, title=st_title)
                    db.add(st_obj)
                    db.flush()
                topic.subtopics.append(st_obj)

        db.commit()
        print("Final Deep Hierarchical Linking Complete! 🚀 Everything is perfectly bridged.")

    except Exception as e:
        print(f"Error during final linking: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
