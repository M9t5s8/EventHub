from django.urls import path
from . import views
urlpatterns = [
    path('add_event/',views.add_event,name='add_event'),
    path('add_comment/', views.add_comment, name='comment'),
    path('comment/like/<int:comment_id>/', views.like_comment, name='like_comment'),
    path('comment/dislike/<int:comment_id>/', views.dislike_comment, name='dislike_comment'),
    path('add_reply/', views.add_reply, name='add_reply'),
    path('reply/like/<int:reply_id>/', views.like_reply, name='like_reply'),
    path('reply/dislike/<int:reply_id>/', views.dislike_reply, name='dislike_reply'),
    path("delete-event/<int:event_id>/", views.delete_event, name="delete_event"),
    path('events/edit/<int:event_id>/', views.edit_event_view, name='edit_event'),
    path('edit_event/<int:event_id>/', views.edit_event, name='edit_event_post'),
    path('register_ticket/', views.register_ticket, name='register_ticket'),
    path('save-event/<int:event_id>/', views.save_event, name='save_event'),
    path('remove-event/<int:event_id>/', views.remove_event, name='remove_event'),
    path('api/submit_ticket_order', views.submit_ticket_order, name='submit_ticket_order'),
    path('rate-event/', views.rate_event, name='rate_event'),
    path('notification/read/<int:notification_id>/', views.mark_notification_as_read, name='mark_notification_as_read'),
    path('generate-signature/', views.generate_signature, name='generate_signature'),
    path('payment-success/', views.payment_success, name='payment_success'),
    path('payment-fail/', views.payment_fail, name='payment_fail'),
    path('api/submit_rsvp', views.submit_rsvp, name='submit_rsvp'),
]