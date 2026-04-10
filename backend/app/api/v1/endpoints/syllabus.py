from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from typing import List
from app.db.session import get_db
from app.db.base import Paper, Subject, Topic, Subtopic, Concept
from app.schemas.schemas import (
    PaperSchema, SubtopicSchema, SubtopicContentUpdate, 
    ConceptSchema, SubjectCreate, TopicCreate, SubtopicCreate, 
    SubjectSchema, TopicSchema, PaperCreate, BulkIds,
    PaperUpdate, SubjectUpdate, TopicUpdate, SubtopicUpdate,
    PaperSummary, SubjectSummary, TopicSummary, SubtopicSummary
)
# from app.services.content_generator import ContentGenerator
import uuid

router = APIRouter()

# --- FLAT GET ENDPOINTS FOR GLOBAL CMS ---
@router.get("/papers/all", response_model=List[PaperSummary])
def get_all_papers(db: Session = Depends(get_db)):
    return db.query(Paper).order_by(Paper.order_index.asc()).all()

@router.get("/subjects/all", response_model=List[SubjectSummary])
def get_all_subjects(db: Session = Depends(get_db)):
    return db.query(Subject).order_by(Subject.order_index.asc()).all()

@router.get("/topics/all", response_model=List[TopicSummary])
def get_all_topics(db: Session = Depends(get_db)):
    return db.query(Topic).order_by(Topic.order_index.asc()).all()

@router.get("/subtopics/all", response_model=List[SubtopicSummary])
def get_all_subtopics(db: Session = Depends(get_db)):
    return db.query(Subtopic).order_by(Subtopic.order_index.asc()).all()


@router.get("/tree", response_model=List[PaperSchema])
def get_syllabus_tree(exam_id: str = "Group_II", db: Session = Depends(get_db)):
    # Optimized fetching using selectinload to prevent N+1 queries
    query = db.query(Paper).options(
        selectinload(Paper.subjects)
        .selectinload(Subject.topics)
        .selectinload(Topic.subtopics)
        .selectinload(Subtopic.concepts),
        selectinload(Paper.subjects)
        .selectinload(Subject.topics)
        .selectinload(Topic.concepts)
    )
    
    if exam_id:
        query = query.filter(Paper.exam_id == exam_id)
    
    papers = query.order_by(Paper.order_index.asc()).all()
    return papers

@router.get("/papers/{paper_id}", response_model=PaperSchema)
def get_paper(paper_id: str, db: Session = Depends(get_db)):
    paper = db.query(Paper).options(
        selectinload(Paper.subjects).selectinload(Subject.topics).selectinload(Topic.subtopics),
        selectinload(Paper.subjects).selectinload(Subject.topics).selectinload(Topic.concepts)
    ).filter(Paper.id == paper_id).first()
    
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
        
    return paper

@router.get("/subtopic/{subtopic_id}", response_model=SubtopicSchema)
async def get_subtopic_details(subtopic_id: str, db: Session = Depends(get_db)):
    # Fetch subtopic with full concepts - INSTANT FETCH
    subtopic = db.query(Subtopic).options(
        selectinload(Subtopic.concepts)
    ).filter(Subtopic.id == subtopic_id).first()
    
    if not subtopic:
        raise HTTPException(status_code=404, detail="Subtopic not found")
        
    return subtopic

@router.get("/subject/{subject_id}", response_model=SubjectSchema)
async def get_subject_details(subject_id: str, db: Session = Depends(get_db)):
    subject = db.query(Subject).options(
        selectinload(Subject.topics).selectinload(Topic.concepts),
        selectinload(Subject.topics).selectinload(Topic.subtopics)
    ).filter(Subject.id == subject_id).first()
    
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
        
    return subject

@router.get("/topic/{topic_id}", response_model=TopicSchema)
async def get_topic_details(topic_id: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).options(
        selectinload(Topic.concepts),
        selectinload(Topic.subtopics)
    ).filter(Topic.id == topic_id).first()
    
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
        
    return topic

@router.put("/topic/{topic_id}/content", response_model=ConceptSchema)
async def update_topic_content(
    topic_id: str, 
    content_update: SubtopicContentUpdate, 
    db: Session = Depends(get_db)
):
    # Check if topic exists
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    if topic.concepts:
        # Update existing concept
        concept = topic.concepts[0]
        concept.modules = content_update.modules
    else:
        # Create a new concept
        concept = Concept(
            id=uuid.uuid4().hex[:10],
            title=topic.title,
            modules=content_update.modules
        )
        topic.concepts.append(concept)
        db.add(concept)
    
    db.commit()
    db.refresh(concept)
    return concept

@router.put("/subtopic/{subtopic_id}/content", response_model=ConceptSchema)
async def update_subtopic_content(
    subtopic_id: str, 
    content_update: SubtopicContentUpdate, 
    db: Session = Depends(get_db)
):
    # Check if subtopic exists
    subtopic = db.query(Subtopic).filter(Subtopic.id == subtopic_id).first()
    if not subtopic:
        raise HTTPException(status_code=404, detail="Subtopic not found")
    
    if subtopic.concepts:
        # Update existing concept
        concept = subtopic.concepts[0]
        concept.modules = content_update.modules
    else:
        # Create a new concept
        concept = Concept(
            id=uuid.uuid4().hex[:10],
            title=subtopic.title,
            modules=content_update.modules
        )
        subtopic.concepts.append(concept)
        db.add(concept)
    
    db.commit()
    db.refresh(concept)
    return concept
# --- SYLLABUS MANAGEMENT (CRUD) ---

@router.post("/papers", response_model=PaperSchema)
async def create_paper(paper_in: PaperCreate, db: Session = Depends(get_db)):
    # You can customize these defaults from payload later, for now we hardcode "Group_X" based on title
    # or let exam_id be sent in PaperCreate
    # Let's map it:
    new_id = paper_in.id if getattr(paper_in, "id", None) else f"custom-p-{uuid.uuid4().hex[:6]}"
    exam_id = "Group_II"
    if "III" in paper_in.title: exam_id = "Group_III"
    elif "IV" in paper_in.title: exam_id = "Group_IV"

    paper = Paper(
        id=new_id,
        title=paper_in.title,
        description=paper_in.description,
        exam_id=exam_id,
        order_index=0
    )
    db.add(paper)
    db.commit()
    db.refresh(paper)
    return paper

@router.post("/subjects", response_model=SubjectSchema)
async def create_subject(subject_in: SubjectCreate, db: Session = Depends(get_db)):
    new_id = f"custom-s-{uuid.uuid4().hex[:6]}"
    subject = Subject(
        id=new_id,
        title=subject_in.title,
        description=subject_in.description,
        order_index=subject_in.order_index
    )
    if subject_in.paper_ids:
        papers = db.query(Paper).filter(Paper.id.in_(subject_in.paper_ids)).all()
        for p in papers:
            subject.papers.append(p)
            
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject

@router.post("/topics", response_model=TopicSchema)
async def create_topic(topic_in: TopicCreate, db: Session = Depends(get_db)):
    new_id = f"custom-t-{uuid.uuid4().hex[:6]}"
    topic = Topic(
        id=new_id,
        title=topic_in.title,
        description=topic_in.description,
        weightage=topic_in.weightage,
        order_index=topic_in.order_index
    )
    if topic_in.subject_ids:
        subjects = db.query(Subject).filter(Subject.id.in_(topic_in.subject_ids)).all()
        for s in subjects:
            topic.subjects.append(s)
            
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic

@router.post("/subtopics", response_model=SubtopicSchema)
async def create_subtopic(subtopic_in: SubtopicCreate, db: Session = Depends(get_db)):
    new_id = f"custom-st-{uuid.uuid4().hex[:6]}"
    subtopic = Subtopic(
        id=new_id,
        title=subtopic_in.title,
        description=subtopic_in.description,
        order_index=subtopic_in.order_index
    )
    if subtopic_in.topic_ids:
        topics = db.query(Topic).filter(Topic.id.in_(subtopic_in.topic_ids)).all()
        for t in topics:
            subtopic.topics.append(t)
            
    db.add(subtopic)
    db.commit()
    db.refresh(subtopic)
    return subtopic

# --- HIERARCHICAL ASSIGNMENT POSTS (Assign existing) ---
@router.post("/papers/{paper_id}/subjects/bulk")
def assign_subjects_to_paper_bulk(paper_id: str, bulk_in: BulkIds, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper: raise HTTPException(404, "Paper not found")
    
    subjects = db.query(Subject).filter(Subject.id.in_(bulk_in.ids)).all()
    for subject in subjects:
        if subject not in paper.subjects:
            paper.subjects.append(subject)
    
    db.commit()
    return {"message": "Bulk assignment successful"}

@router.post("/papers/{paper_id}/subjects/{subject_id}")
def assign_subject_to_paper(paper_id: str, subject_id: str, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not paper or not subject: raise HTTPException(404, "Not found")
    if subject not in paper.subjects:
        paper.subjects.append(subject)
        db.commit()
    return {"message": "Assigned successfully"}
    
@router.delete("/papers/{paper_id}/subjects/{subject_id}")
def unassign_subject_from_paper(paper_id: str, subject_id: str, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not paper or not subject: raise HTTPException(404, "Not found")
    if subject in paper.subjects:
        paper.subjects.remove(subject)
        db.commit()
    return {"message": "Unassigned successfully"}

@router.post("/subjects/{subject_id}/topics/bulk")
def assign_topics_to_subject_bulk(subject_id: str, bulk_in: BulkIds, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject: raise HTTPException(404, "Subject not found")
    
    topics = db.query(Topic).filter(Topic.id.in_(bulk_in.ids)).all()
    for topic in topics:
        if topic not in subject.topics:
            subject.topics.append(topic)
    
    db.commit()
    return {"message": "Bulk assignment successful"}

@router.post("/subjects/{subject_id}/topics/{topic_id}")
def assign_topic_to_subject(subject_id: str, topic_id: str, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not subject or not topic: raise HTTPException(404, "Not found")
    if topic not in subject.topics:
        subject.topics.append(topic)
        db.commit()
    return {"message": "Assigned successfully"}

@router.delete("/subjects/{subject_id}/topics/{topic_id}")
def unassign_topic_from_subject(subject_id: str, topic_id: str, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not subject or not topic: raise HTTPException(404, "Not found")
    if topic in subject.topics:
        subject.topics.remove(topic)
        db.commit()
    return {"message": "Unassigned successfully"}

@router.post("/topics/{topic_id}/subtopics/bulk")
def assign_subtopics_to_topic_bulk(topic_id: str, bulk_in: BulkIds, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic: raise HTTPException(404, "Topic not found")
    
    subtopics = db.query(Subtopic).filter(Subtopic.id.in_(bulk_in.ids)).all()
    for subtopic in subtopics:
        if subtopic not in topic.subtopics:
            topic.subtopics.append(subtopic)
    
    db.commit()
    return {"message": "Bulk assignment successful"}

@router.post("/topics/{topic_id}/subtopics/{subtopic_id}")
def assign_subtopic_to_topic(topic_id: str, subtopic_id: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    subtopic = db.query(Subtopic).filter(Subtopic.id == subtopic_id).first()
    if not topic or not subtopic: raise HTTPException(404, "Not found")
    if subtopic not in topic.subtopics:
        topic.subtopics.append(subtopic)
        db.commit()
    return {"message": "Assigned successfully"}

@router.delete("/topics/{topic_id}/subtopics/{subtopic_id}")
def unassign_subtopic_from_topic(topic_id: str, subtopic_id: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    subtopic = db.query(Subtopic).filter(Subtopic.id == subtopic_id).first()
    if not topic or not subtopic: raise HTTPException(404, "Not found")
    if subtopic in topic.subtopics:
        topic.subtopics.remove(subtopic)
        db.commit()
    return {"message": "Unassigned successfully"}

@router.delete("/papers/{paper_id}")
async def delete_paper(paper_id: str, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    db.delete(paper)
    db.commit()
    return {"message": "Paper deleted successfully"}

@router.put("/papers/{paper_id}", response_model=PaperSchema)
async def update_paper(paper_id: str, paper_in: PaperUpdate, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper: raise HTTPException(404, "Paper not found")
    if paper_in.title is not None:
        paper.title = paper_in.title
    if paper_in.description is not None:
        paper.description = paper_in.description
    db.commit()
    db.refresh(paper)
    return paper

@router.delete("/subjects/{subject_id}")
async def delete_subject(subject_id: str, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(subject)
    db.commit()
    return {"message": "Subject deleted successfully"}

@router.put("/subjects/{subject_id}", response_model=SubjectSchema)
async def update_subject(subject_id: str, subject_in: SubjectUpdate, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject: raise HTTPException(404, "Subject not found")
    if subject_in.title is not None:
        subject.title = subject_in.title
    if subject_in.description is not None:
        subject.description = subject_in.description
    db.commit()
    db.refresh(subject)
    return subject

@router.delete("/topics/{topic_id}")
async def delete_topic(topic_id: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    db.delete(topic)
    db.commit()
    return {"message": "Topic deleted successfully"}

@router.put("/topics/{topic_id}", response_model=TopicSchema)
async def update_topic(topic_id: str, topic_in: TopicUpdate, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic: raise HTTPException(404, "Topic not found")
    if topic_in.title is not None:
        topic.title = topic_in.title
    if topic_in.description is not None:
        topic.description = topic_in.description
    if topic_in.weightage is not None:
        topic.weightage = topic_in.weightage
    db.commit()
    db.refresh(topic)
    return topic

@router.delete("/subtopics/{subtopic_id}")
async def delete_subtopic(subtopic_id: str, db: Session = Depends(get_db)):
    subtopic = db.query(Subtopic).filter(Subtopic.id == subtopic_id).first()
    if not subtopic:
        raise HTTPException(status_code=404, detail="Subtopic not found")
    db.delete(subtopic)
    db.commit()
    return {"message": "Subtopic deleted successfully"}

@router.put("/subtopics/{subtopic_id}", response_model=SubtopicSchema)
async def update_subtopic(subtopic_id: str, subtopic_in: SubtopicUpdate, db: Session = Depends(get_db)):
    subtopic = db.query(Subtopic).filter(Subtopic.id == subtopic_id).first()
    if not subtopic: raise HTTPException(404, "Subtopic not found")
    if subtopic_in.title is not None:
        subtopic.title = subtopic_in.title
    if subtopic_in.description is not None:
        subtopic.description = subtopic_in.description
    db.commit()
    db.refresh(subtopic)
    return subtopic
