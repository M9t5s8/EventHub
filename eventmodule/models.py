from django.db import models
from eventhub_user.models import CustomUser
import os
from django.utils import timezone
from datetime import datetime
import random
import secrets

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
    is_deleted = models.BooleanField(default=False)
    event_image = models.ImageField(upload_to='event_images/', null=True, blank=True)
    tickettypeno = models.IntegerField()

    
    saved_by = models.ManyToManyField(CustomUser, related_name="saved_events", blank=True)

    def save(self, *args, **kwargs):
        if not self.has_ticket:
            self.tickettypeno = 0
            
        if self.has_ticket and self.tickettypeno is None:
            self.tickettypeno = 1
        
        if isinstance(self.event_date, str):
            self.event_date = datetime.strptime(self.event_date, '%Y-%m-%d').date()

        if self.event_date < timezone.now().date():
            self.is_active = False
        
        if self.event_date > timezone.now().date():
            self.is_active = True
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.event_id} - {self.title}"



class TicketType(models.Model):
    id = models.AutoField(primary_key=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="ticket_types")
    name = models.CharField(max_length=255) 
    price = models.IntegerField()
    start_date = models.DateField(default=timezone.now, null=True, blank=True) 
    end_date = models.DateField(null=True, blank=True)
    purchased_by = models.ManyToManyField(CustomUser, related_name="purchased_ticket_types", blank=True)

    def __str__(self):
        return f"{self.name} - {self.price} for {self.event.title}"






class Ticket(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),      
        ('checked', 'Checked'),
        ('verified','Verified') 
    ]
    PAYMENT_STATUS_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]
    
    
    id = models.CharField(primary_key=True, max_length=8, unique=True, editable=False) 
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='purchased_tickets') 
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='event_tickets') 
    name = models.CharField(max_length=255)  
    email = models.EmailField() 
    total_price = models.IntegerField(default=0)
    purchase_date = models.DateTimeField(auto_now_add=True)  
    
    ticket_url = models.CharField(max_length=64, unique=True, blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')  # Ticket status
    transaction_uuid = models.CharField(max_length=100, blank=True, null=True, unique=True)
    payment_status = models.CharField(
        max_length=10,
        choices=PAYMENT_STATUS_CHOICES,
        default='failed',
    )
    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_ticket_id()

        if not self.ticket_url:
            self.ticket_url = self.generate_secure_ticket_url()

        super().save(*args, **kwargs)
        self.update_total_price()

    @staticmethod
    def generate_unique_ticket_id():
        """Generate a unique 8-digit ticket ID"""
        while True:
            ticket_id = str(random.randint(10000, 99999999))
            if not Ticket.objects.filter(id=ticket_id).exists():
                return ticket_id

    @staticmethod
    def generate_secure_ticket_url():
        """Generate a secure and unique ticket URL using secrets module"""
        return secrets.token_urlsafe(32)

    def update_total_price(self):
        total = sum(item.ticket_type.price * item.quantity for item in self.purchases.all())
        if self.total_price != total:
            self.total_price = total
            super().save(update_fields=['total_price'])

    def __str__(self):
        return f"Ticket {self.id} - {self.name} ({self.event.title})"

    def mark_as_submitted(self):
        """Mark the ticket as submitted"""
        self.status = 'verified'
        self.save()


class RSVP(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'in_progress'),
        ('cancelled','Cancelled'),
        ('verified','Verified'), 
        ('checked', 'Checked'), 
    ]

    id = models.CharField(primary_key=True, max_length=8, unique=True, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='rsvps')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='rsvps')
    full_name = models.CharField(max_length=100)
    rsvp_url = models.CharField(max_length=64, unique=True, blank=True, null=True)
    email = models.EmailField()
    attendees = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    rsvp_date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_rsvp_id()
            
        if not self.rsvp_url:
            self.rsvp_url = self.generate_secure_rsvp_url()
        
        super().save(*args, **kwargs) 

    @staticmethod
    def generate_unique_rsvp_id():
        while True:
            rsvp_id = str(random.randint(10000000, 99999999)) 
            if not RSVP.objects.filter(id=rsvp_id).exists():
                return rsvp_id
            
    @staticmethod
    def generate_secure_rsvp_url():
        """Generate a secure and unique ticket URL using secrets module"""
        return secrets.token_urlsafe(32)
    
    def mark_as_submitted(self):
        self.status = 'checked'
        self.save()

    def __str__(self):
        return f"{self.full_name} RSVPed for {self.event.title} ({self.attendees} people)"

class TicketPurchase(models.Model):
    ticket = models.ForeignKey(Ticket, related_name='purchases', on_delete=models.CASCADE, null=True, blank=True)
    ticket_type = models.ForeignKey(TicketType, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    purchase_date = models.DateTimeField(auto_now_add=True) 
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) 
    def __str__(self):
        return f"{self.ticket.user.name} bought {self.quantity} of {self.ticket_type.name}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        self.ticket.update_total_price()

    
    
    
    from django.db import models


class EventRating(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='event_ratings')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='given_ratings')
    rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True, null=True) 
    rated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')
        ordering = ['-rated_at']

    def __str__(self):
        return f"{self.user.name} rated '{self.event.title}' {self.rating} stars"

    
    
    
    
class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    type = models.CharField(max_length=50, choices=(
        ('event_update', 'Event Update'),
        ('ticket_upload', 'Ticket Upload'),
        ('ticket_purchase','Ticket Purchase'),
        ('rsvp','Rsvp'),
    ))
    url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.type}"
    
    
    
    
    
    

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


   

