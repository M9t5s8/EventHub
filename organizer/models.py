from django.db import models

class All_Organizer(models.Model):
    id = models.AutoField(primary_key=True)
    organizer_name = models.CharField(max_length=50, unique=True)  # Unique constraint for username
    organizer_email = models.EmailField(max_length=255, unique=True)  # Email validation
    organizer_password = models.CharField(max_length=255)  # Store the plain text password

    class Meta:
        ordering = ['id']  # Orders by ascending id

    def __str__(self):
        return f"{self.organizer_name} ({self.organizer_email})"


class Active_Organizer(models.Model):
    organizer = models.OneToOneField(All_Organizer, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"{self.organizer.organizer_name} ({self.organizer.organizer_email})"
