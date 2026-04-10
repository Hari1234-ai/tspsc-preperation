import hashlib
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base, Paper, Subject, Topic, Subtopic, Concept

# Database setup
DATABASE_URL = "sqlite:///cracksarkar.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def generate_id(text: str, parent_id: str = "") -> str:
    """Generates a deterministic 10-character hex ID."""
    hash_object = hashlib.md5(f"{parent_id}:{text}".encode())
    return hash_object.hexdigest()[:10]

SYLLABUS = {
    "Group_II": [
        {
            "title": "Paper I: General Studies & General Abilities",
            "subjects": [
                {
                    "title": "General Studies",
                    "topics": [
                        {"title": "Current Affairs (National & International)", "subtopics": ["Events of national & international importance", "Regional, national, & international current affairs"]},
                        {"title": "General Science & Technology", "subtopics": ["General Science & Applications", "India’s achievements in Science & Technology"]},
                        {"title": "Environment & Disaster Management", "subtopics": ["Disaster Management - Prevention and Mitigation", "Environmental Issues"]},
                        {"title": "Geography", "subtopics": ["Geography of World", "Geography of India", "Geography of Telangana State"]},
                        {"title": "History & Culture", "subtopics": ["India’s History and Cultural Heritage", "Society, Culture, Heritage, Arts/Literature of Telangana"]},
                        {"title": "Policies & Social Issues", "subtopics": ["Telangana State Policies", "Social Exclusion, Rights Issues and Inclusive Policies"]},
                        {"title": "Reasoning & English", "subtopics": ["Logical Reasoning & Analytical Ability", "Data Interpretation", "Basic English"]}
                    ]
                }
            ]
        },
        {
            "title": "Paper II: History, Polity & Society",
            "subjects": [
                {
                    "title": "Socio-Cultural History",
                    "topics": [
                        {"title": "Ancient India", "subtopics": ["Salient features of Indus Valley Civilization", "Early and Later Vedic Civilizations", "Religious Movements in Sixth Century B.C. (Jainism & Buddhism)", "Socio, Cultural Contribution of Mauryas, Guptas, Pallavas, Chalukyas, Cholas", "Harsha and the Rajput Age"]},
                        {"title": "Medieval India", "subtopics": ["Advent of Islam and Delhi Sultanate", "Socio, Cultural Conditions under the Sultanate", "Sufi and Bhakti Movements", "The Mughals: Social, Cultural, Art & Architecture", "Rise of Marathas", "Deccan under Bahamanis and Vijayanagara"]},
                        {"title": "Modern India", "subtopics": ["Advent of Europeans", "Rise and Expansion of British Rule", "Socio-Cultural Policies (Cornwallis, Wellesley, etc.)", "Socio-Religious Reform Movements (19th Century)", "Social Protest Movements (Phule, Gandhi, Ambedkar, etc.)"]},
                        {"title": "Ancient & Medieval Telangana", "subtopics": ["Socio-Cultural conditions in Ancient Telangana", "Satavahanas, Ikshvakus, Vishnukundins", "Kakatiyas, Qutub Shahis", "Emergence of Composite Culture", "Fairs, Festivals, Moharram, Jataras"]},
                        {"title": "Modern Telangana", "subtopics": ["Foundation of Asaf Jahi Dynasty", "Salar Jung Reforms", "Vetti and Bhagela system", "Rise of Socio-Cultural Movements in Telangana", "Tribal and Peasant Revolts (Ramji Gond, Telangana Peasant Struggle)"]}
                    ]
                },
                {
                    "title": "Polity & Constitution",
                    "topics": [
                        {"title": "Indian Constitution", "subtopics": ["Preamble, Development & Features", "Fundamental Rights & Duties", "Directive Principles of State Policy"]},
                        {"title": "Structure of Government", "subtopics": ["Union and State Governments (President, PM, Governor, CM)", "Types of Legislatures", "Judicial Review & Activism"]},
                        {"title": "Federalism & Governance", "subtopics": ["Union-State Relations", "Rural and Urban Governance (73rd & 74th Amendments)"]},
                        {"title": "Elections & Welfare", "subtopics": ["India’s Electoral System & Reforms", "Special Provisions for ST, SC, BC, Minorities", "Welfare Mechanisms (National Commissions)"]}
                    ]
                },
                {
                    "title": "Social Structure & Issues",
                    "topics": [
                        {"title": "Indian Social Structure", "subtopics": ["Caste System, Family, Marriage, Religion", "Middle class in Telangana"]},
                        {"title": "Social Issues", "subtopics": ["Inequality, Casteism, Communalism", "Violence against Women, Child Labour, Human Trafficking"]},
                        {"title": "Social Movements", "subtopics": ["Tribal, Peasant, Dalit, Environmental Movements", "Backward Class & Women’s Movements"]},
                        {"title": "Telangana Social Issues", "subtopics": ["Vetti, Jogini, Devadasi System", "Fluorosis, Migration, Weaver’s Distress"]},
                        {"title": "Welfare Policies", "subtopics": ["Affirmative Policies for SC, ST, OBC", "Employment & Poverty Alleviation Programmes"]}
                    ]
                }
            ]
        },
        {
            "title": "Paper III: Economy & Development",
            "subjects": [
                {
                    "title": "Economy & Development",
                    "topics": [
                        {"title": "Issues in Indian Economy", "subtopics": ["Development & Growth Concepts", "National Income Measures", "Unemployment & Poverty", "Indian Economy Planning & NITI Aayog"]},
                        {"title": "Economy of Telangana", "subtopics": ["Telangana Economy in Undivided AP", "Deprivations in Water, Finances, Employment", "Land Reforms in Telangana", "Agriculture & Allied Sectors", "Industry and Service Sectors in Telangana"]},
                        {"title": "Development Issues", "subtopics": ["Development Dynamics (Inequalities, Urbanisation)", "Development and Displacement", "Economic Reforms (Poverty, Social Security)", "Sustainable Development Goals"]}
                    ]
                }
            ]
        },
        {
            "title": "Paper IV: State Formation & Movement",
            "subjects": [
                {
                    "title": "Telangana Movement",
                    "topics": [
                        {"title": "The Idea of Telangana (1948-1970)", "subtopics": ["Historical and Geographical features", "Mulkis-Non-Mulkis issue & Salar Jung", "Hyderabad Princely State merger (1948)", "1952 Mulki-Agitation", "Formation of Andhra Pradesh (1956)", "Gentlemen’s Agreement & Violations", "1969 Movement for Separate Telangana"]},
                        {"title": "Mobilisational Phase (1971-1990)", "subtopics": ["Court Judgements on Mulki Rules", "Six Point Formula & Article 371-D", "Rise of Naxalite Movement", "Rise of Regional Parties (1980s)", "Suppression of Telangana identity", "Liberalization and Privatisation impacts"]},
                        {"title": "Towards Formation (1991-2014)", "subtopics": ["Quest for Telangana identity (90s)", "Public awakening & Civil society orgs", "Establishment of TRS (2001)", "Role of JACs and Political Parties", "Cultural Revivalism & Protest Forms", "Parliamentary Process & Reorganization Act 2014"]}
                    ]
                }
            ]
        }
    ],
    "Group_III": [
        {
            "title": "Paper I: General Studies",
            "subjects": [
                {
                    "title": "General Studies",
                    "topics": [
                        {"title": "Current Affairs & IR", "subtopics": ["Regional, National & International Affairs", "International Relations and Events"]},
                        {"title": "Science & Environment", "subtopics": ["General Science & Technology", "Environmental Issues & Disaster Management"]},
                        {"title": "History & Geography", "subtopics": ["World, Indian & Telangana Geography", "History and Cultural Heritage of India"]},
                        {"title": "Telangana Society & Policies", "subtopics": ["Society, Culture, Arts of Telangana", "Policies of Telangana State"]},
                        {"title": "Polity & Reasoning", "subtopics": ["Social Exclusion & Inclusive Policies", "Logical Reasoning & Data Interpretation", "Basic English (8th Standard)"]}
                    ]
                }
            ]
        },
        {
            "title": "Paper II: History, Polity, & Society",
            "subjects": [
                {
                    "title": "Socio-Cultural History of Telangana",
                    "topics": [
                        {"title": "Ancient & Medieval Telangana", "subtopics": ["Satavahanas to Chalukyas contribution", "Kakatiya Kingdom & Telugu Literature", "Qutubshahis & Composite Culture"]},
                        {"title": "Modern Telangana & Awakening", "subtopics": ["Asaf Jahi Dynasty & Salarjung Reforms", "Socio-political Awakening (Arya Samaj, Andhra Mahasabha)", "Tribal Revolts & Peasant Armed Struggle"]},
                        {"title": "Formation of Telangana", "subtopics": ["Integration of Hyderabad (1948)", "Mulki Movement 1952-56", "Agitation 1969-2014"]}
                    ]
                },
                {
                    "title": "Indian Constitution & Politics",
                    "topics": [
                        {"title": "Constitutional Framework", "subtopics": ["Evolution & Salient Features", "Fundamental Rights & Duties", "Indian Federalism & Distribution of Powers"]},
                        {"title": "Governance & Elections", "subtopics": ["Union and State Governments", "Rural and Urban Governance", "Electoral System & Political Parties"]},
                        {"title": "Judiciary & Welfare", "subtopics": ["Judicial System & Activism", "Special Provisions for SC, ST, BC", "Welfare Mechanisms & New Challenges"]}
                    ]
                },
                {
                    "title": "Social Structure & Policies",
                    "topics": [
                        {"title": "Society & Issues", "subtopics": ["Features of Indian & Telangana Society", "Social Issues (Casteism, Human Trafficking)", "Social Movements in India"]},
                        {"title": "Telangana Specific Issues", "subtopics": ["Specific practices (Vetti, Jogini, Fluorosis)", "Social Policies and Welfare Programmes"]}
                    ]
                }
            ]
        },
        {
            "title": "Paper III: Economy & Development",
            "subjects": [
                {
                    "title": "Economy of India & Telangana",
                    "topics": [
                        {"title": "Indian Economy Issues", "subtopics": ["Growth and Development concepts", "National Income & Poverty", "Planning & NITI Aayog"]},
                        {"title": "Economy of Telangana", "subtopics": ["Telangana Economy (1956-2014)", "Land Reforms & Agriculture", "Industry and Service Sectors"]},
                        {"title": "Development & Change", "subtopics": ["Development Dynamics & Urbanisation", "Land Acquisition & Displacement", "Economic Reforms & Sustainable Development"]}
                    ]
                }
            ]
        }
    ],
    "Group_IV": [
        {
            "title": "Paper I: General Studies",
            "subjects": [
                {
                    "title": "General Knowledge",
                    "topics": [
                        {"title": "Current & Science", "subtopics": ["Current Affairs & IR", "General Science in everyday life", "Environmental Issues & Disaster Management"]},
                        {"title": "History & Geography", "subtopics": ["Geography of India and Telangana", "Modern Indian History (National Movement)", "History of Telangana and Movement"]},
                        {"title": "Polity & Society", "subtopics": ["Indian Constitution & Political System", "Society, Culture, Heritage of Telangana", "Policies of Telangana State"]}
                    ]
                }
            ]
        },
        {
            "title": "Paper II: Secretarial Abilities",
            "subjects": [
                {
                    "title": "Aptitude & Reasoning",
                    "topics": [
                        {"title": "Mental & Logical", "subtopics": ["Mental Ability (Verbal/Non-verbal)", "Logical Reasoning"]},
                        {"title": "Language & Numerical", "subtopics": ["Comprehension & Sentence Rearrangement", "Numerical and Arithmetical abilities"]}
                    ]
                }
            ]
        }
    ]
}

def seed():
    db = SessionLocal()
    try:
        print("--- Starting Advanced Syllabus Seeding ---")
        
        for exam_id, papers in SYLLABUS.items():
            print(f"\n[EXAM] Processing {exam_id}...")
            
            for p_idx, p_data in enumerate(papers):
                # 1. PAPER
                p_title = p_data["title"]
                # Use a stable ID for Papers if possible, or deterministic
                p_id = f"{exam_id}_p{p_idx}"
                
                paper = db.query(Paper).filter(Paper.id == p_id).first()
                if not paper:
                    paper = Paper(id=p_id, exam_id=exam_id, title=p_title)
                    db.add(paper)
                    print(f"  [NEW PAPER] {p_title}")
                else:
                    paper.title = p_title # Update title just in case
                
                db.flush()
                
                for s_data in p_data["subjects"]:
                    # 2. SUBJECT
                    s_title = s_data["title"]
                    s_id = generate_id(s_title, p_id)
                    
                    subject = db.query(Subject).filter(Subject.id == s_id).first()
                    if not subject:
                        # Fallback: Check by title under this paper to avoid ID collisions on subtle title changes
                        subject = db.query(Subject).filter(Subject.title == s_title, Subject.paper_id == p_id).first()
                        if not subject:
                            subject = Subject(id=s_id, title=s_title, paper_id=p_id)
                            db.add(subject)
                            print(f"    [NEW SUBJECT] {s_title}")
                    
                    db.flush()
                    
                    for t_data in s_data["topics"]:
                        # 3. TOPIC
                        t_title = t_data["title"]
                        t_id = generate_id(t_title, subject.id)
                        
                        topic = db.query(Topic).filter(Topic.id == t_id).first()
                        if not topic:
                            topic = db.query(Topic).filter(Topic.title == t_title, Topic.subject_id == subject.id).first()
                            if not topic:
                                topic = Topic(id=t_id, title=t_title, weightage="Medium", subject_id=subject.id)
                                db.add(topic)
                                print(f"      [NEW TOPIC] {t_title}")
                        
                        db.flush()
                        
                        for st_title in t_data["subtopics"]:
                            # 4. SUBTOPIC
                            st_id = generate_id(st_title, topic.id)
                            
                            subtopic = db.query(Subtopic).filter(Subtopic.id == st_id).first()
                            if not subtopic:
                                subtopic = db.query(Subtopic).filter(Subtopic.title == st_title, Subtopic.topic_id == topic.id).first()
                                if not subtopic:
                                    subtopic = Subtopic(id=st_id, title=st_title, topic_id=topic.id)
                                    db.add(subtopic)
                                    # print(f"        [NEW SUBTOPIC] {st_title}")
        
        db.commit()
        print("\n--- Seeding Completed Successfully ---")
        
    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
