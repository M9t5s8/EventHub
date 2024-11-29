
# events/views.py
from django.shortcuts import render

def home(request):
    return render(request, "events/index.html")  # Render the homepage template

def aboutus(request):
    return render(request,"events/aboutus.html")

def contact(request):
    return render(request,"events/contact.html")