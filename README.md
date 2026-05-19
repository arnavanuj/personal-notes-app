# Personal Notes App
Personal Notes App is a beginner-friendly full-stack web application that allows users to create, view, edit, delete, search, and categorize personal notes.
## Features
- Create personal notes
- View all notes
- Edit existing notes
- Delete notes
- Search notes
- Categorize notes
- Store notes in SQLite database
- Test APIs using Swagger UI
- Run basic CI checks using GitHub Actions
## Technologies Used

- HTML
- CSS
- JavaScript
- Python
- FastAPI
- SQLite
- Git
- GitHub Actions

## How to Run the Project
### Run Backend

1. Open terminal in the project root folder.
2. Go inside backend folder.
3. Activate virtual environment.
4. Start FastAPI server.
5. Open Swagger UI at http://127.0.0.1:8000/docs

### Run Frontend

1. Open the frontend folder.
2. Open index.html in browser.
3. Use the app to create, view, edit, delete, search, and categorize notes.

## API Endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /notes | Get all notes |
| GET | /notes/{note_id} | Get one note by ID |
| POST | /notes | Create a new note |
| PUT | /notes/{note_id} | Update an existing note |
| DELETE | /notes/{note_id} | Delete a note |
API documentation is available through FastAPI Swagger UI at:




http://127.0.0.1:8000/docs