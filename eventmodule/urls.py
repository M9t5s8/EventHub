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
]