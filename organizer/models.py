from django.db import models
class Organizer(models.Model):
    organizer_name=models.CharField(max_length=50)
    organizer_email= models.CharField(max_length=50)
    organizer_password=models.CharField(max_length=50)
    
