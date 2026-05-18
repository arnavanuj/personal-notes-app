const API_URL = "http://127.0.0.1:8000/notes";

const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const saveNoteButton = document.getElementById("saveNoteButton");
const notesList = document.getElementById("notesList");
const clearAllButton = document.getElementById("clearAllButton");
const searchInput = document.getElementById("searchInput");
const noteCount = document.getElementById("noteCount");
const cancelEditButton = document.getElementById("cancelEditButton");
const noteCategory = document.getElementById("noteCategory");

let notes = [];
let editNoteId = null;

loadNotesFromBackend();

saveNoteButton.addEventListener("click", async function () {
    const title = noteTitle.value;
    const content = noteContent.value;
    const category = noteCategory.value;

    if (title === "" || content === "") {
        alert("Please enter both title and note details");
        return;
    }

    const noteData = {
        title: title,
        content: content,
        category: category
    };

    if (editNoteId === null) {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(noteData)
        });
    } else {
        await fetch(`${API_URL}/${editNoteId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(noteData)
        });

        editNoteId = null;
        saveNoteButton.textContent = "Save Note";
        cancelEditButton.style.display = "none";
    }

    noteTitle.value = "";
    noteContent.value = "";

    await loadNotesFromBackend();
});

clearAllButton.addEventListener("click", async function () {
    const confirmClear = confirm("Are you sure you want to delete all notes?");

    if (confirmClear === false) {
        return;
    }

    for (let i = 0; i < notes.length; i++) {
        await fetch(`${API_URL}/${notes[i].id}`, {
            method: "DELETE"
        });
    }

    editNoteId = null;
    saveNoteButton.textContent = "Save Note";
    cancelEditButton.style.display = "none";

    noteTitle.value = "";
    noteContent.value = "";

    await loadNotesFromBackend();
});

searchInput.addEventListener("input", function () {
    showNotes();
});

cancelEditButton.addEventListener("click", function () {
    editNoteId = null;

    noteTitle.value = "";
    noteContent.value = "";

    saveNoteButton.textContent = "Save Note";
    cancelEditButton.style.display = "none";
});

async function loadNotesFromBackend() {
    const response = await fetch(API_URL);
    notes = await response.json();

    showNotes();
}

function showNotes() {
    notesList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    const filteredNotes = notes.filter(function (note) {
        return (
            note.title.toLowerCase().includes(searchText) ||
            note.content.toLowerCase().includes(searchText)
        );
    });

    if (searchText === "") {
        noteCount.textContent = "Total notes: " + notes.length;
    } else {
        noteCount.textContent = "Showing " + filteredNotes.length + " of " + notes.length + " notes";
    }

    if (filteredNotes.length === 0) {
        if (searchText === "") {
            notesList.innerHTML = "<p>No notes created yet.</p>";
        } else {
            notesList.innerHTML = "<p>No matching notes found.</p>";
        }
        return;
    }

    for (let i = 0; i < filteredNotes.length; i++) {
        notesList.innerHTML += `
            <div class="note-card">
                <h3>${filteredNotes[i].title}</h3>

                <p><strong>Category:</strong> ${filteredNotes[i].category || "Personal"}</p>

                <p>${filteredNotes[i].content}</p>

                <small>Created: ${filteredNotes[i].createdAt || "Date not available"}</small>
                <br>
                <small>Updated: ${filteredNotes[i].updatedAt || "Not updated yet"}</small>

                <div class="note-actions">
                    <button class="icon-button" onclick="editNote(${filteredNotes[i].id})" title="Edit">
                        <svg viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"></path>
                            <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                        </svg>
                    </button>

                    <button class="icon-button" onclick="deleteNote(${filteredNotes[i].id})" title="Delete">
                        <svg viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"></path>
                            <path d="M8 4l1-1h6l1 1h4v2H4V4h4z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
}

async function deleteNote(id) {
    const confirmDelete = confirm("Are you sure you want to delete this note?");

    if (confirmDelete === false) {
        return;
    }

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    editNoteId = null;
    saveNoteButton.textContent = "Save Note";
    cancelEditButton.style.display = "none";

    noteTitle.value = "";
    noteContent.value = "";

    await loadNotesFromBackend();
}

function editNote(id) {
    const selectedNote = notes.find(function (note) {
        return note.id === id;
    });

    noteTitle.value = selectedNote.title;
    noteContent.value = selectedNote.content;
    noteCategory.value = selectedNote.category || "Personal";

    editNoteId = id;
    saveNoteButton.textContent = "Update Note";
    cancelEditButton.style.display = "inline-block";
}