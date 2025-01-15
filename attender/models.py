from django.db import models

class All_Attender(models.Model):
    id = models.AutoField(primary_key=True)
    attender_username = models.CharField(max_length=50, unique=True)  # Unique constraint for username
    attender_email = models.EmailField(max_length=255, unique=True)  # Email validation
    attender_password = models.CharField(max_length=255)  # Store the plain-text password

    class Meta:
        ordering = ['id']  # Orders by ascending id

    def __str__(self):
        return f"{self.id}"


class Active_Attender(models.Model):
    attender = models.OneToOneField(All_Attender, on_delete=models.CASCADE, primary_key=True)  # Use OneToOneField for the relationship

    def __str__(self):
        return f"{self.attender.attender_username} ({self.attender.attender_email})"
