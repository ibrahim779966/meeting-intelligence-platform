import chromadb
from app.config import CHROMA_DB_DIR

# Chroma client initialization
client = chromadb.PersistentClient(path=CHROMA_DB_DIR)

def get_collection(name='meetings'):
    try:
        return client.get_collection(name)
    except Exception:
        return client.create_collection(name)

def upsert_meeting_vector(meeting_id: str, text: str, metadata: dict):
    col = get_collection()
    col.upsert(ids=[str(meeting_id)], metadatas=[metadata], documents=[text])
    # Remove the client.persist() line - it's not needed in newer versions

def query_similar(text: str, n=5):
    col = get_collection()
    return col.query(query_texts=[text], n_results=n)