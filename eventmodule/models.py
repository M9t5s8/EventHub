from django.db import models
from django.utils.timezone import now
from eventhub_user.models import CustomUser
import os
from django.db import models
from django.utils import timezone
from datetime import datetime
from django.utils import timezone

class Event(models.Model):
    event_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    event_date = models.DateField()
    event_time = models.TimeField()
    organizer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='organized_events')
    location = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True) 
    has_ticket = models.BooleanField(default=False)  
    is_billboard = models.BooleanField(default=False)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=0, null=True, blank=True)
    event_image = models.ImageField(upload_to='event_images/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if isinstance(self.event_date, str):
            self.event_date = datetime.strptime(self.event_date, '%Y-%m-%d').date()

        if self.event_date < timezone.now().date():
            self.is_active = False
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.event_id} - {self.title}"

    
class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_comments')
    content = models.TextField()
    likes = models.ManyToManyField(CustomUser, related_name="liked_comments", blank=True)
    dislikes = models.ManyToManyField(CustomUser, related_name="disliked_comments", blank=True)
    commented_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment {self.comment_id} by {self.user} on Event {self.event.title}"
    
class Reply(models.Model):
    reply_id = models.AutoField(primary_key=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='replies')  # Links to Comment
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_replies')
    content = models.TextField()
    likes = models.ManyToManyField(CustomUser, related_name="liked_replies", blank=True)
    dislikes = models.ManyToManyField(CustomUser, related_name="disliked_replies", blank=True)
    replied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reply {self.reply_id} by {self.user} on Comment {self.comment.comment_id}"


   

