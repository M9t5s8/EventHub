from django.urls import path
from . import views
urlpatterns = [
    path('',views.home ,name='home'),
    path('contact/', views.contact_view, name='contact'),
    path('about/',views.about,name='about'),
    path('events/',views.events,name='events'),
    path('profile/',views.profile,name='profile'),
    path('my_events/',views.my_events,name='my_events'),
    path('upcoming_events/',views.upcoming_events,name='upcoming_events'),
    path('notifications/',views.notifications,name='notifications'),
    path('settings/',views.settings,name='settings'),
    path('ourteam/',views.ourteam,name='ourteam'),
    path('event_detail/<int:event_id>/', views.event_detail, name='event_detail'),
]









