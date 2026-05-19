from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_home_api():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_create_get_update_delete_note():
    create_response = client.post(
        "/notes",
        json={
            "title": "CI Test Note",
            "content": "This note is created during CI test",
            "category": "Work"
        }
    )

    assert create_response.status_code == 200

    created_note = create_response.json()
    note_id = created_note["id"]

    get_response = client.get(f"/notes/{note_id}")
    assert get_response.status_code == 200
    assert get_response.json()["title"] == "CI Test Note"

    update_response = client.put(
        f"/notes/{note_id}",
        json={
            "title": "Updated CI Test Note",
            "content": "This note was updated during CI test",
            "category": "Personal"
        }
    )

    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Updated CI Test Note"

    delete_response = client.delete(f"/notes/{note_id}")
    assert delete_response.status_code == 200

    get_deleted_response = client.get(f"/notes/{note_id}")
    assert get_deleted_response.status_code == 404