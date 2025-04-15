
from django.http import JsonResponse
import json
from eventhub_user.models import CustomUser 
from django.contrib.auth import login
from django.contrib.auth.hashers import make_password
from django.contrib.auth import logout
from django.contrib.auth import authenticate
from .utils import generate_otp, send_otp_email
from django.core.cache import cache
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
from django.contrib.auth import update_session_auth_hash

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
                send_otp_email(email, otp)
                request.session['otp'] = otp
                cache.set(email, otp, timeout=600)  
                return JsonResponse({"success": True, "otp": otp}, status=200)
            else:
                return JsonResponse({"success":False}, status=200)

        except Exception as e:
            response_data = {"error": str(e)}
            return JsonResponse(response_data, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)






@csrf_exempt
def update_profile(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            profile_picture = request.FILES.get('profile_picture') 
            user = request.user 
            users = CustomUser.objects.filter(name=username.strip()).first()
            if users is None or user == users:
                pass
            else:
                print("Username already taken")
                return JsonResponse({'username_taken': True,'success':False})
            if username:
                user.name = username
            if profile_picture:
                user.profile_picture = profile_picture
            user.save()
            return JsonResponse({'success': True, 'username': user.name, 'profile_picture': user.profile_picture.url}) 

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'Invalid request method'})




def change_password(request):
    if request.method == 'POST':
        try:
            old_password = request.POST.get('old_password')
            new_password = request.POST.get('new_password')
            user = request.user
            if not check_password(old_password, user.password):
                return JsonResponse({'success': False, 'password_not_match': True})

            
            user.set_password(new_password)
            user.save()

            update_session_auth_hash(request, user)

            return JsonResponse({'success': True})

        except Exception as e:
            print(f"Error: {str(e)}")
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'error': 'Invalid request method'})








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
            name = data.get('username')

            user = CustomUser.objects.filter(name=name.strip()).first()
            if user is None:
                pass
            else:
                return JsonResponse({'username_taken': True,'success':False})
            hashed_password = make_password(password)
            user = CustomUser(email=email, password=hashed_password, name=name, role=role)
            user.save()
            authenticated_user = authenticate(request, email=email, password=password)

            if authenticated_user is not None:
                login(request, authenticated_user)
                return JsonResponse({"success":True,"message": "Account Created and Logged In!"}, status=200)
            else:
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
