from fastapi import APIRouter, UploadFile, File, HTTPException
import os
from app.services import transcribe, summarize, database, vectorstore

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', '..', 'db')
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_audio(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.wav', '.mp3', '.mp4')):
            raise HTTPException(status_code=400, detail="Only WAV, MP3, and MP4 files are supported")

        # Save file
        contents = await file.read()
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(contents)

        print(f"✅ File saved: {file_path}")

        # Transcribe
        print("🔄 Transcribing audio...")
        transcript = transcribe.transcribe_audio(file_path)
        if transcript.startswith("Error"):
            raise HTTPException(status_code=500, detail=f"Transcription failed: {transcript}")
        
        print(f"✅ Transcription complete: {len(transcript)} characters")

        # Summarize (LLM)
        print("🔄 Generating summary...")
        structured = summarize.generate_structured_summary(transcript)
        
        print(f"✅ Summary generated: {structured}")

        # Save in DB - NOTE: Updated field names
       # Save in DB
        # Save in DB
        mid = database.save_meeting(
            file.filename,
            transcript,
            summary=structured.get("summary"),
            action_items=structured.get("key_action_items", []),
            sentiment=structured.get("overall_sentiment", "neutral"),
            topics=structured.get("main_topics", []),
            speakers=structured.get("speakers", [])
        )
        print(f"✅ Meeting saved to database with ID: {mid}")

        # Upsert to vectorstore
        vectorstore.upsert_meeting_vector(
            str(mid),
            structured.get("summary") or transcript[:3000],
            {"meeting_id": mid, "filename": file.filename},
        )

        print("✅ Vectorstore updated")

        return {
            "id": mid,
            "filename": file.filename,
            "summary": structured.get("summary"),
            "action_items": structured.get("key_action_items", []),
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")