from django.db import models
from django.utils.timezone import now
from organizer.models import All_Organizer
import uuid


class Event(models.Model):
    event_id=models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    event_date = models.DateField() 
    event_time = models.TimeField()
    organizer = models.ForeignKey(All_Organizer, on_delete=models.CASCADE)
    location = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.event_id} - {self.title}"




