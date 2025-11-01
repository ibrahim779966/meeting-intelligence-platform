import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, '..', 'db', 'meetwise.db')

# Fix these paths - they should point to your actual whisper.cpp installation
WHISPER_CPP_BIN = os.path.join(BASE_DIR, '..', 'whisper.cpp', 'build', 'bin', 'main')
WHISPER_MODEL = os.path.join(BASE_DIR, '..', 'whisper.cpp', 'models', 'for-tests-ggml-small.en.bin')

OLLAMA_API = "http://127.0.0.1:11434/api/generate"  # This is
CHROMA_DB_DIR = os.path.join(BASE_DIR, '..', 'db', 'chroma')