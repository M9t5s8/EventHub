
# events/views.py
from django.shortcuts import render
from django.http import JsonResponse
import json

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


def signup_view(request):
    if request.method == "POST":
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            # Print email and password to the console (or save to the database)
            print(f"Email: {email}, Password: {password}")

            return JsonResponse({"message": "Signup data received!"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method."}, status=405)