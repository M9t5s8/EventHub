from django.db import models

class Attender(models.Model):
    id = models.AutoField(primary_key=True)
    attender_username = models.CharField(max_length=50, unique=True)  # Unique constraint for username
    attender_email = models.EmailField(max_length=255, unique=True)  # Email validation
    attender_password = models.CharField(max_length=255)  # Store the plain-text password

    class Meta:
        ordering = ['id']  # Orders by ascending id

    def __str__(self):
        return f"{self.id}"

