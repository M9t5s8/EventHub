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
    path('ourteam/',views.ourteam,name='ourteam'),
    path('events/detail/<int:event_id>/', views.event_detail, name='event_detail'),
    path('ticket/<str:ticket_url>/', views.ticket_detail, name='ticket_detail'),
    path('event/<int:event_id>/tickets/', views.ticket_list_for_event, name='ticket_list_for_event'),
    

]









