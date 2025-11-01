from fastapi import APIRouter
from app.services import vectorstore

router = APIRouter()

@router.get("")
def search_meetings(q: str = ""):
    if not q:
        return {"results": []}
    
    results = vectorstore.query_similar(q)
    return {
        "query": q,
        "results": results
    }