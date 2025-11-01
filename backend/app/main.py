from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import audio, meetings, search
from app.services.database import init_db

app = FastAPI(title="MeetWise AI")  # THIS MUST COME FIRST

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(audio.router, prefix="/audio", tags=["audio"])
app.include_router(meetings.router, prefix="/meetings", tags=["meetings"])
app.include_router(search.router, prefix="/search", tags=["search"])  # MOVED DOWN

# Startup DB
@app.on_event("startup")
def startup():
    init_db()

# Root route
@app.get("/")
def root():
    return {"message": "✅ MeetWise AI Backend is running!"}