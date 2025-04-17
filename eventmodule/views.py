from django.http import JsonResponse,HttpResponse
from eventhub_user.models import CustomUser
from eventmodule.models import  Comment, Reply,Ticket, TicketType, CustomUser, Event,EventRating,Notification,TicketPurchase,RSVP
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import datetime
import json
from django.db.models import Q
from django.shortcuts import render, get_object_or_404, render,redirect
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.decorators import login_required
from decimal import Decimal
from .utils import send_ticket_email
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import redirect
from .utils import get_average_rating
import qrcode
import os
from django.conf import settings
import uuid
import requests
import hmac
import hashlib
import base64

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


def create_notification(user, message, notification_type, url=None):
    Notification.objects.create(
        user=user,
        message=message,
        type=notification_type,
        url=url
    )






@csrf_exempt
def generate_signature(request):
    import json
    data = json.loads(request.body)
    total_amount = data.get('total_amount')
    transaction_uuid = str(uuid.uuid4())
    product_code = data.get('product_code')
    if total_amount:
        total_amount = str(total_amount).replace(',', '')
    secret_key = '8gBm/:&EnhH.1/q'
    signed_fields = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    secret_key = secret_key.encode('utf-8')
    signed_fields = signed_fields.encode('utf-8')
    hmac_sha256 = hmac.new(secret_key, signed_fields, hashlib.sha256)
    digest = hmac_sha256.digest()
    signature = base64.b64encode(digest).decode('utf-8')
    return JsonResponse({'signature': signature,'transaction_uuid':transaction_uuid})



def create_esewa_payment(amount):
    reference_id = str(uuid.uuid4())

    # Test URL for eSewa payment request
    esewa_url = 'https://uat.esewa.com.np/epay/main'  # Use this for UAT (test), replace with live URL for production.

    # Prepare data payload
    data = {
        'amt': amount,
        'pdc': 0,
        'psc': 0,
        'txAmt': 0,
        'tAmt': amount,
        'pid': reference_id,
        'scd': 'EPAYTEST',  # Your merchant code (get production code from eSewa for live)
        'su': 'http://127.0.0.1:8000/payment-success/',
        'fu': 'http://127.0.0.1:8000/payment-fail/',
    }

    # (Optional) If you want to hit and validate the request:
    response = requests.post(esewa_url, data=data)

    # For now, we return the URL (QR code will be generated from this)
    payment_url = f"{esewa_url}?amt={amount}&pdc=0&psc=0&txAmt=0&tAmt={amount}&pid={reference_id}&scd=EPAYTEST&su={data['su']}&fu={data['fu']}"
    print("URL:",payment_url);
    return payment_url, reference_id





def generate_payment_qr(amount, reference_id, payment_url):
   
    print("Amount:",amount)
    print("Reference id:",reference_id)
    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=5 
    )

   
    qr.add_data(payment_url)
    qr.make(fit=True)

   
    img = qr.make_image(fill='black', back_color='white')

   
    qr_code_folder = os.path.join(settings.MEDIA_ROOT, 'payment_qr_codes')

    
    if not os.path.exists(qr_code_folder):
        os.makedirs(qr_code_folder)

   
    file_name = f"payment_qr_{reference_id}.png"
    file_path = os.path.join(qr_code_folder, file_name)

    
    with open(file_path, 'wb') as f:
        img.save(f)
    
    return os.path.join('payment_qr_codes', file_name)






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
        event_image = request.FILES.get('event_image')
        

        organizer = get_object_or_404(CustomUser, Q(id=user.id) & Q(role__in=['organizer', 'admin']))
        

        
        new_event = Event.objects.create(
            title=event_name,
            description=event_description,
            event_date=event_date,
            event_time=event_time,
            location=event_location,
            has_ticket=has_ticket,
            event_image=event_image,
            organizer=organizer,
        )

        event_time_object = datetime.strptime(new_event.event_time, "%H:%M").time()
        formatted_event_time = datetime.combine(datetime.today(), event_time_object).strftime("%H:%M")

        response_data = {
            "success": True,
            "event_id": new_event.event_id,
            "created_at":new_event.created_at,
            "event_name": new_event.title,
            "event_description": new_event.description,
            "event_date":  new_event.event_date.strftime("%Y-%m-%d"),  
            "event_time": formatted_event_time,
            "event_location": new_event.location,
            "has_ticket": new_event.has_ticket,
            "event_image": new_event.event_image.url if new_event.event_image else None,
            "organizer_name": new_event.organizer.name,
            "role":organizer.role,
            "profile_picture": organizer.profile_picture.url if organizer.profile_picture else "/media/user_images/default.png",
        }

        return JsonResponse(response_data)

    return JsonResponse({"success": False, "message": "Invalid request"}, status=400)





def edit_event(request, event_id):
    event = get_object_or_404(Event, event_id=event_id)
    
    if request.method == 'POST':
        event_name = request.POST.get('event_name')
        event_date = request.POST.get('event_date')
        event_time = request.POST.get('event_time')
        event_location = request.POST.get('event_location')
        is_billboard = request.POST.get('is_billboard') == 'True'
        is_deleted = request.POST.get('is_deleted') == 'True'
        tickettype = request.POST.get('tickettype')

        if not event_name or not event_date or not event_time or not event_location:
            return JsonResponse({'success': False, 'message': 'Missing required fields'})

        
        event.title = event_name
        event.event_date = event_date
        event.event_time = event_time
        event.location = event_location
        event.is_billboard = is_billboard
        event.is_deleted = is_deleted
        event.tickettypeno = tickettype
        

        
        if request.FILES.get('event_image'):
            event.event_image = request.FILES['event_image']

        
        event.save()

        return JsonResponse({'success': True, 'message': 'Event updated successfully', 'event_id': event.event_id})

    return JsonResponse({'success': False, 'message': 'Failed to update event'})


@csrf_exempt
def delete_event(request, event_id):
    if request.method == "DELETE":
        event = get_object_or_404(Event, event_id=event_id)

        
        if request.user == event.organizer or request.user.role == "admin":
            event.is_deleted = True
            event.save()
            return JsonResponse({"success": True})
        else:
            return JsonResponse({"success": False, "error": "Permission denied."}, status=403)

    return JsonResponse({"success": False, "error": "Invalid request."}, status=400)







@login_required
def save_event(request, event_id):
    event = get_object_or_404(Event, event_id=event_id)
    user = request.user 

    if user in event.saved_by.all():
        return JsonResponse({"success": False, "message": "Event already saved!"})

    event.saved_by.add(user)
    return JsonResponse({"success": True, "message": "Event added to My Events!"})

@login_required
def remove_event(request, event_id):
    event = get_object_or_404(Event, event_id=event_id)
    user = request.user

    if user not in event.saved_by.all():
        return JsonResponse({"success": False, "message": "Event not in My Events!"})

    event.saved_by.remove(user)
    return JsonResponse({"success": True, "message": "Event removed from My Events!"})









@login_required
@user_passes_test(is_admin_or_organizer) 
def edit_event_view(request, event_id):
    event = get_object_or_404(Event, pk=event_id)

    tickets = TicketType.objects.filter(event=event)
    context = {
        'user': request.user,
        'event':event,
        'show_downbar': False,
        'tickets':tickets
    }
    return render(request, 'events/event_edit.html', context)



@csrf_exempt
def submit_rsvp(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        event_id = data.get("event_id")
        full_name = data.get("full_name")
        email = data.get("email")
        attendees = data.get("attendees")
        user=request.user
       

        try:
            event = Event.objects.get(pk=event_id)
            rsvp=RSVP.objects.create(
                user=user, 
                event=event,
                full_name=full_name,
                email=email,
                attendees=attendees
            )
            rsvp.save()
            rsvp_url = f"/rsvp/{rsvp.rsvp_url}/"
            if user in event.saved_by.all():
                event.saved_by.add(user)
            create_notification(
                    user=rsvp.user,
                    message = f"You have successfully RSVPed for the event: '{rsvp.event.title}'. We look forward to seeing you!",
                    notification_type='rsvp',
                    url=rsvp_url,
                )
            return JsonResponse({'success': True}, status=201)
        except Event.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Event not found'}, status=404)

    return JsonResponse({'success': False, 'message': 'Invalid request'}, status=405)




@csrf_exempt
def register_ticket(request):
    if request.method == 'POST':
        event_id = request.POST.get('event_id')
        try:
            event = Event.objects.get(event_id=event_id)
        except Event.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Event not found.'})
        
        ticket_name = request.POST.get('ticket_name')
        ticket_price = request.POST.get('ticket_price')

        try:
            ticket_price = Decimal(ticket_price)
        except (ValueError, TypeError):
            return JsonResponse({'success': False, 'message': 'Invalid ticket price.'})

        has_custom_date = request.POST.get('has_custom_date') == 'True'

        ticket_start_date = request.POST.get('ticket_start_date') if has_custom_date else event.created_at
        ticket_end_date = request.POST.get('ticket_end_date') if has_custom_date else event.event_date

        ticket = TicketType.objects.create(
            event=event,
            name=ticket_name,
            price=ticket_price,
            start_date=ticket_start_date,
            end_date=ticket_end_date
        )

        event_ticket_type_no=event.tickettypeno
        ticket_types_count = TicketType.objects.filter(event=event).count()

        response_data = {
            "success": True,
            "ticket_name": ticket.name,
            "ticket_price": str(ticket.price),
            "ticket_types_count": ticket_types_count,
            "ticket_types":event_ticket_type_no,
        }

        return JsonResponse(response_data)

    return JsonResponse({'success': False, 'message': 'Invalid request method.'})


# @csrf_exempt
# def submit_ticket_order(request):
#     if request.method == "POST":
#         data = json.loads(request.body)
#         total_price = data.get("totalPrice")
        
#         payment_url, reference_id = create_esewa_payment(total_price)
#         qr_code_url = generate_payment_qr(total_price, reference_id, payment_url)

        
#         return JsonResponse({
#             "success": True,
#             "message": "Ticket purchase successful!",
#             "qr_code_url": qr_code_url
#         })
    
#     return JsonResponse({"success": False, "error": "Invalid request method."})






@csrf_exempt
def submit_ticket_order(request):
    if request.method == "POST":
        data = json.loads(request.body)
        eventID = data.get("eventID")
        full_name = data.get("fullName")
        email = data.get("email")
        tickets_data = data.get("tickets")
        total_price = data.get("totalPrice")
        transaction_uuid = data.get('transactionUUID')

        user = request.user

        try:
            event = Event.objects.get(event_id=eventID)
        except Event.DoesNotExist:
            return JsonResponse({"success": False, "error": "Event not found!"})

        ticket = Ticket.objects.create(
            user=user,
            event=event,
            name=full_name,
            email=email,
            total_price=total_price,
            purchase_date=timezone.now(),
            transaction_uuid=transaction_uuid,
            payment_status='failed',
        )

        for ticket_data in tickets_data:
            ticket_id = ticket_data.get("ticketId")
            quantity = ticket_data.get("quantity")


            try:
                ticket_type = TicketType.objects.get(id=ticket_id)
            except TicketType.DoesNotExist:
                return JsonResponse({"success": False, "error": "Ticket type not found!"})

            event = ticket_type.event

            if not event.has_ticket:
                return JsonResponse({"success": False, "error": f"Tickets are not available for the event {event.title}."})

            ticket_type.purchased_by.add(user)

            TicketPurchase.objects.create(
                user=user,
                ticket=ticket,  
                ticket_type=ticket_type,
                quantity=quantity,
                purchase_date=timezone.now()
            )

        if event:
            ticket.event = event
            ticket.save()

        
        return JsonResponse({"success": True, "message": "Ticket purchase successful!"})

    return JsonResponse({"success": False, "error": "Invalid request method."})



@csrf_exempt

def payment_success(request):
    data = request.GET.get('data')
    if not data:
        return HttpResponse("OK")  

    try:
        # Decode and parse the payment data
        decoded_data = base64.b64decode(data).decode('utf-8')
        parsed_data = json.loads(decoded_data)

        # Verify signature
        received_signature = parsed_data.get('signature')
        signed_field_names = parsed_data.get('signed_field_names', '').split(',')

        signed_data_string = ",".join(
            f"{field}={parsed_data.get(field, '')}" for field in signed_field_names
        )

        secret_key = '8gBm/:&EnhH.1/q'
        calculated_signature = base64.b64encode(
            hmac.new(
                secret_key.encode(),
                signed_data_string.encode(),
                hashlib.sha256
            ).digest()
        ).decode()

        if received_signature != calculated_signature:
            return JsonResponse({"status": "failed", "message": "Invalid signature."})

        # Process payment if status is COMPLETE
        if parsed_data.get('status') == 'COMPLETE':
            transaction_uuid = parsed_data.get('transaction_uuid')

            try:
                ticket = Ticket.objects.get(transaction_uuid=transaction_uuid)
                ticket.payment_status = 'success'
                ticket.save()

                ticket_download_url = f"/ticket/{ticket.ticket_url}/"
                if ticket.user in ticket.event.saved_by.all():
                    ticket.event.saved_by.add(ticket.user)
                create_notification(
                    user=ticket.user,
                    message=f"Your ticket for '{ticket.event.title}' has been successfully purchased!",
                    notification_type='ticket_purchase',
                    url=ticket_download_url
                )

                send_ticket_email(ticket)

                return redirect(f'/events/detail/{ticket.event.event_id}/?payment=success')
            except Ticket.DoesNotExist:
                return JsonResponse({"status": "failed", "message": "Ticket not found."})

        else:
            return JsonResponse({"status": "failed", "message": "Payment not completed."})

    except Exception as e:
        print(f"Error processing payment data: {e}")
        return HttpResponse("Error processing payment data", status=400)









def payment_fail(request):
        event_id = request.GET.get('event_id')
        return redirect(f'/events/detail/{event_id}/?payment=failed')







@login_required
@csrf_exempt
def rate_event(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            event_id = data.get('event_id')
            rating_value = data.get('rating_value')
            comment = data.get('comment', "")

            event = get_object_or_404(Event, event_id=event_id)
            user = request.user
            event_rating, created = EventRating.objects.get_or_create(
                event=event,
                user=user,
                defaults={'rating': rating_value, 'comment': comment}
            )

            if not created:
                event_rating.rating = rating_value
                event_rating.comment = comment
                event_rating.save()

            avg_rating, total_ratings = get_average_rating(event)
            return JsonResponse({
                'success': True,
                'average_rating': avg_rating,
                'total_ratings': total_ratings,
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)




def mark_notification_as_read(request, notification_id):
    notification = get_object_or_404(Notification, id=notification_id, user=request.user)
    notification.is_read = True
    notification.save()

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'success': True})

    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))






@csrf_exempt
def add_comment(request):
    if request.method == 'POST':
        user = user_authenticated_or_respond(request)
        if isinstance(user, JsonResponse): 
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
            "role": user.role,
            "profile_picture": user.profile_picture.url if user.profile_picture else "/media/user_images/default.png",
            "commented_at": comment.commented_at.strftime("%Y-%m-%d %H:%M:%S"),
            "content": comment.content,
            "user_liked": False,
            "user_disliked": False,
            "likes_count": 0,
            "dislikes_count": 0
        })

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)

@csrf_exempt
def like_comment(request, comment_id):
    user = user_authenticated_or_respond(request)
    if isinstance(user, JsonResponse): 
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







@csrf_exempt
def add_reply(request):
    user = user_authenticated_or_respond(request)
    if isinstance(user, JsonResponse): 
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
                "role": user.role,
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

@csrf_exempt
def like_reply(request, reply_id):
    user = user_authenticated_or_respond(request)
    if isinstance(user, JsonResponse):
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

   
