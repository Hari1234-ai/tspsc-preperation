import sqlite3
import json
import os

DB_PATH = "cracksarkar.db"

SYLLABUS_JSON = {
  "version": "1.0",
  "language_support": ["en", "te"],
  "nodes": [
    {"id": "P1", "type": "paper", "title": "Paper I - General Studies & General Abilities", "slug": "paper-1-general-studies", "parent_id": None, "order": 1, "description": ""},
    {"id":"P1-T1","type":"topic","title":"National & International Important Events","slug":"national-international-events","parent_id":"P1","order":1,"description":""},
    {"id":"P1-T2","type":"topic","title":"Current Affairs","slug":"current-affairs","parent_id":"P1","order":2,"description":""},
    {"id":"P1-T3","type":"topic","title":"General Science & Applications","slug":"general-science","parent_id":"P1","order":3,"description":""},
    {"id":"P1-T4","type":"topic","title":"India’s Achievements in Science & Technology","slug":"india-science-technology","parent_id":"P1","order":4,"description":""},
    {"id":"P1-T5","type":"topic","title":"Disaster Management","slug":"disaster-management","parent_id":"P1","order":5,"description":""},
    {"id":"P1-T6","type":"topic","title":"Environmental Issues","slug":"environmental-issues","parent_id":"P1","order":6,"description":""},
    {"id":"P1-T7","type":"topic","title":"Geography (World, India, Telangana)","slug":"geography","parent_id":"P1","order":7,"description":""},
    {"id":"P1-T8","type":"topic","title":"Indian History & Cultural Heritage","slug":"indian-history","parent_id":"P1","order":8,"description":""},
    {"id":"P1-T9","type":"topic","title":"Telangana Society, Culture, Arts & Literature","slug":"telangana-society","parent_id":"P1","order":9,"description":""},
    {"id":"P1-T10","type":"topic","title":"Telangana State Policies","slug":"telangana-policies","parent_id":"P1","order":10,"description":""},
    {"id":"P1-T11","type":"topic","title":"Social Exclusion, Rights Issues & Inclusive Policies","slug":"social-exclusion","parent_id":"P1","order":11,"description":""},
    {"id":"P1-T12","type":"topic","title":"Logical Reasoning, Analytical Ability & Data Interpretation","slug":"logical-reasoning","parent_id":"P1","order":12,"description":""},
    {"id":"P1-T13","type":"topic","title":"Basic English","slug":"basic-english","parent_id":"P1","order":13,"description":""},

    {"id": "P2", "type": "paper", "title": "Paper II - History, Polity & Society", "slug": "paper-2-history-polity-society", "parent_id": None, "order": 2, "description": ""},
    {"id":"P2-S1","type":"section","title":"History","slug":"history","parent_id":"P2","order":1,"description":""},
    {"id":"P2-S1-SS1","type":"subsection","title":"Ancient India","slug":"ancient-india","parent_id":"P2-S1","order":1,"description":""},
    {"id":"P2-S1-SS1-T1","type":"topic","title":"Indus Valley Civilization – Features, Society & Culture","slug":"indus-valley","parent_id":"P2-S1-SS1","order":1,"description":""},
    {"id":"P2-S1-SS1-T2","type":"topic","title":"Vedic Civilization (Early & Later)","slug":"vedic-civilization","parent_id":"P2-S1-SS1","order":2,"description":""},
    {"id":"P2-S1-SS1-T3","type":"topic","title":"Jainism & Buddhism","slug":"jainism-buddhism","parent_id":"P2-S1-SS1","order":3,"description":""},
    {"id":"P2-S1-SS1-T4","type":"topic","title":"Mauryas, Guptas, Pallavas, Chalukyas, Cholas","slug":"dynasties","parent_id":"P2-S1-SS1","order":4,"description":""},
    {"id":"P2-S1-SS1-T5","type":"topic","title":"Harsha & Rajput Age","slug":"harsha-rajput","parent_id":"P2-S1-SS1","order":5,"description":""},

    {"id":"P2-S1-SS2","type":"subsection","title":"Medieval India","slug":"medieval-india","parent_id":"P2-S1","order":2,"description":""},
    {"id":"P2-S1-SS2-T1","type":"topic","title":"Delhi Sultanate","slug":"delhi-sultanate","parent_id":"P2-S1-SS2","order":1,"description":""},
    {"id":"P2-S1-SS2-T2","type":"topic","title":"Sufi & Bhakti Movements","slug":"sufi-bhakti","parent_id":"P2-S1-SS2","order":2,"description":""},
    {"id":"P2-S1-SS2-T3","type":"topic","title":"Mughal Empire","slug":"mughal-empire","parent_id":"P2-S1-SS2","order":3,"description":""},
    {"id":"P2-S1-SS2-T4","type":"topic","title":"Marathas","slug":"marathas","parent_id":"P2-S1-SS2","order":4,"description":""},
    {"id":"P2-S1-SS2-T5","type":"topic","title":"Bahamani & Vijayanagara","slug":"deccan-kingdoms","parent_id":"P2-S1-SS2","order":5,"description":""},

    {"id":"P2-S1-SS3","type":"subsection","title":"Modern India","slug":"modern-india","parent_id":"P2-S1","order":3,"description":""},
    {"id":"P2-S1-SS3-T1","type":"topic","title":"Advent of Europeans","slug":"europeans","parent_id":"P2-S1-SS3","order":1,"description":""},
    {"id":"P2-S1-SS3-T2","type":"topic","title":"British Rule Expansion","slug":"british-rule","parent_id":"P2-S1-SS3","order":2,"description":""},
    {"id":"P2-S1-SS3-T3","type":"topic","title":"Socio-Cultural Policies","slug":"policies","parent_id":"P2-S1-SS3","order":3,"description":""},
    {"id":"P2-S1-SS3-T4","type":"topic","title":"Reform Movements","slug":"reforms","parent_id":"P2-S1-SS3","order":4,"description":""},
    {"id":"P2-S1-SS3-T5","type":"topic","title":"Social Reformers","slug":"reformers","parent_id":"P2-S1-SS3","order":5,"description":""},

    {"id":"P2-S2","type":"section","title":"Indian Constitution & Politics","slug":"polity","parent_id":"P2","order":2,"description":""},
    {"id":"P2-S2-T1","type":"topic","title":"Preamble, Rights & Duties","slug":"rights-duties","parent_id":"P2-S2","order":1,"description":""},
    {"id":"P2-S2-T2","type":"topic","title":"Federalism","slug":"federalism","parent_id":"P2-S2","order":2,"description":""},
    {"id":"P2-S2-T3","type":"topic","title":"Governance & Institutions","slug":"governance","parent_id":"P2-S2","order":3,"description":""},

    {"id":"P2-S3","type":"section","title":"Social Structure & Issues","slug":"society","parent_id":"P2","order":3,"description":""},
    {"id":"P2-S3-T1","type":"topic","title":"Social Structure","slug":"social-structure","parent_id":"P2-S3","order":1,"description":""},
    {"id":"P2-S3-T2","type":"topic","title":"Social Issues","slug":"social-issues","parent_id":"P2-S3","order":2,"description":""},
    {"id":"P2-S3-T3","type":"topic","title":"Social Movements","slug":"social-movements","parent_id":"P2-S3","order":3,"description":""},
    {"id":"P2-S3-T4","type":"topic","title":"Telangana Issues","slug":"telangana-issues","parent_id":"P2-S3","order":4,"description":""},
    {"id":"P2-S3-T5","type":"topic","title":"Welfare Policies","slug":"welfare","parent_id":"P2-S3","order":5,"description":""},

    {"id": "P3", "type": "paper", "title": "Paper III - Economy & Development", "slug": "paper-3-economy", "parent_id": None, "order": 3, "description": ""},
    {"id":"P3-S1","type":"section","title":"Indian Economy","slug":"indian-economy","parent_id":"P3","order":1,"description":""},
    {"id":"P3-S1-T1","type":"topic","title":"Growth vs Development","slug":"growth-development","parent_id":"P3-S1","order":1,"description":""},
    {"id":"P3-S1-T2","type":"topic","title":"National Income","slug":"national-income","parent_id":"P3-S1","order":2,"description":""},
    {"id":"P3-S1-T3","type":"topic","title":"Poverty & Unemployment","slug":"poverty","parent_id":"P3-S1","order":3,"description":""},
    {"id":"P3-S1-T4","type":"topic","title":"Planning & NITI Aayog","slug":"planning","parent_id":"P3-S1","order":4,"description":""},

    {"id":"P3-S2","type":"section","title":"Telangana Economy","slug":"telangana-economy","parent_id":"P3","order":2,"description":""},
    {"id":"P3-S2-T1","type":"topic","title":"Telangana Overview","slug":"telangana-overview","parent_id":"P3-S2","order":1,"description":""},
    {"id":"P3-S2-T2","type":"topic","title":"Agriculture","slug":"agriculture","parent_id":"P3-S2","order":2,"description":""},
    {"id":"P3-S2-T3","type":"topic","title":"Industry & Services","slug":"industry","parent_id":"P3-S2","order":3,"description":""},

    {"id":"P3-S3","type":"section","title":"Development Issues","slug":"development","parent_id":"P3","order":3,"description":""},
    {"id":"P3-S3-T1","type":"topic","title":"Inequalities","slug":"inequalities","parent_id":"P3-S3","order":1,"description":""},
    {"id":"P3-S3-T2","type":"topic","title":"Migration & Urbanization","slug":"migration","parent_id":"P3-S3","order":2,"description":""},
    {"id":"P3-S3-T3","type":"topic","title":"Economic Reforms","slug":"economic-reforms","parent_id":"P3-S3","order":3,"description":""},
    {"id":"P3-S3-T4","type":"topic","title":"Sustainable Development","slug":"sustainable","parent_id":"P3-S3","order":4,"description":""},

    {"id": "P4", "type": "paper", "title": "Paper IV - Telangana Movement & State Formation", "slug": "paper-4-telangana", "parent_id": None, "order": 4, "description": ""},
    {"id":"P4-S1","type":"section","title":"Idea of Telangana","slug":"idea","parent_id":"P4","order":1,"description":""},
    {"id":"P4-S1-T1","type":"topic","title":"Historical Background","slug":"history","parent_id":"P4-S1","order":1,"description":""},
    {"id":"P4-S1-T2","type":"topic","title":"Mulki Rules","slug":"mulki","parent_id":"P4-S1","order":2,"description":""},
    {"id":"P4-S2","type":"section","title":"Agitation","slug":"agitation","parent_id":"P4","order":2,"description":""},
    {"id":"P4-S2-T1","type":"topic","title":"1969 Movement","slug":"1969","parent_id":"P4-S2","order":1,"description":""},
    {"id":"P4-S3","type":"section","title":"Modern Movement","slug":"modern","parent_id":"P4","order":3,"description":""},
    {"id":"P4-S3-T1","type":"topic","title":"Formation of TRS","slug":"trs","parent_id":"P4-S3","order":1,"description":""},
    {"id":"P4-S4","type":"section","title":"State Formation","slug":"state-formation","parent_id":"P4","order":4,"description":""},
    {"id":"P4-S4-T1","type":"topic","title":"2014 Formation","slug":"2014","parent_id":"P4-S4","order":1,"description":""}
  ]
}

def seed():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("--- Starting JSON Syllabus Ingestion ---")

    # Wipe tables
    cursor.execute("DELETE FROM subtopics")
    cursor.execute("DELETE FROM topics")
    cursor.execute("DELETE FROM subjects")
    cursor.execute("DELETE FROM papers")
    # Reset concepts linkage to IDs that are about to change
    cursor.execute("UPDATE concepts SET subtopic_id = NULL, topic_id = NULL")

    nodes = SYLLABUS_JSON["nodes"]

    # First pass: Papers
    for node in [n for n in nodes if n["type"] == "paper"]:
        print(f"[PAPER] {node['title']}")
        cursor.execute("INSERT INTO papers (id, exam_id, title, order_index) VALUES (?, ?, ?, ?)", 
                     (node["id"], "Group_II", node["title"], node.get("order", 0)))

    # Second pass: Sections (Subjects)
    for node in [n for n in nodes if n["type"] == "section"]:
        print(f"  [SUBJECT] {node['title']}")
        cursor.execute("INSERT INTO subjects (id, title, paper_id, order_index) VALUES (?, ?, ?, ?)", 
                     (node["id"], node["title"], node["parent_id"], node.get("order", 0)))

    # Special Case: Paper I Topics (link directly to sub-subject)
    cursor.execute("INSERT INTO subjects (id, title, paper_id, order_index) VALUES (?, ?, ?, ?)", 
                 ("P1-GS", "General Studies", "P1", 1))

    # Third pass: Subsections / Topics under sections
    for node in nodes:
        if node["type"] == "subsection":
            print(f"    [TOPIC] {node['title']}")
            cursor.execute("INSERT INTO topics (id, title, weightage, subject_id, order_index) VALUES (?, ?, ?, ?, ?)", 
                         (node["id"], node["title"], "High", node["parent_id"], node.get("order", 0)))
        elif node["type"] == "topic" and node["parent_id"] in ["P2-S2", "P2-S3", "P3-S1", "P3-S2", "P3-S3", "P4-S1", "P4-S2", "P4-S3", "P4-S4"]:
            print(f"    [TOPIC] {node['title']}")
            cursor.execute("INSERT INTO topics (id, title, weightage, subject_id, order_index) VALUES (?, ?, ?, ?, ?)", 
                         (node["id"], node["title"], "High", node["parent_id"], node.get("order", 0)))
        elif node["type"] == "topic" and node["parent_id"] == "P1":
            print(f"    [TOPIC (P1)] {node['title']}")
            cursor.execute("INSERT INTO topics (id, title, weightage, subject_id, order_index) VALUES (?, ?, ?, ?, ?)", 
                         (node["id"], node["title"], "High", "P1-GS", node.get("order", 0)))

    # Fourth pass: Subtopics under subsections
    for node in nodes:
        if node["type"] == "topic" and node["parent_id"].startswith("P2-S1-SS"):
            print(f"      [SUBTOPIC] {node['title']}")
            cursor.execute("INSERT INTO subtopics (id, title, topic_id, order_index) VALUES (?, ?, ?, ?)", 
                         (node["id"], node["title"], node["parent_id"], node.get("order", 0)))
            
            # Re-link Indus Valley
            if node["id"] == "P2-S1-SS1-T1":
                cursor.execute("UPDATE concepts SET subtopic_id = ? WHERE title LIKE '%Indus Valley%'", (node["id"],))

    conn.commit()
    conn.close()
    print("--- JSON Ingestion Completed ---")

if __name__ == "__main__":
    seed()
