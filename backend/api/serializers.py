from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Todo, CalendarEvent
import re

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
        
class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'user', 'task', 'due_date', 'priority', 'completed', 'created_at']
        read_only_fields = ['user', 'created_at']

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = ['id', 'title', 'date', 'time']
        

class UserSettingsSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(write_only=True, required=False)
    current_password = serializers.CharField(write_only=True, required=True)
    username = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ("username", "current_password", "new_password")

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        if value:
            if len(value) < 8 or \
               not re.search(r"[a-z]", value) or \
               not re.search(r"[A-Z]", value) or \
               not re.search(r"\d", value) or \
               not re.search(r"[^\w\s]", value):
                raise serializers.ValidationError(
                    "Password must be at least 8 characters and include upper/lowercase, number, and symbol."
                )
        return value

    def update(self, instance, validated_data):
        validated_data.pop("current_password", None)
        new_password = validated_data.pop("new_password", None)

        if "username" in validated_data:
            instance.username = validated_data["username"]
        if new_password:
            instance.set_password(new_password)
        instance.save()
        return instance