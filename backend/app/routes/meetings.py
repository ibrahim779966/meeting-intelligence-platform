from fastapi import APIRouter, HTTPException
from app.services import database

router = APIRouter()


@router.get('/list')
def list_meetings(limit: int = 50):
    return database.get_meetings(limit)



@router.get('/{meeting_id}')
def get_meeting(meeting_id: int):
    m = database.get_meeting(meeting_id)
    if not m:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return m
