from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from .models import Note

class NoteTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client.force_authenticate(user=self.user)

    def test_create_note(self):
        url = reverse("note-list")
        data = {"title": "Test Note", "content": "Hello from test!"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.count(), 1)
        self.assertEqual(Note.objects.first().title, "Test Note")

    def test_delete_note(self):
        note = Note.objects.create(author=self.user, title="To Delete", content="Delete me")
        url = reverse("delete-note", kwargs={"pk": note.pk})

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Note.objects.count(), 0)

