
# events/views.py
from django.shortcuts import render

def home(request):
    return render(request, "events/index.html")  # Render the homepage template

def about(request):
    return render(request,"events/about.html")

def contactus(request):
    return render(request,"events/contactus.html")

def events(request):
    return render(request,"events/events.html")

def ourteam(request):
    return render(request,"events/ourteam.html")