from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from eventhub_user.models import CustomUser
from eventmodule.models import Event, Comment, Reply
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import json
from django.db.models import Q
from django.shortcuts import render, get_object_or_404, render,redirect
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.decorators import login_required


def get_authenticated_user(request):
    if not request.user.is_authenticated:
        return None
    return request.user
def user_authenticated_or_respond(request):
    user = get_authenticated_user(request)
    if not user:
        return JsonResponse({'success': False, 'message': 'User not authenticated.'}, status=403)
    return user
def is_admin_or_organizer(user):
    return user.is_authenticated and (user.is_staff or user.role == 'organizer')
def home_redirect():
    return redirect('/')


# View to add an event
@csrf_exempt
def add_event(request):
    if request.method == "POST":
        user=request.user
        event_name = request.POST.get('event_name')
        event_description = request.POST.get('event_description')
        event_date = request.POST.get('event_date')
        event_time = request.POST.get('event_time')
        event_location = request.POST.get('event_location')
        has_ticket = request.POST.get('has_ticket') == 'True'
        ticket_price = request.POST.get('ticket_price') if has_ticket else None
        event_image = request.FILES.get('event_image')
        

        organizer = get_object_or_404(CustomUser, Q(id=user.id) & Q(role__in=['organizer', 'admin']))


        
        new_event = Event.objects.create(
            title=event_name,
            description=event_description,
            event_date=event_date,
            event_time=event_time,
            location=event_location,
            has_ticket=has_ticket,
            ticket_price=ticket_price,
            event_image=event_image,
            organizer=organizer,
        )

        formatted_event_date = new_event.event_date.strftime('%Y-%m-%d') if isinstance(new_event.event_date, datetime) else "No Date Provided"
        formatted_event_time = new_event.event_time.strftime('%H:%M') if isinstance(new_event.event_time, datetime) else "No Time Provided"
        print("date:",formatted_event_date)
        response_data = {
            "success": True,
            "event_id": new_event.event_id,
            "event_name": new_event.title,
            "event_description": new_event.description,
            "event_date": formatted_event_date, 
            "event_time": formatted_event_time,
            "event_location": new_event.location,
            "has_ticket": new_event.has_ticket,
            "ticket_price": new_event.ticket_price if new_event.has_ticket else None,
            "event_image": new_event.event_image.url if new_event.event_image else None,
            "organizer_name": new_event.organizer.name,
            "role":organizer.role,
            "profile_picture": organizer.profile_picture.url if organizer.profile_picture else "/media/user_images/default.png",
        }

        return JsonResponse(response_data)

    return JsonResponse({"success": False, "message": "Invalid request"}, status=400)


@login_required
@user_passes_test(is_admin_or_organizer) 
def edit_event_view(request, event_id):
    event = get_object_or_404(Event, pk=event_id)
    context = {
        'user': request.user,
        'event':event,
        'show_downbar': False
    }
    return render(request, 'events/event_edit.html', context)


def edit_event(request, event_id):
    event = get_object_or_404(Event, event_id=event_id)
    if request.method == 'POST':
        event.title = request.POST.get('event_name')
        event.event_date = request.POST.get('event_date')
        event.event_time = request.POST.get('event_time')
        event.location = request.POST.get('event_location')
        event.is_billboard = request.POST.get('is_billboard') == 'True'
        if request.FILES.get('event_image'):
            event.event_image = request.FILES['event_image']
        event.save()
        return JsonResponse({'success': True, 'message': 'Event updated successfully'})
    return JsonResponse({'success': False, 'message': 'Failed to update event'})



@csrf_exempt
def delete_event(request, event_id):
    if request.method == "DELETE":
        event = get_object_or_404(Event, event_id=event_id)

        # Ensure only the organizer or admin can delete
        if request.user == event.organizer or request.user.role == "admin":
            event.delete()
            return JsonResponse({"success": True})
        else:
            return JsonResponse({"success": False, "error": "Permission denied."}, status=403)

    return JsonResponse({"success": False, "error": "Invalid request."}, status=400)










# View to add a comment
@csrf_exempt
def add_comment(request):
    if request.method == 'POST':
        user = user_authenticated_or_respond(request)
        if isinstance(user, JsonResponse):  # If the response is an error
            return user

        event_id = request.POST.get('event_id')
        comment_content = request.POST.get('comment_content')

        event = get_object_or_404(Event, pk=event_id)

        if not comment_content.strip():
            return JsonResponse({'success': False, 'message': 'Comment cannot be empty.'})

        comment = Comment.objects.create(event=event, user=user, content=comment_content)

        return JsonResponse({
            "success": True,
            "message": "Comment added successfully.",
            "comment_id": comment.comment_id,
            "username": user.name,
            "profile_picture": user.profile_picture.url if user.profile_picture else "/media/user_images/default.png",
            "commented_at": comment.commented_at.strftime("%Y-%m-%d %H:%M:%S"),
            "content": comment.content,
            "user_liked": False,
            "user_disliked": False,
            "likes_count": 0,
            "dislikes_count": 0
        })

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)


# View to like a comment
@csrf_exempt
def like_comment(request, comment_id):
    user = user_authenticated_or_respond(request)
    if isinstance(user, JsonResponse):  # If the response is an error
        return user

    comment = get_object_or_404(Comment, comment_id=comment_id)

    if request.method == "POST":
        data = json.loads(request.body)
        liked = data.get('liked', False)
        if liked:
            comment.likes.add(user)
            comment.dislikes.remove(user)
        else:
            comment.likes.remove(user)
        comment.save()

        return JsonResponse({
            'likes_count': comment.likes.count(),
            'dislikes_count': comment.dislikes.count(),
            'user_liked': user in comment.likes.all(),
            'user_disliked': user in comment.dislikes.all(),
        })


# View to dislike a comment
@csrf_exempt
def dislike_comment(request, comment_id):
    user = user_authenticated_or_respond(request)
    if isinstance(user, JsonResponse):  # If the response is an error
        return user

    comment = get_object_or_404(Comment, comment_id=comment_id)

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            disliked = data.get('disliked', False)
            if disliked:
                comment.dislikes.add(user)
                comment.likes.remove(user)
            else:
                comment.dislikes.remove(user)
            comment.save()

            return JsonResponse({
                'likes_count': comment.likes.count(),
                'dislikes_count': comment.dislikes.count(),
                'user_liked': user in comment.likes.all(),
                'user_disliked': user in comment.dislikes.all(),
            })

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)


# View to add a reply to a comment
@csrf_exempt
def add_reply(request):
    user = user_authenticated_or_respond(request)
    if isinstance(user, JsonResponse):  # If the response is an error
        return user

    if request.method == 'POST':
        try:
            comment_id = request.POST.get('comment_id')
            reply_content = request.POST.get('reply_content')

            comment = get_object_or_404(Comment, pk=comment_id)

            if not reply_content.strip():
                return JsonResponse({'success': False, 'message': 'Reply cannot be empty.'})

            reply = Reply.objects.create(comment=comment, user=user, content=reply_content)

            return JsonResponse({
                "success": True,
                "message": "Reply added successfully.",
                "reply_id": reply.reply_id,
                "username": user.name,
                "profile_picture": user.profile_picture.url if user.profile_picture else "/media/user_images/default.png",
                "replied_at": reply.replied_at.strftime("%Y-%m-%d %H:%M:%S"),
                "content": reply.content,
                "user_liked": False,
                "user_disliked": False,
                "likes_count": 0,
                "dislikes_count": 0
            })

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)


# View to like a reply
@csrf_exempt
def like_reply(request, reply_id):
    user = user_authenticated_or_respond(request)
    if isinstance(user, JsonResponse):  # If the response is an error
        return user

    reply = get_object_or_404(Reply, reply_id=reply_id)

    if request.method == "POST":
        data = json.loads(request.body)
        liked = data.get('liked', False)

        if liked:
            reply.likes.add(user)
            reply.dislikes.remove(user)
        else:
            reply.likes.remove(user)

        reply.save()

        return JsonResponse({
            'likes_count': reply.likes.count(),
            'dislikes_count': reply.dislikes.count(),
            'user_liked': user in reply.likes.all(),
            'user_disliked': user in reply.dislikes.all(),
        })



@csrf_exempt
def dislike_reply(request, reply_id):
    user = user_authenticated_or_respond(request)
    if isinstance(user, JsonResponse): 
        return user

    reply = get_object_or_404(Reply, reply_id=reply_id)

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            disliked = data.get('disliked', False)

            if disliked:
                reply.dislikes.add(user)
                reply.likes.remove(user)
            else:
                reply.dislikes.remove(user)

            reply.save()

            return JsonResponse({
                'likes_count': reply.likes.count(),
                'dislikes_count': reply.dislikes.count(),
                'user_liked': user in reply.likes.all(),
                'user_disliked': user in reply.dislikes.all(),
            })

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})

   
