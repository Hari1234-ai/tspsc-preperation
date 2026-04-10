from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ModuleSchema(BaseModel):
    type: str # 'text', 'image', 'video', 'audio'
    content: Optional[str] = None
    url: Optional[str] = None

class ConceptBase(BaseModel):
    id: str
    title: str
    modules: List[ModuleSchema] = []
    completed: bool = False

class ConceptCreate(ConceptBase):
    pass

class ConceptSchema(ConceptBase):
    class Config:
        from_attributes = True

class ConceptUpdate(BaseModel):
    title: Optional[str] = None
    modules: Optional[List[ModuleSchema]] = None

class SubtopicBase(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    progress: float = 0.0

class SubtopicCreate(BaseModel):
    title: str
    description: Optional[str] = None
    topic_ids: Optional[List[str]] = []
    order_index: Optional[int] = 0

class SubtopicSchema(SubtopicBase):
    concepts: List[ConceptSchema]
    class Config:
        from_attributes = True

class SubtopicContentUpdate(BaseModel):
    modules: List[ModuleSchema]

class TopicBase(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    weightage: str # High, Medium, Low

class TopicCreate(BaseModel):
    title: str
    description: Optional[str] = None
    subject_ids: Optional[List[str]] = []
    weightage: Optional[str] = "High"
    order_index: Optional[int] = 0

class TopicSchema(TopicBase):
    subtopics: List[SubtopicSchema]
    concepts: List[ConceptSchema]
    class Config:
        from_attributes = True

class SubjectBase(BaseModel):
    id: str
    title: str
    description: Optional[str] = None

class SubjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    paper_ids: Optional[List[str]] = []
    order_index: Optional[int] = 0

class SubjectSchema(SubjectBase):
    topics: List[TopicSchema]
    class Config:
        from_attributes = True

class PaperBase(BaseModel):
    id: str
    title: str
    description: Optional[str] = None

class PaperCreate(PaperBase):
    pass

class PaperSchema(BaseModel):
    id: str
    exam_id: str
    title: str
    subjects: List[SubjectSchema]
    
    class Config:
        from_attributes = True

class DailyTaskBase(BaseModel):
    id: str
    type: str # study, practice, revision, mock_test
    title: str
    description: str
    duration_minutes: int
    completed: bool = False
    topic_id: Optional[str] = None
    paper_id: Optional[str] = None

class DailyTaskCreate(DailyTaskBase):
    pass

class DailyTaskSchema(DailyTaskBase):
    class Config:
        from_attributes = True

class DailyPlanBase(BaseModel):
    date: datetime
    overall_progress: float = 0.0

class DailyPlanCreate(DailyPlanBase):
    pass

class DailyPlanSchema(DailyPlanBase):
    tasks: List[DailyTaskSchema]
    class Config:
        from_attributes = True

class UserProgressBase(BaseModel):
    user_id: str
    item_id: str
    item_type: str
    completed: bool = False
    accuracy: float = 0.0
    time_spent: int = 0
    last_studied: datetime = datetime.utcnow()

class UserProgressSchema(UserProgressBase):
    class Config:
        from_attributes = True

class BulkIds(BaseModel):
    ids: List[str]

class PaperUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class SubjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class TopicUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    weightage: Optional[str] = None

class SubtopicUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
