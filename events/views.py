# events/views.py
from django.http import JsonResponse
import json
import random
from attender.models import Active_Attender,All_Attender
from organizer.models import Active_Organizer,All_Organizer
from contact.models import Contact
from eventmodule.models import Event
from datetime import datetime
from django.utils import timezone
from django.shortcuts import render, get_object_or_404

def event_detail(request, event_id):
    event = get_object_or_404(Event, event_id=event_id)  # Retrieve the event by its ID
    return render(request, 'events/event_detail.html', {'event': event})




# home page
def home(request):
    user_info = {}

    if request.session.get('user_logined'):
        user_id = request.session.get('user_id')  # Corrected access method
        user_role = request.session.get('user_role')  # Corrected access method
         
        try:
            if user_role == 'organizer':
                # Corrected: Use 'user.organizer.id' to access the organizer ID
                user = Active_Organizer.objects.get(organizer__id=user_id)
                username = user.organizer.organizer_name  # Access organizer's username
                email = user.organizer.organizer_email  # Access organizer's email
            elif user_role == 'attender':
                # Corrected: Use 'user.attender.id' to access the attender ID
                user = Active_Attender.objects.get(attender__id=user_id)
                username = user.attender.attender_username  # Access attender's username
                email = user.attender.attender_email  # Access attender's email
            else:
                raise ValueError("Invalid user role")

            user_info = {  # Initialize context here
                'username': username,
                'email': email,
                'role': user_role
            }
        except (Active_Organizer.DoesNotExist, Active_Attender.DoesNotExist):
            user_info['error'] = "User not found"
        except ValueError as ve:
            user_info['error'] = str(ve)

    context = {'user_info': user_info}
    return render(request, "events/index.html", context)



# about page
def about(request):
    user_info = {}

    if request.session.get('user_logined'):
        user_id = request.session.get('user_id')  # Corrected access method
        user_role = request.session.get('user_role')  # Corrected access method
         
        try:
            if user_role == 'organizer':
                # Corrected: Use 'user.organizer.id' to access the organizer ID
                user = Active_Organizer.objects.get(organizer__id=user_id)
                username = user.organizer.organizer_name  # Access organizer's username
                email = user.organizer.organizer_email  # Access organizer's email
            elif user_role == 'attender':
                # Corrected: Use 'user.attender.id' to access the attender ID
                user = Active_Attender.objects.get(attender__id=user_id)
                username = user.attender.attender_username  # Access attender's username
                email = user.attender.attender_email  # Access attender's email
            else:
                raise ValueError("Invalid user role")

            user_info = {  # Initialize context here
                'username': username,
                'email': email,
                'role': user_role
            }
        except (Active_Organizer.DoesNotExist, Active_Attender.DoesNotExist):
            user_info['error'] = "User not found"
        except ValueError as ve:
            user_info['error'] = str(ve)
    context = {'user_info': user_info}
    return render(request,"events/about.html",context)

# events page
def events(request):
    user_info = {}
    events = Event.objects.all()  # Fetch all events or apply filters as needed

    # Fetch user info if the user is logged in
    if request.session.get('user_logined'):
        user_id = request.session.get('user_id')
        user_role = request.session.get('user_role')

        try:
            if user_role == 'organizer':
                user = Active_Organizer.objects.get(organizer__id=user_id)
                username = user.organizer.organizer_name
                email = user.organizer.organizer_email
            elif user_role == 'attender':
                user = Active_Attender.objects.get(attender__id=user_id)
                username = user.attender.attender_username
                email = user.attender.attender_email
            else:
                raise ValueError("Invalid user role")

            user_info = {  # Initialize context here
                'username': username,
                'email': email,
                'role': user_role
            }
        except (Active_Organizer.DoesNotExist, Active_Attender.DoesNotExist):
            user_info['error'] = "User not found"
        except ValueError as ve:
            user_info['error'] = str(ve)

    context = {
        'user_info': user_info,  # Send user details to the template
        'events': events,  # Send event details to the template
    }

    return render(request, "events/events.html", context)







# ourteam page
def ourteam(request):
    user_info = {}

    if request.session.get('user_logined'):
        user_id = request.session.get('user_id')  # Corrected access method
        user_role = request.session.get('user_role')  # Corrected access method
         
        try:
            if user_role == 'organizer':
                # Corrected: Use 'user.organizer.id' to access the organizer ID
                user = Active_Organizer.objects.get(organizer__id=user_id)
                username = user.organizer.organizer_name  # Access organizer's username
                email = user.organizer.organizer_email  # Access organizer's email
            elif user_role == 'attender':
                # Corrected: Use 'user.attender.id' to access the attender ID
                user = Active_Attender.objects.get(attender__id=user_id)
                username = user.attender.attender_username  # Access attender's username
                email = user.attender.attender_email  # Access attender's email
            else:
                raise ValueError("Invalid user role")

            user_info = {  # Initialize context here
                'username': username,
                'email': email,
                'role': user_role
            }
        except (Active_Organizer.DoesNotExist, Active_Attender.DoesNotExist):
            user_info['error'] = "User not found"
        except ValueError as ve:
            user_info['error'] = str(ve)
    context = {'user_info': user_info}
    return render(request,"events/ourteam.html",context)



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
            if Active_Organizer.objects.filter(organizer__organizer_email=email).exists():
                user = Active_Organizer.objects.get(organizer__organizer_email=email)
                user_type = 'organizer'
            elif Active_Attender.objects.filter(attender__attender_email=email).exists():
                user = Active_Attender.objects.get(attender__attender_email=email)
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
                Active_Organizer.objects.filter(organizer__organizer_email=email).exists() or
                Active_Attender.objects.filter(attender__attender_email=email).exists()
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
                all_organizer_data = All_Organizer(
                    organizer_email=email,
                    organizer_password=password,
                    organizer_name=organizername
                )
                all_organizer_data.save()

                # Create Active_Organizer entry
                active_organizer_data = Active_Organizer(
                    organizer=all_organizer_data, 
                    organizer_email=email,
                    organizer_name=organizername,
                    organizer_password=password
                )
                active_organizer_data.save()

                # Save session data
                request.session['user_id'] = active_organizer_data.id
                request.session['user_role'] = 'organizer'
                request.session['user_logined'] = True

            elif role == 'attender':
                # Create All_Attender entry (store plain password)
                all_attender_data = All_Attender(
                    attender_email=email,
                    attender_password=password,
                    attender_username=username
                )
                all_attender_data.save()

                # Create Active_Attender entry
                active_attender_data = Active_Attender(
                    attender=all_attender_data, 
                    attender_email=email,
                    attender_username=username,
                    attender_password=password
                )
                active_attender_data.save()

                # Save session data
                request.session['user_id'] = active_attender_data.id
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
                organizer = All_Organizer.objects.get(id=user_id)  # Assuming 'user_id' is the field in All_Organizer
            except All_Organizer.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Organizer not found for this user.'})
            # Create a new Event object
            
            
            
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
