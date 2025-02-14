from django.contrib import admin
from .models import Event
from .models import Comment,Reply

class EventAdmin(admin.ModelAdmin):
    list_display = (
        'event_id', 'title', 'event_date', 'event_time','organizer_email',
        'location', 'is_active', 'has_ticket', 'ticket_price', 'is_billboard', 'created_at'
    )
    search_fields = ('title', 'description', 'location', 'event_id', 'organizer__email')
    list_filter = ('event_date', 'organizer', 'event_time', 'is_active', 'has_ticket', 'is_billboard')
    ordering = ('event_date', 'event_time')
    fields = (
        'title', 'description', 'event_date', 'event_time', 'organizer', 'location', 
        'is_active', 'has_ticket', 'ticket_price', 'event_image', 'is_billboard'
    )
    def organizer_email(self, obj):
        return obj.organizer.email
    organizer_email.short_description = 'Organizer Email'




class CommentAdmin(admin.ModelAdmin):
    def like_count(self, obj):
        return obj.likes.count()
    
    def dislike_count(self, obj):
        return obj.dislikes.count()
    list_display = ('comment_id', 'user', 'event', 'content', 'commented_at')
    search_fields = ('user__email', 'event__title', 'content')
    list_filter = ('commented_at',)
    ordering = ('-commented_at',)


class ReplyAdmin(admin.ModelAdmin):
    def like_count(self, obj):
        return obj.likes.count()
    
    def dislike_count(self, obj):
        return obj.dislikes.count()

    list_display = ('reply_id', 'user', 'comment', 'content', 'replied_at', 'like_count', 'dislike_count')
    search_fields = ('user__email', 'comment__content', 'content')
    list_filter = ('replied_at',)
    ordering = ('-replied_at',)

admin.site.register(Reply, ReplyAdmin)














admin.site.register(Comment, CommentAdmin)
admin.site.register(Event, EventAdmin)
