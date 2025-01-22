from django.db import models

class Organizer(models.Model):
    id = models.AutoField(primary_key=True)
    organizer_name = models.CharField(max_length=50, unique=True)  # Unique constraint for username
    organizer_email = models.EmailField(max_length=255, unique=True)  # Email validation
    organizer_password = models.CharField(max_length=255)  # Store the plain text password

    class Meta:
        ordering = ['id']  # Orders by ascending id

    def __str__(self):
        return f"{self.organizer_name} ({self.organizer_email})"



