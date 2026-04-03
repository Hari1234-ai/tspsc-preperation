from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from typing import List
from app.db.session import get_db
from app.db.base import Paper, Subject, Topic, Subtopic, Concept
from app.schemas.schemas import (
    PaperSchema, SubtopicSchema, SubtopicContentUpdate, 
    ConceptSchema, SubjectCreate, TopicCreate, SubtopicCreate, 
    SubjectSchema, TopicSchema
)
from app.services.content_generator import ContentGenerator
import uuid

router = APIRouter()

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

@router.get("/subtopic/{subtopic_id}", response_model=SubtopicSchema)
async def get_subtopic_details(subtopic_id: str, db: Session = Depends(get_db)):
    # Fetch subtopic with full concepts - INSTANT FETCH
    subtopic = db.query(Subtopic).options(
        selectinload(Subtopic.concepts)
    ).filter(Subtopic.id == subtopic_id).first()
    
    if not subtopic:
        raise HTTPException(status_code=404, detail="Subtopic not found")
        
    return subtopic

@router.get("/topic/{topic_id}", response_model=TopicSchema)
async def get_topic_details(topic_id: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).options(
        selectinload(Topic.concepts)
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
    
    # Try to find an existing concept for this topic
    concept = db.query(Concept).filter(Concept.topic_id == topic_id).first()
    
    if not concept:
        # Create a new concept if one doesn't exist
        concept = Concept(
            id=uuid.uuid4().hex[:10],
            title=topic.title,
            content=content_update.content,
            content_telugu=content_update.content_telugu,
            key_points=[],
            examples=[],
            topic_id=topic_id
        )
        db.add(concept)
    else:
        # Update existing concept
        concept.content = content_update.content
        concept.content_telugu = content_update.content_telugu
    
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
    
    # Try to find an existing concept for this subtopic
    concept = db.query(Concept).filter(Concept.subtopic_id == subtopic_id).first()
    
    if not concept:
        # Create a new concept if one doesn't exist
        concept = Concept(
            id=uuid.uuid4().hex[:10],
            title=subtopic.title,
            content=content_update.content,
            content_telugu=content_update.content_telugu,
            key_points=[],
            examples=[],
            subtopic_id=subtopic_id
        )
        db.add(concept)
    else:
        # Update existing concept
        concept.content = content_update.content
        concept.content_telugu = content_update.content_telugu
    
    db.commit()
    db.refresh(concept)
    return concept
# --- SYLLABUS MANAGEMENT (CRUD) ---

@router.post("/subjects", response_model=SubjectSchema)
async def create_subject(subject_in: SubjectCreate, db: Session = Depends(get_db)):
    new_id = f"custom-s-{uuid.uuid4().hex[:6]}"
    subject = Subject(
        id=new_id,
        title=subject_in.title,
        paper_id=subject_in.paper_id,
        order_index=subject_in.order_index
    )
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
        subject_id=topic_in.subject_id,
        weightage=topic_in.weightage,
        order_index=topic_in.order_index
    )
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
        topic_id=subtopic_in.topic_id,
        order_index=subtopic_in.order_index
    )
    db.add(subtopic)
    db.commit()
    db.refresh(subtopic)
    return subtopic

@router.delete("/subjects/{subject_id}")
async def delete_subject(subject_id: str, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(subject)
    db.commit()
    return {"message": "Subject deleted successfully"}

@router.delete("/topics/{topic_id}")
async def delete_topic(topic_id: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    db.delete(topic)
    db.commit()
    return {"message": "Topic deleted successfully"}

@router.delete("/subtopics/{subtopic_id}")
async def delete_subtopic(subtopic_id: str, db: Session = Depends(get_db)):
    subtopic = db.query(Subtopic).filter(Subtopic.id == subtopic_id).first()
    if not subtopic:
        raise HTTPException(status_code=404, detail="Subtopic not found")
    db.delete(subtopic)
    db.commit()
    return {"message": "Subtopic deleted successfully"}
