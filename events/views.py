
# events/views.py
from django.shortcuts import render
from django.http import JsonResponse
import json
import random
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from attender.models import Attender
from organizer.models import Organizer


def home(request):
    return render(request, "events/index.html")  # Render the homepage template

def about(request):
    return render(request,"events/about.html")

def contactus(request):
    return render(request,"events/contactus.html")

# def events(request):
#     return render(request,"events/events.html")

def ourteam(request):
    return render(request,"events/ourteam.html")


# login view
def login_view(request):
    if request.method == "POST":
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            print("Email:",email,"Passowrd:",password)
            return JsonResponse({"message": "Login successful!"}, status=200)
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

            otp = random.randint(100000, 999999)
            request.session['otp'] = otp 
            print("Generated OTP:", otp)
            return JsonResponse({
                "email_signup": email,
                "otp": otp,
                "email": email,
                "password_signup": password, 
                    }, status=200)
 
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method."}, status=405)

# register view
def register_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email=data.get('email')
            password=data.get('password')
            username = data.get('username')
            role = data.get('role')
            print("Email:",email,"Password:",password,"Username:", username,"Role:",role) 
            
            
            
            if not email or not password or not username or not role:
                raise ValueError("Missing required fields")
            
            if role == 'organizer':
                org_data = Organizer(
                    organizer_email=email,
                    organizer_password=password,
                    organizer_name=username
                )
                org_data.save()
            else:
                atten_data = Attender(
                    attender_email=email,
                    attender_password= password,
                    attender_username=username
                )
                atten_data.save()
                
            
            
           
           
           
           
           
            return JsonResponse({"message": "Account Created!"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method."}, status=405)