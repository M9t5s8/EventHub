# events/views.py
from django.http import JsonResponse
import json
import random
from attender.models import Attender
from organizer.models import Organizer
from contact.models import Contact
from eventmodule.models import Event
from django.shortcuts import render, get_object_or_404

def event_detail(request, event_id):
    event = get_object_or_404(Event, event_id=event_id)  # Retrieve the event by its ID
    return render(request, 'events/event_detail.html', {'event': event})


def get_user_info(request):
    user_info = {}
    if request.session.get('user_logined'):
        user_id = request.session.get('user_id')
        user_role = request.session.get('user_role')
        try:
            if user_role == 'organizer':
                user = Organizer.objects.get(id=user_id)
                print("Name:",user.organizer_name)
                username = user.organizer_name
                email = user.organizer_email
            elif user_role == 'attender':
                user = Attender.objects.get(id=user_id)
                username = user.attender_username
                email = user.attender_email
            else:
                raise ValueError("Invalid user role")

            user_info = {
                'username': username,
                'email': email,
                'role': user_role
            }
        except (Organizer.DoesNotExist, Attender.DoesNotExist):
            user_info['error'] = "User not found"
        except ValueError as ve:
            user_info['error'] = str(ve)
    return user_info


def home(request):
    user_info = get_user_info(request) 
    
    context = {
        'user_info': user_info,
        'show_downbar':False
    }
    return render(request, "events/index.html", context)

# about page
def about(request):
    user_info = get_user_info(request)  # Get the user info
    context = {
        'user_info': user_info,
        'show_downbar':False
        }
    return render(request, "events/about.html", context)

# events page
def events(request):
    user_info = get_user_info(request)  # Get the user info
    events = Event.objects.all()  # Fetch all events or apply filters as needed
    context = {
        'user_info': user_info,  # Send user details to the template
        'events': events,
        'show_downbar':False
    }
    return render(request, "events/events.html", context)

# ourteam page
def ourteam(request):
    user_info = get_user_info(request)
    context = {
        'user_info': user_info,
        'show_downbar':False
        }
    return render(request, "events/ourteam.html", context)

# profile page
def profile(request):
    user_info = get_user_info(request)  # Get the user info
    context = {
        'user_info': user_info,
        'show_downbar':True
        }
    return render(request, "events/profile.html", context)

# upcoming events page
def upcoming_events(request):
    user_info = get_user_info(request)  # Get the user info
    context = {
        'user_info': user_info,
        'show_downbar':True
        }
    return render(request, "events/upcoming_events.html", context)

# my events page
def my_events(request):
    user_info = get_user_info(request)  # Get the user info
    context = {
        'user_info': user_info,
        'show_downbar':True
        }
    return render(request, "events/my_events.html", context)

# notifications page
def notifications(request):
    user_info = get_user_info(request) 
    events = Event.objects.all() 
    context = {
        'user_info': user_info,
        'events': events,
        'show_downbar':True
    }
    return render(request, "events/notifications.html", context)

# settings page
def settings(request):
    user_info = get_user_info(request)  # Get the user info
    context = {
        'user_info': user_info,
        'show_downbar':True
        }
    return render(request, "events/setting.html", context)





# this is all for the form submission in the database
# login view
def login_view(request):
    if request.method == "POST":
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            user = None
            user_type = None
            
            
            
            
            
            # Check if email belongs to an Active_Organizer
            if Organizer.objects.filter(organizer_email=email).exists():
                user = Organizer.objects.get(organizer_email=email)
                user_type = 'organizer'
            elif Attender.objects.filter(attender_email=email).exists():
                user = Attender.objects.get(attender_email=email)
                user_type = 'attender'
            else:
                return JsonResponse({"email_not_exists": True}, status=200)


            if user_type == 'organizer':
                if user.organizer.organizer_password == password:
                    request.session['user_id'] = user.organizer.id
                    request.session['user_role']= user_type
                    request.session['user_logined']=True
                    return JsonResponse({"email_not_exists": False, "correct_pass": True}, status=200)
                else:
                    return JsonResponse({"email_not_exists": False, "correct_pass": False}, status=200)

            elif user_type == 'attender':
                if user.attender.attender_password == password:
                    request.session['user_id'] = user.attender.id
                    request.session['user_role']= user_type
                    request.session['user_logined']=True
                    return JsonResponse({"email_not_exists": False, "correct_pass": True}, status=200)
                else:
                    return JsonResponse({"email_not_exists": False, "correct_pass": False}, status=200)

        
        except Exception as e:
            # Handle any exceptions that occur during the process
            return JsonResponse({"error": str(e)}, status=400)

    # Return response for invalid request method
    return JsonResponse({"error": "Invalid request method."}, status=405)



# signup view
def signup_view(request):
    if request.method == "POST":
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            # Check if the email already exists in either Organizer or Attender
            email_exists = (
                Organizer.objects.filter(organizer_email=email).exists() or
                Attender.objects.filter(attender_email=email).exists()
            )
            if email_exists:
                return JsonResponse({"check_for_email": True}, status=200)
            
            
            # Generate an OTP and store it in the session
            otp = random.randint(100000, 999999)
            print("OTP:",otp)
            request.session['otp'] = otp

            # Return a success response with the OTP
            return JsonResponse({
                "check_for_email":False,
                "email_signup": email,
                "otp": otp,
                "email": email,
                "password_signup": password,
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data provided."}, status=400)
        except Exception as e:
            # Log the exception for debugging
            print("Error in signup_view:", str(e))
            return JsonResponse({"error": "An unexpected error occurred."}, status=500)

    # Handle non-POST requests
    return JsonResponse({"error": "Invalid request method."}, status=405)


# register view
def register_view(request):
    if request.method == "POST":
        try:
            # Parse request body
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            username = data.get('username')
            organizername = data.get('organizername')
            role = data.get('role')

            if role == 'organizer':
                # Create All_Organizer entry (store plain password)
                organizer_data = Organizer(
                    organizer_email=email,
                    organizer_password=password,
                    organizer_name=organizername
                )
                organizer_data.save()
                # Save session data
                request.session['user_id'] = organizer_data.id
                request.session['user_role'] = 'organizer'
                request.session['user_logined'] = True

            elif role == 'attender':
                # Create All_Attender entry (store plain password)
                attender_data = Attender(
                    attender_email=email,
                    attender_password=password,
                    attender_username=username
                )
                attender_data.save()

                # Save session data
                request.session['user_id'] = attender_data.id
                request.session['user_role'] = 'attender'
                request.session['user_logined'] = True

            return JsonResponse({"message": "Account Created!"}, status=200)

        except ValueError as e:
            # Handle specific value errors
            return JsonResponse({"error": str(e)}, status=400)
        except json.JSONDecodeError:
            # Handle invalid JSON
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            # Handle any other exceptions
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)




# contact view
def contact_view(request):
    # to get the form value as the post method
    if request.method == "POST":
        try:
            
            # getting the data from the js
            data = json.loads(request.body)
            email = data.get('email')
            name = data.get('name')
            message=data.get('message')

            
            # entering the data in the database
            contact_data = Contact(
                    contact_email=email,
                    contact_name=name,
                    contact_message=message
            )
            contact_data.save()
            
            # to display the contact successful message
            return JsonResponse({"message": "Contact data saved successfully."}, status=200)


        # to give the error according to the case
        except ValueError as e:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": "An unexpected error occurred."}, status=400)

    return JsonResponse({"error": "Only POST requests are allowed."}, status=405)



def add_event_view(request):
    if request.method == 'POST':
        try:
            # Parse the JSON body of the request
            data = json.loads(request.body)
            title = data.get('event_name')
            description = data.get('event_description')
            event_date = data.get('event_date')
            event_time = data.get('event_time')
            location = data.get('event_location')

            user_id = request.session.get('user_id')
            try:
                organizer = Organizer.objects.get(id=user_id)
            except Organizer.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Organizer not found for this user.'})
            event = Event(
                title=title,
                description=description,
                event_date=event_date,
                event_time=event_time,
                location=location,
                organizer=organizer,
            )
            event.save()
            

            return JsonResponse({'success': True, 'message': 'Event created successfully.'})

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})











def logout_view(request):
    try:
        # Clear session data
        request.session.flush()  # This will remove all session data
        return JsonResponse({"success": True}, status=200)  # Replace 'home' with the actual URL name for your homepage or login page
    except Exception as e:
        # Handle any errors that may occur
        return JsonResponse({"error": str(e)}, status=400)
