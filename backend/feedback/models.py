from django.db import models
from django.core.mail import send_mail
from django.conf import settings
from textblob import TextBlob
from django.contrib.auth import get_user_model

User = get_user_model()

CATEGORY_CHOICES = [
    ('Electronics', 'Electronics'),
    ('Clothing', 'Clothing'),
    ('Books', 'Books'),
    ('Furniture', 'Furniture'),
    ('Grocery', 'Grocery'),
    ('Health & Beauty', 'Health & Beauty'),
    ('Toys', 'Toys'),
    ('Sports Equipment', 'Sports Equipment'),
    ('Automobile', 'Automobile'),
    ('Other', 'Other'),
]

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    product_name = models.CharField(max_length=255)
    feedback_text = models.TextField()
    sentiment = models.CharField(max_length=50, default="Neutral")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.sentiment = self.analyze_sentiment(self.feedback_text)
        super().save(*args, **kwargs)

        # Notify admin if sentiment is negative
        if self.sentiment == "Negative":
            self.notify_admin()

    def analyze_sentiment(self, text):
        sentiment = TextBlob(text).sentiment.polarity
        if sentiment > 0:
            return "Positive"
        elif sentiment < 0:
            return "Negative"
        else:
            return "Neutral"

    def notify_admin(self):
        admin_email = "Shashankkumar2108@gmail.com"  # Replace with your admin's email
        send_mail(
            subject="Negative Feedback Alert",
            message=(
                f"Negative feedback received:\n\n"
                f"User: {self.user.username}\n"
                f"Email: {self.user.email}\n"
                f"Category: {self.category}\n"
                f"Product: {self.product_name}\n\n"
                f"Feedback: {self.feedback_text}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[admin_email],
            fail_silently=False,
        )

    def __str__(self):
        return f"{self.user.username} - {self.product_name} ({self.sentiment})"
