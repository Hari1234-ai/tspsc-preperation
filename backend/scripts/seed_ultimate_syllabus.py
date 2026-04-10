import hashlib
import sqlite3
import uuid
import os

DB_PATH = "cracksarkar.db"

def generate_id(text: str, parent_id: str = "") -> str:
    """Generates a deterministic 10-character hex ID."""
    hash_object = hashlib.md5(f"{parent_id}:{text}".encode())
    return hash_object.hexdigest()[:10]

SYLLABUS_DATA = {
    "PAPER I – GENERAL STUDIES & GENERAL ABILITIES": {
        "Topics": [
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
    },
    "PAPER II – HISTORY, POLITY & SOCIETY": {
        "A. HISTORY": {
            "1. Ancient India": [
                "Indus Valley Civilization – Features, Society & Culture",
                "Vedic Civilization (Early & Later)",
                "Jainism & Buddhism (6th Century B.C.)",
                "Mauryas, Guptas, Pallavas, Chalukyas, Cholas – Contributions",
                "Harsha & Rajput Age"
            ],
            "2. Medieval India": [
                "Delhi Sultanate – Establishment & Society",
                "Sufi & Bhakti Movements",
                "Mughal Empire – Culture, Art & Architecture",
                "Marathas – Cultural Contributions",
                "Deccan: Bahamani & Vijayanagara Kingdoms"
            ],
            "3. Modern India": [
                "Advent of Europeans",
                "British Rule – Expansion",
                "Socio-Cultural Policies (Cornwallis, Wellesley, Bentinck, Dalhousie)",
                "Socio-Religious Reform Movements",
                "Social Reformers: Phule, Gandhi, Ambedkar, Periyar, etc."
            ],
            "4. Telangana History": [
                "Ancient Telangana – Satavahanas, Ikshvakus, Vishnukundins",
                "Medieval Telangana – Kakatiyas, Qutub Shahis",
                "Culture, Literature, Festivals & Traditions"
            ],
            "5. Modern Telangana": [
                "Asaf Jahi Dynasty & Salar Jung Reforms",
                "Social Systems (Vetti, Bhagela)",
                "Movements: Arya Samaj, Andhra Maha Sabha",
                "Tribal & Peasant Revolts",
                "Telangana Armed Struggle & Police Action"
            ]
        },
        "B. INDIAN CONSTITUTION & POLITICS": {
            "Core Constitution": [
                "Constitution: Preamble, Features, Rights & Duties",
                "Directive Principles & Emerging Challenges"
            ],
            "Government & Structure": [
                "Structure of Government (Union & State)",
                "Legislature, Executive & Judiciary",
                "Federalism & Power Distribution"
            ],
            "Governance & Reforms": [
                "Rural & Urban Governance (73rd & 74th Amendments)",
                "Electoral System & Reforms",
                "Judicial Review & Activism",
                "Welfare Mechanisms & Commissions (SC/ST/BC)"
            ]
        },
        "C. SOCIAL STRUCTURE & ISSUES": {
            "Social Structure": [
                "Caste, Family, Marriage, Religion, Tribe",
                "Women in Indian Society",
                "Telangana Society"
            ],
            "Social Issues": [
                "Inequality, Casteism, Communalism",
                "Child Labour, Human Trafficking",
                "Violence Against Women",
                "Disability & Aged Issues"
            ],
            "Social Movements": [
                "Tribal, Peasant, Dalit, Women, Environmental Movements"
            ],
            "Telangana-Specific Issues": [
                "Vetti, Jogini, Devadasi System",
                "Migration, Child Labour",
                "Farmer & Weaver Distress"
            ],
            "Welfare Policies": [
                "SC, ST, BC, Women, Minorities",
                "Poverty Alleviation & Employment Programs",
                "Child & Tribal Welfare"
            ]
        }
    },
    "PAPER III – ECONOMY & DEVELOPMENT": {
        "A. INDIAN ECONOMY": {
            "Growth & National Income": [
                "Growth vs Development",
                "National Income Concepts & Measurement"
            ],
            "Poverty & Employment": [
                "Poverty & Unemployment",
                "Planning & NITI Aayog",
                "Inclusive Growth"
            ]
        },
        "B. TELANGANA ECONOMY": {
            "Economic History": [
                "Telangana under Andhra Pradesh (1956–2014)",
                "Issues: Water, Finance, Employment",
                "Land Reforms (Zamindari, Tenancy, Land Ceiling)"
            ],
            "Agriculture": [
                "GSDP Contribution",
                "Irrigation Sources",
                "Dryland Agriculture Issues",
                "Agricultural Credit"
            ],
            "Industry & Services": [
                "Industrial Growth & MSMEs",
                "Infrastructure & Policies",
                "Service Sector Growth"
            ]
        },
        "C. DEVELOPMENT ISSUES": {
            "Social Issues": [
                "Regional & Social Inequalities",
                "Migration & Urbanization"
            ],
            "Reforms & Sustainability": [
                "Land Acquisition & Rehabilitation",
                "Economic Reforms & Social Impact",
                "Sustainable Development & SDGs"
            ]
        }
    },
    "PAPER IV – TELANGANA MOVEMENT & STATE FORMATION": {
        "A. IDEA OF TELANGANA": {
            "History & Features": [
                "Historical Background",
                "Cultural & Social Features",
                "Hyderabad State & Nizam Rule",
                "Mulki Rules & Employment Issues",
                "Hyderabad Integration (1948)"
            ],
            "Formation of AP": [
                "Mulki Agitation (1952)",
                "SRC & State Reorganization",
                "Formation of Andhra Pradesh (1956)",
                "Gentlemen’s Agreement & Violations"
            ]
        },
        "B. TELANGANA AGITATION (1969 onwards)": {
            "Agitation Phase": [
                "Causes & Events",
                "Role of Students, Employees & Intellectuals",
                "Telangana Praja Samithi",
                "Government Responses (GO 36, 5-Point, 8-Point Formula)"
            ]
        },
        "C. MOBILISATION PHASE (1971–1990)": {
            "Legal & Social": [
                "Mulki Rule Judgements",
                "Six-Point Formula & Article 371-D",
                "GO 610 & Employee Movements",
                "Rise of Naxalite Movement",
                "Agrarian Crisis & Social Changes"
            ]
        },
        "D. MODERN TELANGANA MOVEMENT": {
            "Identities & Parties": [
                "Telangana Identity & Cultural Revival",
                "Formation of TRS",
                "Political Alliances & Committees",
                "Role of Political Parties & Civil Society"
            ],
            "Major Protests": [
                "Sakalajanula Samme",
                "Million March"
            ]
        },
        "E. STATE FORMATION (2014)": {
            "Political & Legal Process": [
                "Parliamentary Process",
                "Sri Krishna Committee",
                "Andhra Pradesh Reorganization Act",
                "Formation of Telangana State",
                "2014 Elections & TRS Victory"
            ]
        }
    }
}

def seed():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("--- Starting Ultimate Syllabus Seeding ---")

    # Clear old data (optional but helps cleanliness)
    # cursor.execute("DELETE FROM subtopics")
    # cursor.execute("DELETE FROM topics")
    # cursor.execute("DELETE FROM subjects")
    # cursor.execute("DELETE FROM papers")

    exam_id = "Group_II"

    for p_idx, (p_title, p_data) in enumerate(SYLLABUS_DATA.items()):
        p_id = f"{exam_id}_paper{p_idx + 1}"
        print(f"[PAPER] {p_title}")
        cursor.execute("INSERT OR REPLACE INTO papers (id, exam_id, title) VALUES (?, ?, ?)", 
                     (p_id, exam_id, p_title))

        for s_title, s_data in p_data.items():
            s_id = generate_id(s_title, p_id)
            print(f"  [SUBJECT] {s_title}")
            cursor.execute("INSERT OR REPLACE INTO subjects (id, title, paper_id) VALUES (?, ?, ?)", 
                         (s_id, s_title, p_id))

            if isinstance(s_data, list):
                # Flat topics directly under subject
                for t_title in s_data:
                    t_id = generate_id(t_title, s_id)
                    cursor.execute("INSERT OR REPLACE INTO topics (id, title, weightage, subject_id) VALUES (?, ?, ?, ?)", 
                                 (t_id, t_title, "High", s_id))
                    # Link existing concepts if they match title
                    if "Indus Valley" in t_title:
                        cursor.execute("UPDATE concepts SET topic_id = ? WHERE title LIKE '%Indus Valley%'", (t_id,))
            elif isinstance(s_data, dict):
                # Deeper structure: Topics -> Subtopics
                for t_title, subtopics in s_data.items():
                    t_id = generate_id(t_title, s_id)
                    print(f"    [TOPIC] {t_title}")
                    cursor.execute("INSERT OR REPLACE INTO topics (id, title, weightage, subject_id) VALUES (?, ?, ?, ?)", 
                                 (t_id, t_title, "High", s_id))
                    
                    for st_title in subtopics:
                        st_id = generate_id(st_title, t_id)
                        cursor.execute("INSERT OR REPLACE INTO subtopics (id, title, topic_id) VALUES (?, ?, ?)", 
                                     (st_id, st_title, t_id))
                        
                        # Migration check for Indus Valley
                        if "Indus Valley" in st_title:
                            cursor.execute("UPDATE concepts SET subtopic_id = ? WHERE title LIKE '%Indus Valley%'", (st_id,))

    conn.commit()
    conn.close()
    print("--- Seeding Completed Successfully ---")

if __name__ == "__main__":
    seed()
