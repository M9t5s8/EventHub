from django.core.mail import send_mail
from django.conf import settings
from .models import EventRating
from django.db.models import Avg

def send_ticket_email(ticket):
    subject = 'Your Ticket Confirmation'
    message = f"""
    Hello {ticket.name},

    Thank you for your purchase!

    You can view your ticket at the following link:
    http://192.168.10.103:8000/ticket/{ticket.ticket_url}/

    Event: {ticket.event.title}
    Total Paid: Rs {ticket.total_price}

    Enjoy your event!

    Regards,
    Event Team
    """
    recipient_list = [ticket.email]

    send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)
    
    
    
    
def get_average_rating(event):
    ratings = EventRating.objects.filter(event=event)
    
   
    if ratings.exists():
        average_rating = ratings.aggregate(Avg('rating'))['rating__avg']
    else:
        average_rating = 0

    total_ratings = ratings.count()
    return average_rating, total_ratings
