from django.contrib import admin
from django import forms
from .models import Event, Comment, Reply, TicketType, Ticket, TicketPurchase,EventRating,Notification


class EventAdmin(admin.ModelAdmin):
    list_display = (
        'event_id', 'title', 'event_date', 'event_time', 'organizer_email',
        'location', 'is_active', 'has_ticket', 'is_billboard', 'created_at', 'is_deleted', 'tickettypeno', 'saved_by_users'
    )
    search_fields = ('title', 'description', 'location', 'event_id', 'organizer__email')
    list_filter = ('event_date', 'organizer', 'event_time', 'is_active', 'has_ticket', 'is_billboard')
    ordering = ('event_date', 'event_time')
    fields = (
        'title', 'description', 'event_date', 'event_time', 'organizer', 'location', 
        'is_active', 'has_ticket', 'event_image', 'is_billboard'
    )
    
    def organizer_email(self, obj):
        return obj.organizer.email
    organizer_email.short_description = 'Organizer Email'

    def saved_by_users(self, obj):
        return ", ".join([user.email for user in obj.saved_by.all()])
    saved_by_users.short_description = 'Saved By Users'

admin.site.register(Event, EventAdmin)


class CommentAdmin(admin.ModelAdmin):
    def like_count(self, obj):
        return obj.likes.count()
    
    def dislike_count(self, obj):
        return obj.dislikes.count()

    list_display = ('comment_id', 'user', 'event', 'content', 'commented_at', 'like_count', 'dislike_count')
    search_fields = ('user__email', 'event__title', 'content')
    list_filter = ('commented_at',)
    ordering = ('-commented_at',)
admin.site.register(Comment, CommentAdmin)


class ReplyAdmin(admin.ModelAdmin):
    def like_count(self, obj):
        return obj.likes.count()
    
    def dislike_count(self, obj):
        return obj.dislikes.count()

    list_display = ('reply_id', 'user', 'comment', 'content', 'replied_at', 'like_count', 'dislike_count')
    search_fields = ('user__email', 'comment__content', 'content')
    list_filter = ('replied_at',)
    ordering = ("-replied_at",)  # FIXED
admin.site.register(Reply, ReplyAdmin)


class TicketTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "event", "start_date", "end_date") 
    search_fields = ("name", "event__title") 
    list_filter = ("event", "start_date", "end_date")
admin.site.register(TicketType, TicketTypeAdmin)


class TicketAdminForm(forms.ModelForm):
    class Meta:
        model = Ticket
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['event'].queryset = Event.objects.filter(has_ticket=True)

        self.fields['ticket_type'].queryset = TicketType.objects.none()

       
        if 'event' in self.data:
            try:
                event_id = int(self.data.get('event'))
                self.fields['ticket_type'].queryset = TicketType.objects.filter(event_id=event_id)
            except (ValueError, TypeError):
                pass 
        elif self.instance.pk:
            self.fields['ticket_type'].queryset = TicketType.objects.filter(event=self.instance.event)



@admin.register(TicketPurchase)
class TicketPurchaseAdmin(admin.ModelAdmin):
    def user_id(self, obj):
        return obj.user.id if obj.user else "-"
    user_id.short_description = 'User ID'

    list_display = ('user_id', 'ticket_type', 'quantity', 'purchase_date')
    search_fields = ('user__name', 'ticket_type__name')
    list_filter = ('purchase_date', 'ticket_type')


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    def user_id(self, obj):
        return obj.user.id if obj.user else "-"
    user_id.short_description = 'User ID'

    list_display = ('ticket_url','id', 'user_id', 'event', 'name', 'email', 'total_price', 'purchase_date')
    list_filter = ('purchase_date', 'event')
    search_fields = ('name', 'email', 'event__title', 'user__name')

    readonly_fields = ('id', 'purchase_date')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'type', 'is_read', 'created_at')
    list_filter = ('is_read', 'type', 'created_at')
    search_fields = ('user__name', 'message', 'type')
    ordering = ('-created_at',)






@admin.register(EventRating)
class EventRatingAdmin(admin.ModelAdmin):
    def user_id(self, obj):
        return obj.user.id if obj.user else "-"
    user_id.short_description = 'User ID'

    def event_title(self, obj):
        return obj.event.title if obj.event else "-"
    event_title.short_description = 'Event Title'

    list_display = ('user_id', 'event_title', 'rating', 'comment', 'rated_at')
    search_fields = ('user__name', 'event__title', 'rating')
    list_filter = ('rating', 'event', 'rated_at')

    readonly_fields = ('rated_at',)
