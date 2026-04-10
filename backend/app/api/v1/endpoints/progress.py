from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.base import UserProgress
from app.schemas.schemas import UserProgressSchema
from datetime import datetime

router = APIRouter()

@router.post("/update")
def update_progress(
    item_id: str, 
    item_type: str, 
    completed: bool = True,
    accuracy: float = 0.0,
    time_spent: int = 0,
    user_id: str = "default_user", 
    db: Session = Depends(get_db)
):
    # Check if progress record exists
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
        UserProgress.item_id == item_id
    ).first()
    
    if progress:
        progress.completed = completed
        progress.accuracy = accuracy
        progress.time_spent += time_spent
        progress.last_studied = datetime.utcnow()
    else:
        progress = UserProgress(
            user_id=user_id,
            item_id=item_id,
            item_type=item_type,
            completed=completed,
            accuracy=accuracy,
            time_spent=time_spent,
            last_studied=datetime.utcnow()
        )
        db.add(progress)
    
    db.commit()
    return {"message": "Progress updated successfully"}

@router.get("/overview")
def get_progress_summary(exam_id: str = None, user_id: str = "default_user", db: Session = Depends(get_db)):
    from app.services.plan_service import PlanService
    return PlanService.get_progress_overview(db, user_id, exam_id)
