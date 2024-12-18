
# events/views.py
from django.shortcuts import render
from django.http import JsonResponse
import json
import random
from attender.models import Attender
from organizer.models import Organizer
from event.models import Event
from contact.models import Contact
from django.contrib.auth.hashers import check_password 






# home page
def home(request):
    return render(request, "events/index.html")  # Render the homepage template

# about page
def about(request):
    return render(request,"events/about.html")

# events page
def events(request):
    events = Event.objects.all() 
    
    
    print("Fetching events from the database:")
    for event in events:
        print(f"Event Title: {event.event_name}")  # Correct field name
        print(f"Event Date: {event.event_date}")  # Correct field name
        print(f"Event Location: {event.event_location}")  # Correct field name
        print(f"Event Description: {event.event_description}")  # Correct field name
        print("-" * 50)  # Separator between events for better readability
        
        
     
    context = {'events': events}
    return render(request,"events/events.html",context)

# ourteam page
def ourteam(request):
    return render(request,"events/ourteam.html")



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
            email_exists = False
            if Organizer.objects.filter(organizer_email=email).exists():
                user = Organizer.objects.get(organizer_email=email)
                user_type = 'organizer'
                email_exists = True
            elif Attender.objects.filter(attender_email=email).exists():
                user = Attender.objects.get(attender_email=email)
                user_type = 'attender'
                email_exists = True
            if not email_exists:
                return JsonResponse({"email_not_exists": True}, status=200)
            if user_type == 'organizer':
                if password==user.organizer_password:
                    return JsonResponse({"email_not_exists": False, "correct_pass": True}, status=200)
                else:
                    return JsonResponse({"email_not_exists": False, "correct_pass": False}, status=200)
            elif user_type == 'attender':
                print("Password from frontend:",password,"Password from backend:",user.attender_password)
                if password==user.attender_password:
                    return JsonResponse({"email_not_exists": False, "correct_pass": True}, status=200)
                else:
                    return JsonResponse({"email_not_exists": False, "correct_pass": False}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

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
                print("Email already exists")
                return JsonResponse({"check_for_email": True}, status=200)
            
            
            # Generate an OTP and store it in the session
            otp = random.randint(100000, 999999)
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

            print("Email:", email, "Password:", password, "Username:", username, "Role:", role, "Organizer name:", organizername)

            # Check for required fields based on role
            if not email or not password or not role:
                raise ValueError("Email, password, and role are required.")

            # Check if email already exists in either Organizer or Attender
            
            if role == 'organizer':
                if not organizername:
                    raise ValueError("Organizer name is required for the organizer role.")
                
                # Create and save Organizer data
                org_data = Organizer(
                    organizer_email=email,
                    organizer_password=password,
                    organizer_name=organizername
                )
                org_data.save()
            
            elif role == 'attender':
                if not username:
                    raise ValueError("Username is required for the attender role.")
                
                # Create and save Attender data
                atten_data = Attender(
                    attender_email=email,
                    attender_password=password,
                    attender_username=username
                )
                atten_data.save()

            else:
                raise ValueError("Invalid role specified.")



                messages.success(request, "Account created successfully!")
                return redirect('register_page')    
            
            return JsonResponse({"message": "Account Created!"}, status=200)

        except ValueError as e:
            # Handle specific value errors
            return JsonResponse({"error": str(e)}, status=400)
        except Exception as e:
            # Handle any other exceptions
            return JsonResponse({"error": "An unexpected error occurred."}, status=400)
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