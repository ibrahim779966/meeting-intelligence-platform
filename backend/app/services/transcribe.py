import subprocess
import os

# Use base model instead of small
WHISPER_BIN = "/home/ibrahim/meeting-ai/whisper.cpp/build/bin/whisper-cli"
WHISPER_MODEL = "/home/ibrahim/meeting-ai/whisper.cpp/models/ggml-base.en.bin"

def transcribe_audio(audio_path: str) -> str:
    """Run Whisper.cpp to transcribe audio and return text."""
    try:
        print(f"🔍 Checking paths:")
        print(f"   Binary: {WHISPER_BIN} - exists: {os.path.exists(WHISPER_BIN)}")
        print(f"   Model: {WHISPER_MODEL} - exists: {os.path.exists(WHISPER_MODEL)}")
        print(f"   Audio: {audio_path} - exists: {os.path.exists(audio_path)}")

        if not os.path.exists(WHISPER_BIN):
            raise FileNotFoundError(f"Whisper binary not found: {WHISPER_BIN}")
        if not os.path.exists(WHISPER_MODEL):
            raise FileNotFoundError(f"Model file not found: {WHISPER_MODEL}")
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        cmd = [
            WHISPER_BIN,
            "-m", WHISPER_MODEL,
            "-f", audio_path,
            "-nt"
        ]

        print(f"🔊 Running command: {' '.join(cmd)}")
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False
        )

        print(f"📝 Return code: {result.returncode}")
        print(f"📝 STDOUT: '{result.stdout}'")
        
        if result.returncode != 0:
            return f"Whisper error: {result.stderr}"

        output = result.stdout.strip()
        print(f"✅ Transcription: '{output}'")
        
        return output

    except subprocess.TimeoutExpired:
        error_msg = "Whisper timed out after 30 seconds"
        print(f"❌ {error_msg}")
        return error_msg
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        print(f"❌ {error_msg}")
        return error_msg