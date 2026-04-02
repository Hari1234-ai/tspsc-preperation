from sqlalchemy.orm import Session, selectinload

@router.get("/tree", response_model=List[PaperSchema])
def get_syllabus_tree(exam_id: str = "Group_II", db: Session = Depends(get_db)):
    # Optimized fetching using selectinload to prevent N+1 queries
    query = db.query(Paper).options(
        selectinload(Paper.subjects)
        .selectinload(Subject.topics)
        .selectinload(Topic.subtopics)
        # Exclude Concept during tree fetch for speed; will fetch separately
    )
    
    if exam_id:
        query = query.filter(Paper.exam_id == exam_id)
    
    papers = query.all()
    return papers

from app.services.content_generator import ContentGenerator

@router.get("/subtopic/{subtopic_id}", response_model=SubtopicSchema)
async def get_subtopic_details(subtopic_id: str, db: Session = Depends(get_db)):
    # Fetch subtopic with full concepts for deep-dive
    subtopic = db.query(Subtopic).options(
        selectinload(Subtopic.concepts)
    ).filter(Subtopic.id == subtopic_id).first()
    
    if not subtopic:
        raise HTTPException(status_code=404, detail="Subtopic not found")
        
    # Content Pipeline: If content is missing or generic, trigger proper elaboration
    generator = ContentGenerator(db)
    for concept in subtopic.concepts:
        if not concept.content_telugu or len(concept.content) < 200:
            # Trigger "Proper Elaborated Content" generation
            await generator.generate_deep_dive(concept.id, concept.title)
            
    # Refresh to get updated content if generation was successful
    db.refresh(subtopic)
    return subtopic
