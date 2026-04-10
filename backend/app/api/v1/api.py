from fastapi import APIRouter
from .endpoints import syllabus, plan, progress, ai, practice, uploads

api_router = APIRouter()
api_router.include_router(syllabus.router, prefix="/syllabus", tags=["Syllabus"])
api_router.include_router(plan.router, prefix="/plan", tags=["Plan"])
api_router.include_router(progress.router, prefix="/progress", tags=["Progress"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Intelligence"])
api_router.include_router(practice.router, prefix="/practice", tags=["Practice"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["Uploads"])
