from datetime import datetime
from pydantic import BaseModel


class MeetingInDB(BaseModel):
id: int | None
filename: str
transcript: str
summary: str | None
action_items: list[str] | None
sentiment: str | None
topics: list[str] | None
created_at: str | None