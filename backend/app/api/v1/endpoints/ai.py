from fastapi import APIRouter, HTTPException

# AIService stub
class AIService:
    @staticmethod
    def get_concept_explanation(concept_id): return {"explanation": "AI Service currently in maintenance node."}

router = APIRouter()

@router.get("/explain/{concept_id}")
def get_concept_ai_explanation(concept_id: str):
    explanation = AIService.get_concept_explanation(concept_id)
    if not explanation:
        raise HTTPException(status_code=404, detail="AI Insight not found for this concept")
    return explanation
