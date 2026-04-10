# CrackSarkar - AI-Powered Preparation Platform

CrackSarkar is a production-ready, full-stack learning platform designed specifically for CrackSarkar Group II, III, and IV aspirants. It combines structured syllabus navigation with an adaptive daily plan engine and bilingual AI intelligence.

## 🚀 Key Features

### 1. **Intelligent Dashboard**
- **Adaptive Progress**: Tracks your mastery across all papers.
- **Dynamic Missions**: Generates top 3 daily tasks based on syllabus weightage.
- **Mastery Summary**: High-fidelity chart visualization of subject-wise performance.

### 2. **Syllabus & Focus Mode**
- **Hierarchical Navigation**: Paper -> Subject -> Topic -> Subtopic -> Concept.
- **Distraction-Free Study**: "Focus Mode" removes all UI clutter for deep concentration.
- **Bilingual AI Insight**: Toggle between **English** and **తెలుగు** for simplified explanations and mnemonics.

### 3. **Daily Mission Engine**
- Persistent daily tasks stored in the backend.
- Real-time progress bars for "Daily Mastery".
- Integrated task management (Study, Practice, Revision).

### 4. **Progress Analytics**
- Subject-level accuracy and time-spent tracking.
- Mastery heatmaps and "Critical Redo" alerts for weak areas.

## 🛠 Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide Icons, Recharts.
- **Backend**: FastAPI, SQLAlchemy, SQLite (Zero-Config).
- **Communication**: RESTful API with Axios integration.

## 🏃‍♂️ Launching the Product

### **Step 1: Launch Backend**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### **Step 2: Launch Frontend**
```bash
cd frontend
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
```text
cracksarkar/
├── frontend/          # Next.js 14 UI
│   ├── app/           # App Router (Pages)
│   ├── components/    # Layout & UI Cards
│   └── lib/api.ts     # Connected API Client
└── backend/           # FastAPI 
    ├── app/           # API Routers & Services
    ├── db/            # SQLAlchemy Models & Seed
    └── cracksarkar.db # Local Persistence
```

---
*Built with ❤️ for CrackSarkar Aspirants.*
