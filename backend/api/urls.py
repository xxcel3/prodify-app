from django.urls import path
from . import views
from .views import summarize_note, TodoListCreate, TodoDetail

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    
    path("summarize/", summarize_note, name="summarize-note"),
    
    path("todos/", TodoListCreate.as_view(), name="todo-list-create"),
    path("todos/<int:pk>/", TodoDetail.as_view(), name="todo-detail"),
]