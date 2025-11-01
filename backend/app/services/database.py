import sqlite3
import json
from app.config import DB_PATH


def migrate_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if speakers column exists
    cursor.execute("PRAGMA table_info(meetings)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'speakers' not in columns:
        # Add speakers column
        cursor.execute("ALTER TABLE meetings ADD COLUMN speakers TEXT")
        conn.commit()
        print("✅ Added speakers column to existing database")
    
    conn.close()


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS meetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            transcript TEXT,
            summary TEXT,
            action_items TEXT,
            sentiment TEXT,
            topics TEXT,
            speakers TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
    migrate_db() 
def save_meeting(filename, transcript, summary=None, action_items=None, sentiment=None, topics=None, speakers=None):
    conn = sqlite3.connect(DB_PATH)  # ADD THIS LINE
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO meetings (filename, transcript, summary, action_items, sentiment, topics, speakers) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (filename, transcript, summary or '', json.dumps(action_items or []), sentiment or '', json.dumps(topics or []), json.dumps(speakers or []))
    )
    conn.commit()
    rowid = cursor.lastrowid
    conn.close()
    return rowid

def get_meetings(limit=50):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, filename, transcript, summary, action_items, sentiment, topics, speakers, created_at 
        FROM meetings 
        ORDER BY created_at DESC 
        LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append({
            'id': r[0],
            'filename': r[1],
            'transcript': r[2],
            'summary': r[3],
            'action_items': json.loads(r[4] or '[]'),
            'sentiment': r[5],
            'topics': json.loads(r[6] or '[]'),
            'speakers': json.loads(r[7] or '[]'),  # ADD THIS
            'created_at': r[8],
        })
    return results

def get_meeting(meeting_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, filename, transcript, summary, action_items, sentiment, topics, speakers, created_at 
        FROM meetings 
        WHERE id=?
    """, (meeting_id,))
    r = cursor.fetchone()
    conn.close()

    if not r:
        return None

    return {
        'id': r[0],
        'filename': r[1],
        'transcript': r[2],
        'summary': r[3],
        'action_items': json.loads(r[4] or '[]'),
        'sentiment': r[5],
        'topics': json.loads(r[6] or '[]'),
        'speakers': json.loads(r[7] or '[]'),  # ADD THIS
        'created_at': r[8],
    }