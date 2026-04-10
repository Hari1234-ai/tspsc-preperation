from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, JSON, Text, Table
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

# Many-to-Many Association Tables
paper_subject_association = Table(
    'paper_subject',
    Base.metadata,
    Column('paper_id', String, ForeignKey('papers.id', ondelete="CASCADE"), primary_key=True),
    Column('subject_id', String, ForeignKey('subjects.id', ondelete="CASCADE"), primary_key=True)
)

subject_topic_association = Table(
    'subject_topic',
    Base.metadata,
    Column('subject_id', String, ForeignKey('subjects.id', ondelete="CASCADE"), primary_key=True),
    Column('topic_id', String, ForeignKey('topics.id', ondelete="CASCADE"), primary_key=True)
)

topic_subtopic_association = Table(
    'topic_subtopic',
    Base.metadata,
    Column('topic_id', String, ForeignKey('topics.id', ondelete="CASCADE"), primary_key=True),
    Column('subtopic_id', String, ForeignKey('subtopics.id', ondelete="CASCADE"), primary_key=True)
)

subtopic_concept_association = Table(
    'subtopic_concept',
    Base.metadata,
    Column('subtopic_id', String, ForeignKey('subtopics.id', ondelete="CASCADE"), primary_key=True),
    Column('concept_id', String, ForeignKey('concepts.id', ondelete="CASCADE"), primary_key=True)
)

class Paper(Base):
    __tablename__ = "papers"
    id = Column(String, primary_key=True, index=True)
    exam_id = Column(String, index=True, default="Group_II") # Group_II, Group_III, Group_IV
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    order_index = Column(Integer, default=0)
    
    subjects = relationship("Subject", secondary=paper_subject_association, back_populates="papers")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    order_index = Column(Integer, default=0)
    
    papers = relationship("Paper", secondary=paper_subject_association, back_populates="subjects")
    topics = relationship("Topic", secondary=subject_topic_association, back_populates="subjects")

class Topic(Base):
    __tablename__ = "topics"
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    weightage = Column(String, default="High")  # High, Medium, Low
    order_index = Column(Integer, default=0)
    
    subjects = relationship("Subject", secondary=subject_topic_association, back_populates="topics")
    subtopics = relationship("Subtopic", secondary=topic_subtopic_association, back_populates="topics")
    # For topics that have direct concepts
    concepts = relationship("Concept", back_populates="topic", cascade="all, delete-orphan")

class Subtopic(Base):
    __tablename__ = "subtopics"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    description = Column(String, nullable=True)
    order_index = Column(Integer, default=0)
    
    topics = relationship("Topic", secondary=topic_subtopic_association, back_populates="subtopics")
    concepts = relationship("Concept", secondary=subtopic_concept_association, back_populates="subtopics")

class Concept(Base):
    __tablename__ = "concepts"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    modules = Column(JSON, default=list) 
    # Example format: [{"type": "text", "content": "..."}, {"type": "video", "url": "..."}]
    
    subtopics = relationship("Subtopic", secondary=subtopic_concept_association, back_populates="concepts")
    
    # Legacy topic compatibility for Concept directly on a Topic without subtopics
    topic_id = Column(String, ForeignKey("topics.id", ondelete="SET NULL"), nullable=True)
    topic = relationship("Topic", back_populates="concepts")

class UserProgress(Base):
    __tablename__ = "user_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    item_id = Column(String, index=True)  # Can be topic_id or concept_id
    item_type = Column(String)           # topic, concept
    completed = Column(Boolean, default=False)
    accuracy = Column(Float, default=0.0)
    time_spent = Column(Integer, default=0) # in minutes
    last_studied = Column(DateTime, default=datetime.utcnow)

class DailyPlan(Base):
    __tablename__ = "daily_plans"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow, index=True)
    user_id = Column(String, index=True)
    overall_progress = Column(Float, default=0.0)
    tasks = relationship("DailyTask", back_populates="plan", cascade="all, delete-orphan")

class DailyTask(Base):
    __tablename__ = "daily_tasks"
    id = Column(String, primary_key=True, index=True)
    plan_id = Column(String, ForeignKey("daily_plans.id"))
    plan = relationship("DailyPlan", back_populates="tasks")
    type = Column(String) # study, practice, revision
    title = Column(String)
    description = Column(String)
    duration_minutes = Column(Integer)
    completed = Column(Boolean, default=False)
    topic_id = Column(String, ForeignKey("topics.id"), nullable=True)

class Question(Base):
    __tablename__ = "questions"
    id = Column(String, primary_key=True, index=True)
    topic_id = Column(String, ForeignKey("topics.id"))
    type = Column(String) # mcq, true_false, matching
    question_text = Column(String)
    options = Column(JSON, nullable=True) # For MCQ: ["Opt1", "Opt2"], For Matching: {"A": "1", "B": "2"}
    correct_answer = Column(String) # For MCQ: "Opt1", For T/F: "True", For Matching: JSON string of pairs
    explanation = Column(String, nullable=True)
    paper_id = Column(String, nullable=True)
