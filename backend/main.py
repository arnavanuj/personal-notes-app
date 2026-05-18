from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_NAME = "notes.db"


class Note(BaseModel):
    title: str
    content: str
    category: str


def get_database_connection():
    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row
    return connection


def create_notes_table():
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            updatedAt TEXT
        )
    """)

    connection.commit()
    connection.close()


create_notes_table()


@app.get("/")
def home():
    return {"message": "Personal Notes Backend is running with SQLite database"}


@app.get("/notes")
def get_notes():
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM notes")
    rows = cursor.fetchall()

    connection.close()

    notes = []

    for row in rows:
        notes.append({
            "id": row["id"],
            "title": row["title"],
            "content": row["content"],
            "category": row["category"],
            "createdAt": row["createdAt"],
            "updatedAt": row["updatedAt"]
        })

    return notes


@app.get("/notes/{note_id}")
def get_note_by_id(note_id: int):
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM notes WHERE id = ?", (note_id,))
    row = cursor.fetchone()

    connection.close()

    if row is None:
        raise HTTPException(status_code=404, detail="Note not found")

    return {
        "id": row["id"],
        "title": row["title"],
        "content": row["content"],
        "category": row["category"],
        "createdAt": row["createdAt"],
        "updatedAt": row["updatedAt"]
    }


@app.post("/notes")
def create_note(note: Note):
    created_at = datetime.now().strftime("%d-%m-%Y %H:%M:%S")

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO notes (title, content, category, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?)
        """,
        (note.title, note.content, note.category, created_at, None)
    )

    connection.commit()

    new_note_id = cursor.lastrowid

    connection.close()

    return {
        "id": new_note_id,
        "title": note.title,
        "content": note.content,
        "category": note.category,
        "createdAt": created_at,
        "updatedAt": None
    }


@app.put("/notes/{note_id}")
def update_note(note_id: int, updated_note: Note):
    updated_at = datetime.now().strftime("%d-%m-%Y %H:%M:%S")

    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM notes WHERE id = ?", (note_id,))
    existing_note = cursor.fetchone()

    if existing_note is None:
        connection.close()
        raise HTTPException(status_code=404, detail="Note not found")

    cursor.execute(
        """
        UPDATE notes
        SET title = ?, content = ?, category = ?, updatedAt = ?
        WHERE id = ?
        """,
        (
            updated_note.title,
            updated_note.content,
            updated_note.category,
            updated_at,
            note_id
        )
    )

    connection.commit()
    connection.close()

    return {
        "id": note_id,
        "title": updated_note.title,
        "content": updated_note.content,
        "category": updated_note.category,
        "createdAt": existing_note["createdAt"],
        "updatedAt": updated_at
    }


@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM notes WHERE id = ?", (note_id,))
    existing_note = cursor.fetchone()

    if existing_note is None:
        connection.close()
        raise HTTPException(status_code=404, detail="Note not found")

    cursor.execute("DELETE FROM notes WHERE id = ?", (note_id,))

    connection.commit()
    connection.close()

    return {"message": "Note deleted successfully"}