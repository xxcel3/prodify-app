from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from django.http import JsonResponse
from rest_framework.decorators import api_view
from groq import Groq
import os

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
