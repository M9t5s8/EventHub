from django.urls import path
from . import views
urlpatterns = [
    path('',views.home ,name='home'),
    path('contact/', views.contact_view, name='contact'),
    path('signup/', views.signup_view, name='signup'),
    path('login/',views.login_view, name='login'),
    path('register/',views.register_view,name='register'),
    path('about/',views.about,name='about'),
    path('events/',views.events,name='events'),
    path('ourteam/',views.ourteam,name='ourteam'),
]