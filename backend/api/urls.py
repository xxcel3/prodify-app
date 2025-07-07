from django.urls import path
from . import views
from .views import summarize_note, TodoListCreate, TodoDetail, \
    EventListCreateView, EventRetrieveDestroyView, UserSettingsView, \
    check_username, get_user_info

urlpatterns = [
    path("user/check-username/", views.check_username, name="check-username"),
    
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    
    path("summarize/", summarize_note, name="summarize-note"),
    
    path("todos/", TodoListCreate.as_view(), name="todo-list-create"),
    path("todos/<int:pk>/", TodoDetail.as_view(), name="todo-detail"),
    
    path("user/", get_user_info, name="get-user-info"),
    
    path("calendar/events/", EventListCreateView.as_view(), name="calendar-events"),
    path("calendar/events/<int:pk>/", EventRetrieveDestroyView.as_view(), name="calendar-event-detail"),
    
    path("settings/", UserSettingsView.as_view(), name="user-settings"),
]