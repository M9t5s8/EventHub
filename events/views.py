from django.http import JsonResponse
import json
from contact.models import Contact
from eventhub_user.models import CustomUser
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
from eventmodule.models import Event, Comment, Reply
from django.utils import timezone








@login_required
def event_detail(request, event_id):
    user = request.user
    event = get_object_or_404(Event, event_id=event_id)
    comments = Comment.objects.filter(event=event).select_related('user').order_by('-commented_at')

    
    comment_actions = {
        comment.comment_id: {
            'user_liked': comment.likes.filter(id=user.id).exists(),
            'user_disliked': comment.dislikes.filter(id=user.id).exists()
        } for comment in comments
    }

   
    replies = Reply.objects.filter(comment__in=comments).select_related('user').order_by('replied_at')

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

    context = {
        'user_info': user,
        'event': event,
        'comments': comments,
        'comment_actions': comment_actions,
        'reply_actions': reply_actions,
        'replies': grouped_replies,
        'show_downbar': False
    }
    return render(request, 'events/event_detail.html', context)
























def home(request):
    context = {
        'user': request.user,
        'show_downbar': False
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
    events = Event.objects.order_by('-created_at')
    
    billboard_event=Event.objects.filter(is_billboard=True)
    context = {
        'user': request.user,
        'events': events,
        'billboard_event': billboard_event,
        'show_downbar':False
    }
    return render(request, "events/events.html", context)


def ourteam(request):
    context = {
        'user': request.user,
        'show_downbar':False
        }
    return render(request, "events/ourteam.html", context)

@login_required
def profile(request):
    context = {
        'user_info': request.user,
        'show_downbar':True
        }
    return render(request, "events/profile.html", context)

@login_required
def upcoming_events(request):
    # if(request.user.role=='organizer'):
    #     events = Event.objects.filter(organizer=request.user, is_active=True, event_date__gte=timezone.now().date()).order_by('event_date')
    if(request.user.role=='organizer'):
        active_events = Event.objects.filter(organizer=request.user,is_active=True).order_by('-created_at')
        inactive_events = Event.objects.filter(organizer=request.user,is_active=True).order_by('-created_at')
    elif(request.user.role=='attendee'):
        active_events = Event.objects.filter(is_active=True).order_by('-created_at')
        inactive_events = Event.objects.filter(is_active=True).order_by('-created_at')
    else:
        active_events = Event.objects.filter(is_active=True).order_by('-created_at')
        inactive_events = Event.objects.filter(is_active=False).order_by('-created_at')
    
    context = {
        'user': request.user,
        'active_events':active_events,
        'inactive_events':inactive_events,
        'show_downbar':True
        }
    return render(request, "events/upcoming_events.html", context)

@login_required
def my_events(request):
    if(request.user.role=='organizer'):
        active_events = Event.objects.filter(organizer=request.user,is_active=True).order_by('-created_at')
        inactive_events = Event.objects.filter(organizer=request.user,is_active=True).order_by('-created_at')
    elif(request.user.role=='attendee'):
        active_events = Event.objects.filter(is_active=True).order_by('-created_at')
        inactive_events = Event.objects.filter(is_active=True).order_by('-created_at')
    else:
        active_events = Event.objects.filter(is_active=True).order_by('-created_at')
        inactive_events = Event.objects.filter(is_active=False).order_by('-created_at')
    context = {
        'user_info': request.user,
        'active_events':active_events,
        'inactive_events':inactive_events,
        'show_downbar':True
        }
    return render(request, "events/my_events.html", context)

@login_required
def notifications(request):
    events = Event.objects.all() 
    context = {
        'user_info': request.user,
        'events': events,
        'show_downbar':True
    }
    return render(request, "events/notifications.html", context)

@login_required
def settings(request):
    context = {
        'user_info': request.user,
        'show_downbar':True
        }
    return render(request, "events/setting.html", context)




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











