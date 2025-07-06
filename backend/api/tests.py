from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from .models import Note, Todo, CalendarEvent
from datetime import date

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

    def test_summarize_note(self):
        url = reverse("summarize-note")
        note_content = (
            "Django is a high-level Python web framework that enables rapid development "
            "of secure and maintainable websites."
        )

        response = self.client.post(url, {"content": note_content}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_json = response.json()
        self.assertIn("summary", response_json)
        self.assertTrue(len(response_json["summary"]) > 0)
        
class TodoTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="todouser", password="password")
        self.client.force_authenticate(user=self.user)

    def test_create_todo(self):
        url = reverse("todo-list-create")
        data = {
            "task": "Finish the test case",
            "due_date": date.today().isoformat(),
            "priority": "H"
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Todo.objects.count(), 1)
        self.assertEqual(Todo.objects.first().task, "Finish the test case")

    def test_toggle_todo_completion(self):
        todo = Todo.objects.create(
            user=self.user,
            task="Toggle me",
            priority="M",
            completed=False
        )
        url = reverse("todo-detail", kwargs={"pk": todo.pk})
        response = self.client.patch(url, {"completed": True}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        todo.refresh_from_db()
        self.assertTrue(todo.completed)

    def test_delete_todo(self):
        todo = Todo.objects.create(
            user=self.user,
            task="Delete me",
            priority="L"
        )
        url = reverse("todo-detail", kwargs={"pk": todo.pk})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Todo.objects.count(), 0)

    def test_list_todos(self):
        Todo.objects.create(user=self.user, task="Task A", priority="M")
        Todo.objects.create(user=self.user, task="Task B", priority="H")

        url = reverse("todo-list-create")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
class UserTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="eve", password="password")
        self.client.force_authenticate(user=self.user)

    def test_get_username(self):
        url = reverse("get-user-info")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("username", response.data)
        self.assertEqual(response.data["username"], "eve")
        

class CalendarTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="calendaruser", password="password")
        self.client.force_authenticate(user=self.user)

    def test_create_calendar_event(self):
        url = reverse("calendar-events")
        data = {
            "title": "Team Meeting",
            "date": date.today().isoformat(),
            "user": self.user.id
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CalendarEvent.objects.count(), 1)
        self.assertEqual(CalendarEvent.objects.first().title, "Team Meeting")

    def test_list_calendar_events(self):
        CalendarEvent.objects.create(user=self.user, title="Event A", date=date.today())
        CalendarEvent.objects.create(user=self.user, title="Event B", date=date.today())

        url = reverse("calendar-events")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["title"], "Event A")