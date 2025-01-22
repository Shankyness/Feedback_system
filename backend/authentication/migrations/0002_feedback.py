# Generated by Django 5.1.4 on 2025-01-15 11:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('feedback_type', models.CharField(choices=[('Compliment', 'Compliment'), ('Complaint', 'Complaint'), ('Suggestion', 'Suggestion')], max_length=20)),
                ('comments', models.TextField()),
            ],
        ),
    ]
