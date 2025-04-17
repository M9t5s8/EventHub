from django.http import JsonResponse
import json
from contact.models import Contact
from eventhub_user.models import CustomUser
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect
from eventmodule.models import Event, Comment, Reply,TicketType,TicketPurchase,Ticket,Notification,EventRating,RSVP
from django.utils import timezone
from django.db.models import Q
from django.utils.timezone import localtime
from django.core.paginator import Paginator
import qrcode
import os
from django.conf import settings
from .forms import TicketStatusForm
from django.contrib.auth.decorators import user_passes_test
from django.db.models import Count
from django.db.models import Case, When, Value, IntegerField
from .utils import get_average_rating
from django.views.decorators.csrf import csrf_exempt



def is_admin(user):
    return user.is_authenticated and (user.is_staff)
def home_redirect():
    return redirect('/')


def is_admin_or_organizer(user):
    return user.is_authenticated and (user.is_staff or user.role == 'organizer')









# event detail page
@login_required
def event_detail(request, event_id):
    
    user = request.user
    
    event = get_object_or_404(Event, event_id=event_id)
    tickets = TicketType.objects.filter(event=event)
    
    
    
    
    average_rating, total_ratings = get_average_rating(event)
    
#    filter the comment with an admin and organizer
    comments = Comment.objects.filter(event=event).select_related('user').annotate(
    is_admin_or_organizer=Case(
        When(user__role='admin', then=Value(2)), 
        When(user__role='organizer', then=Value(1)), 
        default=Value(0),  
        output_field=IntegerField()
    )
    ).order_by('-is_admin_or_organizer', '-commented_at') 
    
    replies = Reply.objects.filter(comment__in=comments).select_related('user').annotate(
    is_admin_or_organizer=Case(
        When(user__role='admin', then=Value(2)),
        When(user__role='organizer', then=Value(1)), 
        default=Value(0),
        output_field=IntegerField()
    )
    ).order_by('-is_admin_or_organizer', 'replied_at')

    # for comment actions and reply actions
    comment_actions = {
        comment.comment_id: {
            'user_liked': comment.likes.filter(id=user.id).exists(),
            'user_disliked': comment.dislikes.filter(id=user.id).exists()
        } for comment in comments
    }
    reply_actions = {
        reply.reply_id: {
            'user_liked': reply.likes.filter(id=user.id).exists(),
            'user_disliked': reply.dislikes.filter(id=user.id).exists()
        } for reply in replies
    }

   
   
    grouped_replies = {}
    for reply in replies:
        if reply.comment.comment_id not in grouped_replies:
            grouped_replies[reply.comment.comment_id] = []
        grouped_replies[reply.comment.comment_id].append(reply)


    try:
        rating = EventRating.objects.get(user=user, event=event)
        user_rating = int(rating.rating)
    except EventRating.DoesNotExist:
        user_rating = 0
    
    stars_range = range(1, 6)
    context = {
        'user': user,
        'event': event,
        'tickets': tickets,
        'comments': comments,
        'comment_actions': comment_actions,
        'reply_actions': reply_actions,
        'replies': grouped_replies,
        'show_downbar': False,
        'average_rating': average_rating,
        'total_ratings': total_ratings,
        'user_rating':user_rating,
        'stars_range': stars_range,
    }

    return render(request, 'events/event_detail.html', context)

# ticket detail page
def ticket_detail(request, ticket_url):
    try:
        ticket = Ticket.objects.get(ticket_url=ticket_url)
    except Ticket.DoesNotExist:
        return render(request, '404.html', {'error': 'Ticket not found!'})

    
    qr_code = qrcode.make(f"http://192.168.10.103:8000/ticket/{ticket.ticket_url}/")
    
   
    qr_code_folder = os.path.join(settings.MEDIA_ROOT, 'qr_codes')
    
  
    if not os.path.exists(qr_code_folder):
        os.makedirs(qr_code_folder)

   
    file_name = f"ticket_{ticket.ticket_url}_qr.png"
    file_path = os.path.join(qr_code_folder, file_name)
    
    
    
    with open(file_path, 'wb') as f:
        qr_code.save(f)


   
    qr_code_file_url = file_name
    
    return render(request, 'events/ticket_detail.html', {
        'ticket': ticket,
        'qr_code_file_url': qr_code_file_url
    })


def rsvp_detail(request, rsvp_url):
    try:
        rsvp = RSVP.objects.get(rsvp_url=rsvp_url)
    except RSVP.DoesNotExist:
        return render(request, '404.html', {'error': 'RSVP not found!'})

    qr_code = qrcode.make(f"http://192.168.10.103:8000/rsvp/{rsvp.rsvp_url}/") 

    qr_code_folder = os.path.join(settings.MEDIA_ROOT, 'qr_codes')

    if not os.path.exists(qr_code_folder):
        os.makedirs(qr_code_folder)

    # Save the QR code image
    file_name = f"rsvp_{rsvp.id}_qr.png"
    file_path = os.path.join(qr_code_folder, file_name)

    with open(file_path, 'wb') as f:
        qr_code.save(f)

    qr_code_file_url = file_name

    return render(request, 'events/rsvp_detail.html', {
        'rsvp': rsvp,
        'qr_code_file_url': qr_code_file_url
    })


@login_required
def ticket_list_for_event(request, event_id):
    search_query = request.GET.get('q', '') 
    user=request.user

    event = get_object_or_404(Event, event_id=event_id)
    
    tickets = Ticket.objects.filter(event_id=event_id)
    rsvps = RSVP.objects.filter(event_id=event_id)

    # Filter by user if the role is 'attendee'
    if user.role == 'attendee':
        tickets = tickets.filter(user=user, payment_status='success')
        rsvps = rsvps.filter(user=user)

    # Search functionality (Ticket ID)
    if search_query:
        tickets = tickets.filter(Q(id__icontains=search_query))
        rsvps = rsvps.filter(Q(id__icontains=search_query))
    
    if request.method == 'POST':
        # Update Ticket statuses
        for ticket in tickets:
            status = request.POST.get(f"status_{ticket.id}")
            if status and ticket.status != status:
                ticket.status = status
                ticket.save()

        # Update RSVP statuses
        for rsvp in rsvps:
            rsvp_status = request.POST.get(f"rsvp_status_{rsvp.id}")
            if rsvp_status and rsvp.status != rsvp_status:
                rsvp.status = rsvp_status
                rsvp.save()


        return redirect('ticket_list_for_event', event_id=event_id)


    
    forms = {ticket.id: TicketStatusForm(instance=ticket) for ticket in tickets}

    return render(request, 'events/ticket_list.html', {
        'user': user,
        'tickets': tickets,
        'rsvps':rsvps,
        'forms': forms,
        'event_id': event_id,
        'event':event,
        'search_query': search_query,
    })

def home(request):
    now = timezone.now()
    events = Event.objects.none() 
    events = Event.objects.filter(
            event_date__gte=now.date(),
            is_deleted=False,
            is_active=True,
    ).order_by('event_date', 'event_time')[:3]
    
    tickets_queryset = TicketType.objects.filter(event__in=events)
    event_tickets = {}

    for ticket in tickets_queryset:
        event_id = ticket.event.event_id
        if event_id not in event_tickets:
            event_tickets[event_id] = []
        event_tickets[event_id].append(ticket)
    
    
    context = {
        'user': request.user,
        'events': events,
        'show_downbar': False,
        'event_tickets': event_tickets,
    }
    return render(request, "events/index.html", context)

def about(request):
    context = {
        'user': request.user,
        'show_downbar':False
        }
    return render(request, "events/about.html", context)

@login_required
def events(request):
    sort_type = request.GET.get('sort', 'recent')
    ticket_filter = request.GET.get('ticket', '')
    status_filter = request.GET.get('status', 'active')
    search_filter = request.GET.get('search-by', 'title')
    search_query = request.GET.get('q', '')
    events = Event.objects.filter(is_deleted=False)
    # Search filter
    if search_query:
        if search_filter == 'title':
            events = events.filter(title__icontains=search_query)
        elif search_filter == 'location':
            events = events.filter(location__icontains=search_query)
    # Sorting
    if sort_type == 'recent':
        events = events.order_by('-created_at')
    elif sort_type == 'first':
        events = events.order_by('created_at')
    elif sort_type == 'popular':
        events = events.annotate(saved_count=Count('saved_by')).order_by('-saved_count')
    # Ticket filter
    if ticket_filter == 'paid':
        events = events.filter(has_ticket=True)
    elif ticket_filter == 'free':
        events = events.filter(has_ticket=False)

    # Status filter
    if status_filter == 'active':
        events = events.filter(is_active=True)
    elif status_filter == 'inactive':
        events = events.filter(is_active=False)

    # Billboard events
    billboard_event = Event.objects.filter(is_billboard=True, is_deleted=False, is_active=True)
    
    tickets_queryset = TicketType.objects.filter(event__in=events)
    event_tickets = {}

    for ticket in tickets_queryset:
        event_id = ticket.event.event_id
        if event_id not in event_tickets:
            event_tickets[event_id] = []
        event_tickets[event_id].append(ticket)

    avg_rating = 0
    total_ratings = 0
    event_ratings = {}
    for event in events:
        avg_rating, total_ratings = get_average_rating(event)
        event_ratings[event.event_id] = {
            'average': avg_rating,
            'total': total_ratings
        }            
                
                      
    # for pages
    paginator = Paginator(events, 30) 
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)


    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        event_list = [
            {
                "user_role": request.user.role,
                "id": event.event_id,
                "title": event.title,
                "event_date": event.event_date.strftime("%Y-%m-%d"),
                "event_time": event.event_time.strftime("%H:%M"),
                "location": event.location,
                "has_ticket": event.has_ticket,
                "created_at": localtime(event.created_at).strftime("%Y-%m-%d %H:%M:%S"),
                "event_image": event.event_image.url if event.event_image else None,
                "organizer_name": event.organizer.name,
                "organizer_profile": event.organizer.profile_picture.url if event.organizer.profile_picture else None,
            }
            for event in page_obj
        ]
        return JsonResponse({
            "events": event_list,
            "has_next": page_obj.has_next(),
            "current_page": page_obj.number,
            "total_pages": paginator.num_pages,
        }, safe=False)

    
    context = {
        'user': request.user,
        'events': page_obj,
        'billboard_event': billboard_event,
        'show_downbar': False,
        'search_query': search_query,
        'selected_sort': sort_type,
        'selected_ticket': ticket_filter,
        'selected_status': status_filter,
        'selected_search': search_filter,
        'event_tickets': event_tickets,
        'event_ratings': event_ratings,
    }
    return render(request, "events/events.html", context)



@login_required
def profile(request):
    context = {
        'user': request.user,
        'show_downbar':True
        }
    return render(request, "events/profile.html", context)

@login_required
def upcoming_events(request):
    now = timezone.now()
    upcoming_events = Event.objects.none() 

    
    if request.user.role == "organizer":
        upcoming_events = Event.objects.filter(
            event_date__gte=now.date(),
            is_deleted=False,
            is_active=True,
            organizer=request.user
        ).order_by('event_date', 'event_time')
    
    
    elif request.user.role == "admin":
        upcoming_events = Event.objects.filter(
            event_date__gte=now.date(),
            is_active=True,
            is_deleted=False
        ).order_by('event_date', 'event_time')
    
   
    elif request.user.role == "attendee":
        upcoming_events = Event.objects.filter(
            saved_by=request.user,
            event_date__gte=now.date(),
            is_active=True,
            is_deleted=False
        ).order_by('event_date', 'event_time')

    tickets_queryset = TicketType.objects.filter(event__in=upcoming_events)
    event_tickets = {}

    for ticket in tickets_queryset:
        event_id = ticket.event.event_id
        if event_id not in event_tickets:
            event_tickets[event_id] = []
        event_tickets[event_id].append(ticket)
    
    
    
    
    context = {
        'user': request.user,
        'events': upcoming_events,
        'show_downbar': True,
        'event_tickets': event_tickets,
    }

    return render(request, "events/upcoming_events.html", context)

@login_required
def my_events(request):
    events = Event.objects.none()

    if request.user.role == "organizer":
        events = Event.objects.filter(is_deleted=False, organizer=request.user).order_by('-event_date')

    elif request.user.role == "admin":
        events = Event.objects.filter(
            is_deleted=False,
            organizer=request.user,
        ).order_by('-event_date')

    elif request.user.role == "attendee":
        saved_events = Event.objects.filter(
            saved_by=request.user,
            is_deleted=False,
        ).order_by('-event_date')
        events = saved_events

    tickets_queryset = TicketType.objects.filter(event__in=events)
    event_tickets = {}

# Fix: This part ensures that event_tickets is built correctly
    for ticket in tickets_queryset:
        event_id = ticket.event.event_id  # Set event_id for the current ticket
        if event_id not in event_tickets:  # Check if the event_id exists in event_tickets
            event_tickets[event_id] = []  # Create an empty list if not present
        event_tickets[event_id].append(ticket)  # Add the ticket to the list

    event_ratings = {}
    for event in events:
        avg_rating, total_ratings = get_average_rating(event)
        event_ratings[event.event_id] = {
            'average': avg_rating,
            'total': total_ratings
        }

    print("Event rating:", event_ratings)

    context = {
        'user': request.user,
        'events': events,
        'show_downbar': True,
        'event_tickets': event_tickets,
        'event_ratings': event_ratings,
    }
    return render(request, "events/my_events.html", context)

@login_required
def notifications(request):
    notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
    context = {
        'user': request.user,
        'show_downbar':True,
        'notifications':notifications
    }
    return render(request, "events/notifications.html", context)




@login_required
def contact_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            Contact.objects.create(contact_email=data.get('email'), contact_name=data.get('name'), contact_message=data.get('message'))
            return JsonResponse({"message": "Contact data saved successfully."}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Only POST requests are allowed."}, status=405)
