from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Feedback
        fields = ['id', 'user', 'email', 'category', 'product_name', 'feedback_text', 'sentiment', 'created_at']
        read_only_fields = ['user', 'email', 'sentiment', 'created_at']
