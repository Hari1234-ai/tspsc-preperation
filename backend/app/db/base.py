from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Paper(Base):
    __tablename__ = "papers"
    id = Column(String, primary_key=True, index=True)
    exam_id = Column(String, index=True, default="Group_II") # Group_II, Group_III, Group_IV
    title = Column(String, index=True)
    subjects = relationship("Subject", back_populates="paper", cascade="all, delete-orphan")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    paper_id = Column(String, ForeignKey("papers.id"))
    paper = relationship("Paper", back_populates="subjects")
    topics = relationship("Topic", back_populates="subject", cascade="all, delete-orphan")

class Topic(Base):
    __tablename__ = "topics"
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    weightage = Column(String)  # High, Medium, Low
    subject_id = Column(String, ForeignKey("subjects.id"))
    subject = relationship("Subject", back_populates="topics")
    subtopics = relationship("Subtopic", back_populates="topic", cascade="all, delete-orphan")

class Subtopic(Base):
    __tablename__ = "subtopics"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    topic_id = Column(String, ForeignKey("topics.id"))
    topic = relationship("Topic", back_populates="subtopics")
    concepts = relationship("Concept", back_populates="subtopic", cascade="all, delete-orphan")

class Concept(Base):
    __tablename__ = "concepts"
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    content_telugu = Column(Text, nullable=True)
    key_points = Column(JSON)  # List of strings
    key_points_telugu = Column(JSON, nullable=True)
    examples = Column(JSON)    # List of strings
    examples_telugu = Column(JSON, nullable=True)
    subtopic_id = Column(String, ForeignKey("subtopics.id"))
    subtopic = relationship("Subtopic", back_populates="concepts")

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
