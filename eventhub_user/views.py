from django.shortcuts import render
from django.http import JsonResponse
import json
import random
from eventhub_user.models import CustomUser 
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import logout
from django.contrib.auth import authenticate
from .utils import generate_otp, send_otp_email
from django.core.cache import cache

def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email, password = data.get('email'), data.get('password')

            user = CustomUser.objects.filter(email=email.strip()).first()

            if user is None:
                response_data = {"email_exists": False}
                return JsonResponse(response_data, status=200)

            
            user = authenticate(request, email=email, password=password)
            
            if user is not None:
                login(request, user)
                response_data = {"email_exists": True, "correct_pass": True}
                return JsonResponse(response_data, status=200)
            else:
                response_data = {"email_exists": True, "correct_pass": False}
                return JsonResponse(response_data, status=200)

        except Exception as e:
            response_data = {"error": str(e)}
            return JsonResponse(response_data, status=400)

    return JsonResponse({"error": "Invalid request method."}, status=405)






def send_otp(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get('email')
        
            if email:
                otp = generate_otp()
                print("Otp:",otp)
                send_otp_email(email, otp)
                request.session['otp'] = otp
                print("Pass from here")
                cache.set(email, otp, timeout=600)  
                print("stuck here")
                return JsonResponse({"success": True, "otp": otp}, status=200)

            else:
                return JsonResponse({"success":False}, status=200)

        except Exception as e:
            response_data = {"error": str(e)}
            return JsonResponse(response_data, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)














def signup_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            user = CustomUser.objects.filter(email=email.strip()).first()
            if user is None:
                pass
            else:
                return JsonResponse({"email_exists": True}, status=200)


           
            
            

            
            return JsonResponse({"email_exists": False, "password_signup": password, "email_signup": email}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)




def register_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email, password, role = data.get('email'), data.get('password'), data.get('role')


            print(f"Email: {email}")
            print(f"Password: {password}")
            print(f"Role: {role}")

            if role == 'organizer':
                name = data.get('organizername')
            else:
                name = data.get('username')


            print(f"Name: {name}")

            
            hashed_password = make_password(password)
            print("Hello")
            user = CustomUser(email=email, password=hashed_password, name=name, role=role)
            user.save()
            authenticated_user = authenticate(request, email=email, password=password)

            if authenticated_user is not None:
                login(request, authenticated_user)
                print("Account Created and Logged In!")
                return JsonResponse({"message": "Account Created and Logged In!"}, status=200)
            else:
                print("Authentication failed after registration.")
                return JsonResponse({"error": "Authentication failed after registration."}, status=500)
            

            return JsonResponse({"message": "Account Created!"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)













def logout_view(request):
    try:
        logout(request)
        return JsonResponse({"success": True}, status=200)
    except Exception as e:
        
        return JsonResponse({"error": str(e)}, status=400)
