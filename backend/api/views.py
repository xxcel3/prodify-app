import os
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import Note, Todo, CalendarEvent
from .serializers import UserSerializer, NoteSerializer, TodoSerializer, \
    CalendarEventSerializer, UserSettingsSerializer
from rest_framework import generics, viewsets, permissions, status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from groq import Groq


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
class TodoListCreate(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TodoDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)
    

class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = CalendarEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        date = self.request.query_params.get('date')
        queryset = CalendarEvent.objects.filter(user=self.request.user)
        if date:
            queryset = queryset.filter(date=date)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class EventRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    serializer_class = CalendarEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CalendarEvent.objects.filter(user=self.request.user)

class UserSettingsView(RetrieveUpdateAPIView):
    serializer_class = UserSettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
@api_view(['POST'])
def summarize_note(request):
    note_content = request.data.get("content", "")
    
    if not note_content:
        return JsonResponse({"error": "No content provided"}, status=400)

    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "Create a summary of the following note."},
                {"role": "user", "content": note_content}
            ],
            temperature=1,
            max_tokens=512,
            top_p=1
        )
        summary = response.choices[0].message.content.strip()
        return JsonResponse({"summary": summary})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    return Response({
        "username": request.user.username,
        "email": request.user.email
    })

@api_view(["POST"])
@permission_classes([AllowAny])  
def check_username(request):
    username = request.data.get("username", "")
    if User.objects.filter(username=username).exists():
        return Response({"available": False}, status=status.HTTP_409_CONFLICT)
    return Response({"available": True}, status=status.HTTP_200_OK)
