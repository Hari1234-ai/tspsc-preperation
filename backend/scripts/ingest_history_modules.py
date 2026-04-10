import os
import sqlite3
import uuid

# Database path
DB_PATH = "cracksarkar.db"

# Modules to ingest
modules = [
    {
        "subtopic_id": "529a42214e",
        "title": "INDUS VALLEY CIVILIZATION",
        "content_en": """# 🏺 MODULE 1: INDUS VALLEY CIVILIZATION

![Image](https://www.harappa.com/sites/default/files/styles/galleryformatter_slide/public/mohenjodaro-drains-5.jpg)

![Image](https://www.harappa.com/sites/default/files/slides/granary-harappa.jpg)

![Image](https://www.harappa.com/sites/default/files/styles/gallery_wide_slide/public/slides/unicorn-seal_0.jpg)

![Image](https://www.harappa.com/sites/default/files/styles/galleryformatter_slide/public/seal-bw-h10A.jpg)

### 🧠 Introduction

The Indus Valley Civilization (IVC), also known as the Harappan Civilization, flourished around **2500 BCE to 1900 BCE** in the north-western regions of the Indian subcontinent. It is one of the **earliest urban civilizations** in the world, alongside Mesopotamia and Egypt.

Major sites include:
* Harappa (Pakistan)
* Mohenjo-daro (Pakistan)
* Lothal (Gujarat)
* Dholavira (Gujarat)

---

### 🏙 Urban Planning and Architecture

One of the most remarkable features of the IVC was its **advanced urban planning**.

* Cities were built in a **grid pattern**, with streets intersecting at right angles
* Houses were constructed using **standardized baked bricks**
* Cities were divided into:
  * **Citadel** (administrative/religious area)
  * **Lower town** (residential area)

A unique feature was the **drainage system**:
* Covered underground drains
* Connected to individual houses
* Regular cleaning arrangements

This reflects a **high level of civic sense and engineering knowledge**.

---

### 🌾 Economy

The economy was **well-developed and diversified**:
* **Agriculture**: Wheat, barley, cotton were cultivated
* **Animal domestication**: Cattle, sheep, goats
* **Trade**:
  * Internal trade within cities
  * External trade with Mesopotamia

Evidence:
* Seals
* Weights and measures
* Dockyard at Lothal

---

### 🏺 Craft and Industry

The Harappans were skilled artisans:
* Pottery (painted designs)
* Bead-making
* Metalwork (copper, bronze)
* Jewelry (gold, silver, precious stones)

Standardization suggests **organized production systems**.

---

### 🧾 Script and Language

* The Harappan script remains **undeciphered**
* Found on seals, pottery, and tablets
* Consists of pictographic symbols

This indicates the presence of **communication and record-keeping systems**.

---

### 🛐 Religion and Beliefs

The religious practices were simple and nature-based:
* Worship of **Mother Goddess** (fertility symbol)
* Proto-Shiva (Pashupati seal)
* Sacred animals (bull, elephant)
* Tree worship

There is no clear evidence of temples, suggesting **informal religious practices**.

---

### 🏛 Administration

Though no written records are available, evidence suggests:
* Strong centralized planning
* Uniformity in construction
* Standard weights and measures

This indicates the presence of an **efficient administrative system**.

---

### 📉 Decline of Civilization

The decline around 1900 BCE is attributed to:
* Climate change
* River shifts (Indus system changes)
* Possible floods or droughts

No evidence of large-scale war or invasion has been found.

---

### 📌 Conclusion

The Indus Valley Civilization represents:
* Advanced urban life
* Scientific planning
* Economic prosperity

It laid the foundation for future civilizations in India.""",
        "content_te": """## 🏺 మాడ్యూల్ 1: సింధు లోయ నాగరికత (Indus Valley Civilization)

![Image](https://www.harappa.com/sites/default/files/styles/galleryformatter_slide/public/mohenjodaro-drains-5.jpg)

![Image](https://www.harappa.com/sites/default/files/slides/granary-harappa.jpg)

![Image](https://www.harappa.com/sites/default/files/styles/gallery_wide_slide/public/slides/unicorn-seal_0.jpg)

![Image](https://www.harappa.com/sites/default/files/styles/galleryformatter_slide/public/seal-bw-h10A.jpg)

### 🧠 పరిచయం

సింధు లోయ నాగరికత (హరప్పా నాగరికత అని కూడా పిలుస్తారు) సుమారు **క్రీ.పూ. 2500 నుండి 1900 వరకు** ఉత్తర పశ్చిమ భారత ఉపఖండంలో అభివృద్ధి చెందింది. ఇది ప్రపంచంలోని తొలి నగరీకృత నాగరికతలలో ఒకటి.

ప్రధాన నగరాలు:
* హరప్పా
* మోహెంజోదారో
* లోథాల్
* ధోలావిరా

---

### 🏙 పట్టణ నిర్మాణం

ఈ నాగరికతలో అత్యంత ముఖ్యమైన లక్షణం **అద్భుతమైన నగర ప్రణాళిక**.

* వీధులు **గ్రిడ్ విధానంలో** నిర్మించబడ్డాయి
* ఇళ్ల నిర్మాణానికి **బేక్డ్ ఇటుకలు** ఉపయోగించారు
* పట్టణం రెండు భాగాలుగా విభజించబడింది:
  * కోట (Citadel)
  * దిగువ పట్టణం

**డ్రైనేజీ వ్యవస్థ**:
* భూగర్భ డ్రైన్లు
* ప్రతి ఇంటికి అనుసంధానం
* శుభ్రతకు ప్రాముఖ్యత

ఇది వారి **సాంకేతిక పరిజ్ఞానం మరియు సామాజిక క్రమశిక్షణ**ను సూచిస్తుంది.

---

### 🌾 ఆర్థిక వ్యవస్థ

సింధు నాగరికతలో ఆర్థిక వ్యవస్థ బలంగా ఉంది:
* వ్యవసాయం: గోధుమ, యవం, పత్తి
* జంతుపోషణ
* అంతర్గత మరియు బాహ్య వాణిజ్యం

లోథాల్లోని నౌకాశ్రయం వాణిజ్యానికి ఉదాహరణ.

---

### 🏺 కళలు మరియు పరిశ్రమలు

* మట్టిపాత్రలు
* ముత్యాల తయారీ
* లోహ పనితనం (రాగి, కంచు)
* ఆభరణాలు

ఇవి వారి **నైపుణ్యం మరియు వృత్తి అభివృద్ధి**ని సూచిస్తాయి.

---

### 🧾 లిపి

* ఇంకా చదవలేని లిపి
* ముద్రలపై కనిపిస్తుంది
* సంకేతాల రూపంలో ఉంటుంది

---

### 🛐 మతం

* తల్లి దేవత ఆరాధన
* పశుపతి (శివుడి ప్రారంభ రూపం)
* వృక్షాలు, జంతువుల పూజ

---

### 📉 పతనం

పతనానికి కారణాలు:
* వాతావరణ మార్పులు
* నదుల మార్పు
* వరదలు లేదా కరువు

---

### 📌 ముగింపు

సింధు నాగరికత:
* శాస్త్రీయ పట్టణ నిర్మాణం
* ఆర్థిక అభివృద్ధి
* సామాజిక క్రమబద్ధత"""
    },
    {
        "subtopic_id": "1a7fd41df0",
        "title": "VEDIC CIVILIZATION",
        "content_en": """# 📘 MODULE 2: VEDIC CIVILIZATION (EARLY & LATER)

![Image](https://upload.wikimedia.org/wikipedia/commons/9/91/Yajna1.jpg)

![Image](https://s3-us-west-2.amazonaws.com/content-markdown-images/pastures-of-ancient-india/image0.jpeg)

![Image](https://www.studento.co.in/ancient-indian-history/aih-images/later-vedic-age-tools.jpeg)

![Image](https://www.researchgate.net/publication/263697017/figure/fig27/AS%3A669547426218002%401536643954846/ron-tools-from-Megaliths-of-Vidarbha.png)

### 🧠 Introduction

The Vedic Civilization developed after the decline of the Indus Valley Civilization, roughly between **1500 BCE and 600 BCE**. It is known from the **Vedas**, the oldest sacred texts of India.

---

### 🌿 Early Vedic Period (1500–1000 BCE)

#### Society
* Tribal and pastoral
* Cattle wealth was important
* Women had relatively higher status

#### Political System
* Tribe (Jana) was the basic unit
* King (Rajan) ruled with advice from assemblies

#### Religion
* Worship of natural forces:
  * Indra (rain)
  * Agni (fire)
  * Varuna (water)

Religion was simple and based on **nature worship**.

---

### 🌾 Later Vedic Period (1000–600 BCE)

#### Economic Changes
* Shift from pastoral to **agricultural economy**
* Use of iron tools

#### Social Changes
* Emergence of **Varna system**:
  * Brahmins (priests)
  * Kshatriyas (warriors)
  * Vaishyas (traders)
  * Shudras (workers)

Society became more **hierarchical**.

---

### 🛐 Religious Changes
* Rituals became complex
* Dominance of Brahmins increased
* Sacrifices (Yajnas) became important

---

### 🏛 Political Development
* Emergence of larger kingdoms
* Kings became more powerful

---

### 📌 Conclusion
The Vedic period marked:
* Transition from tribal to settled life
* Formation of social hierarchy
* Foundation of Indian culture and traditions""",
        "content_te": """# 📘 మాడ్యూల్ 2: వేద నాగరికత (Vedic Civilization)

![Image](https://upload.wikimedia.org/wikipedia/commons/9/91/Yajna1.jpg)

![Image](https://upload.wikimedia.org/wikipedia/commons/1/11/Cow_and_its_calf.jpg)

![Image](https://s3-us-west-2.amazonaws.com/content-markdown-images/agriculture-of-ancient-india/image0.jpeg)

![Image](https://image.slidesharecdn.com/vedicagriculture-220210061852/85/Vedic-Economy-1-320.jpg)

### 🧠 పరిచయం

వేద నాగరికత సుమారు **క్రీ.పూ. 1500 నుండి 600 వరకు** అభివృద్ధి చెందింది. ఇది వేదాల ఆధారంగా తెలిసిన నాగరికత.

---

### 🌿 ప్రాథమిక వేద కాలం

* గిరిజన సమాజం
* పశుపోషణ ప్రధాన వృత్తి
* మహిళలకు గౌరవ స్థానం

మతం:
* ప్రకృతి దేవతల పూజ
  * ఇంద్రుడు
  * అగ్ని
  * వరుణుడు

---

### 🌾 తరువాతి వేద కాలం

* వ్యవసాయం అభివృద్ధి
* ఇనుప వినియోగం
* వర్ణ వ్యవస్థ స్థిరపడటం

వర్ణాలు:
* బ్రాహ్మణులు
* క్షత్రియులు
* వైశ్యులు
* శూద్రులు

---

### 🛐 మత మార్పులు

* యజ్ఞాలు ప్రాముఖ్యం
* బ్రాహ్మణుల ఆధిపత్యం

---

### 📌 ముగింపు

వేద కాలం:
* గిరిజన సమాజం నుండి స్థిర సమాజం
* సామాజిక వ్యవస్థ అభివృద్ధి
* భారతీయ సంస్కృతికి పునాది"""
    },
    {
        "subtopic_id": "eaaf9582c8",
        "title": "RELIGIOUS MOVEMENTS",
        "content_en": """# 📘 MODULE 3: RELIGIOUS MOVEMENTS (JAINISM & BUDDHISM)

![Image](https://upload.wikimedia.org/wikipedia/commons/e/e4/Bodhgaya_3639641913_f4c5f73689_t.jpg)

![Image](https://www.lotussculpture.com/mm5/graphics/00000001/1-Jain-White-Marble-Meditating-Statue.jpg)

![Image](https://cdn.britannica.com/36/155836-050-89E7AA9E/Great-Stupa-Sanchi-India.jpg)

![Image](https://www.trawell.in/admin/images/upload/144110142Sanchi_The_Great_Stupa_Main.jpg)

### 🧠 Introduction

In the **6th century BCE**, dissatisfaction with Vedic rituals and social inequalities led to the rise of new religious movements—mainly **Jainism and Buddhism**.

---

### ☸ Buddhism (Founded by Gautama Buddha)

#### Core Teachings
* Four Noble Truths:
  1. Life is full of suffering
  2. Desire is the cause
  3. Suffering can end
  4. Eightfold Path leads to liberation

#### Principles
* Middle Path (avoid extremes)
* Non-violence and compassion
* Rejection of caste system

---

### 🕉 Jainism (Founded by Mahavira)

#### Core Principles
* Ahimsa (non-violence)
* Aparigraha (non-possession)
* Truth and self-discipline

Jainism emphasizes **strict ethical conduct**.

---

### 🌍 Impact
* Spread of new ideas of equality
* Decline of ritual dominance
* Growth of monastic institutions

---

### 📌 Conclusion
These movements played a crucial role in:
* Reforming society
* Promoting moral values
* Influencing Indian philosophy""",
        "content_te": """# 📘 మాడ్యూల్ 3: మత సంస్కరణ ఉద్యమాలు (జైనిజం & బౌద్ధం)

![Image](https://upload.wikimedia.org/wikipedia/commons/e/e4/Bodhgaya_3639641913_f4c5f73689_t.jpg)

![Image](https://www.lotussculpture.com/mm5/graphics/00000001/1-Jain-White-Marble-Meditating-Statue.jpg)

![Image](https://cdn.britannica.com/36/155836-050-89E7AA9E/Great-Stupa-Sanchi-India.jpg)

![Image](https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/East_Gateway_-_Stupa_1_-_Sanchi_Hill_2013-02-21_4398.JPG/330px-East_Gateway_-_Stupa_1_-_Sanchi_Hill_2013-02-21_4398.JPG)

### 🧠 పరిచయం

క్రీ.పూ. 6వ శతాబ్దంలో వేద మతంలోని కఠిన కర్మకాండాలకు వ్యతిరేకంగా కొత్త మతాలు ఏర్పడ్డాయి.

---

### ☸ బౌద్ధం (స్థాపకుడు: Gautama Buddha)

* నాలుగు సత్యాలు
* అష్టాంగ మార్గం
* మధ్యమ మార్గం

---

### 🕉 జైన మతం (స్థాపకుడు: Mahavira)

* అహింస
* అపరిగ్రహం
* సత్యం

---

### 🌍 ప్రభావం

* సమానత్వం
* నైతిక జీవనం
* కులవ్యవస్థకు వ్యతిరేకం

---

### 📌 ముగింపు

ఈ ఉద్యమాలు:
* సమాజంలో మార్పు తీసుకువచ్చాయి
* నైతిక విలువలను పెంపొందించాయి"""
    },
    {
        "subtopic_id": "39692be8d4",
        "title": "MAURYAS, GUPTAS, CHOLAS",
        "content_en": """# 📘 MODULE 4: MAURYAS, GUPTAS, CHOLAS (ART & CULTURE)

![Image](https://upload.wikimedia.org/wikipedia/commons/3/38/Sarnath_capital.jpg)

![Image](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Rashtrapati_Bhavan_Buddha%2C_Mathura%2C_5th_century_%28black_background%29.jpg/330px-Rashtrapati_Bhavan_Buddha%2C_Mathura%2C_5th_century_%28black_background%29.jpg)

![Image](https://upload.wikimedia.org/wikipedia/commons/9/9e/Gangaikondacholapuram_Temple_4.jpg)

![Image](https://media.assettype.com/tnm%2Fimport%2Fsites%2Fdefault%2Ffiles%2FBrihadeshwara_temple_SusheelaNair_1200_221022.jpg)

### 🧠 Explanation

#### Mauryan Empire
* Founded by Chandragupta Maurya
* Emperor Ashoka promoted Buddhism
* Rock edicts spread moral teachings

---

#### Gupta Empire (Golden Age)
* Advancement in science (Aryabhata)
* Literature (Kalidasa)
* Art and architecture flourished

---

#### Chola Dynasty
* Temple architecture (Brihadeeswara Temple)
* Strong navy and trade

---

### 📌 Conclusion
These dynasties contributed to:
* Cultural development
* Scientific progress
* Architectural excellence""",
        "content_te": """# 📘 మాడ్యూల్ 4: మౌర్యులు, గుప్తులు, చోళులు

![Image](https://upload.wikimedia.org/wikipedia/commons/3/38/Sarnath_capital.jpg)

![Image](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Rashtrapati_Bhavan_Buddha%2C_Mathura%2C_5th_century_%28black_background%29.jpg/330px-Rashtrapati_Bhavan_Buddha%2C_Mathura%2C_5th_century_%28black_background%29.jpg)

![Image](https://upload.wikimedia.org/wikipedia/commons/9/9e/Gangaikondacholapuram_Temple_4.jpg)

![Image](https://media.assettype.com/tnm/import/sites/default/files/Brihadeshwara_temple_SusheelaNair_1200_221022.jpg?auto=format%2Ccompress&enlarge=true&fit=max&h=675&w=1200)

### 🧠 వివరణ

#### మౌర్యులు
* అశోకుడు బౌద్ధాన్ని ప్రోత్సహించాడు
* శాసనాల ద్వారా ధర్మ ప్రచారం

---

#### గుప్తులు
* స్వర్ణయుగం
* శాస్త్ర విజ్ఞానం (ఆర్యభట)
* సాహిత్యం (కాలిదాసు)

---

#### చోళులు
* దేవాలయ నిర్మాణం
* సముద్ర వాణిజ్యం

---

### 📌 ముగింపు

ఈ వంశాలు:
* సంస్కృతి అభివృద్ధి
* కళల పురోగతి"""
    },
    {
        "subtopic_id": "harsha_rajput", # Will handle creation
        "title": "Harsha & Rajput Age",
        "content_en": """# 📘 MODULE 5: HARSHA & RAJPUT AGE

### 🧠 Explanation
* Harsha unified North India briefly
* Promoted Buddhism and culture

After his death:
* Rise of Rajputs
* Feudal system developed
* Focus on warfare and honor

---

### 📌 Conclusion
This period saw:
* Political fragmentation
* Rise of regional powers
* Cultural continuity""",
        "content_te": """# 📘 మాడ్యూల్ 5: హర్షుడు మరియు రాజపుత్ర యుగం

### 🧠 వివరణ
* హర్షుడు ఉత్తర భారతాన్ని ఏకం చేశాడు
* బౌద్ధాన్ని ప్రోత్సహించాడు

తర్వాత:
* రాజపుత్రుల ఉద్భవం
* ప్రాంతీయ రాజ్యాలు

---

### 📌 ముగింపు
ఈ కాలంలో:
* రాజకీయ విభజన
* ప్రాంతీయ సంస్కృతి అభివృద్ధి"""
    }
]

def ingest():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for module in modules:
        subtopic_id = module["subtopic_id"]
        
        # Special case for Harsha & Rajput which might not exist
        if subtopic_id == "harsha_rajput":
            # Check if it already exists by name
            cursor.execute("SELECT id FROM subtopics WHERE title LIKE '%Harsha%'")
            res = cursor.fetchone()
            if res:
                subtopic_id = res[0]
            else:
                # Create a new subtopic under Topic '76c7d23580' (Ancient & Medieval India)
                subtopic_id = uuid.uuid4().hex[:10]
                cursor.execute("INSERT INTO subtopics (id, title, topic_id) VALUES (?, ?, ?)", 
                             (subtopic_id, module["title"], "76c7d23580"))
                print(f"Created new subtopic: {module['title']}")

        # Update or Insert Concept
        cursor.execute("SELECT id FROM concepts WHERE subtopic_id = ?", (subtopic_id,))
        res = cursor.fetchone()
        
        if res:
            concept_id = res[0]
            cursor.execute("UPDATE concepts SET content = ?, content_telugu = ? WHERE id = ?", 
                         (module["content_en"], module["content_te"], concept_id))
            print(f"Updated content for: {module['title']}")
        else:
            concept_id = uuid.uuid4().hex[:10]
            cursor.execute("""
                INSERT INTO concepts (id, title, content, content_telugu, subtopic_id, key_points, examples) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (concept_id, module["title"], module["content_en"], module["content_te"], subtopic_id, "[]", "[]"))
            print(f"Inserted new content for: {module['title']}")

    conn.commit()
    conn.close()
    print("Ingestion complete.")

if __name__ == "__main__":
    ingest()
