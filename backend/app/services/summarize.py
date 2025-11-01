import requests
import json
from app.config import OLLAMA_API

def call_ollama(prompt: str, model: str = "llama3") -> str:
    """
    Fixed version for Ollama API with better error handling
    """
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    headers = {"Content-Type": "application/json"}

    try:
        print(f"🔄 Calling Ollama API...")
        res = requests.post(OLLAMA_API, json=payload, headers=headers, timeout=600)
        res.raise_for_status()
        data = res.json()
        
        response = data.get("response", "")
        print(f"✅ Ollama response received: {len(response)} characters")
        return response
        
    except requests.exceptions.ReadTimeout:
        print("❌ Ollama request timed out")
        return "Error: Ollama request timed out"
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Ollama - is it running?")
        return "Error: Cannot connect to Ollama. Make sure Ollama is running on port 11434"
    except Exception as e:
        print(f"❌ Error communicating with Ollama: {e}")
        return f"Error communicating with Ollama: {e}"

def generate_structured_summary(transcript: str):
    # Use a shorter transcript for testing
    test_transcript = transcript[:2000] if transcript else "No transcript available"
    
    prompt = f"""
    You are an AI meeting assistant. Analyze the following transcript and produce a structured JSON response with:
    - summary: brief overview of the meeting
    - key_action_items: list of action items
    - overall_sentiment: positive/neutral/negative
    - main_topics: list of main discussion topics

    Transcript:
    {test_transcript}

    Respond with ONLY valid JSON, no other text.
    """

    print(f"📋 Sending prompt to Ollama (transcript: {len(transcript)} chars)")
    raw = call_ollama(prompt)  # MOVE THIS LINE UP
    print(f"📨 Ollama raw response: {raw[:200]}...")
    
    speakers = identify_speakers(transcript)

    try:
        data = json.loads(raw)
        data["speakers"] = speakers
        return data
    except json.JSONDecodeError:
        print("❌ Failed to parse JSON from Ollama response")
        return {
            "summary": raw[:500] if raw else "Failed to generate summary",  # USE raw HERE
            "key_action_items": [],
            "overall_sentiment": "neutral", 
            "main_topics": [],
            "speakers": speakers
        }
def identify_speakers(transcript: str):
    """
    Identify speakers and their dialogue from transcript
    """
    prompt = f"""
    Analyze this meeting transcript and identify different speakers with their dialogue.
    Return ONLY valid JSON with this structure:
    {{
        "speakers": [
            {{
                "name": "Speaker Name",
                "dialogues": ["dialogue 1", "dialogue 2"]
            }}
        ]
    }}

    Transcript:
    {transcript}

    Respond with ONLY the JSON, no other text.
    """

    raw = call_ollama(prompt)
    
    try:
        data = json.loads(raw)
        return data.get("speakers", [])
    except json.JSONDecodeError:
        return []