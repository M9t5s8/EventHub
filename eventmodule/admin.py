from django.contrib import admin
from .models import Event

class EventAdmin(admin.ModelAdmin):
    
    list_display = ('event_id', 'title', 'event_date', 'event_time', 'organizer', 'location')
    search_fields = ('title', 'description', 'location', 'event_id', 'organizer__name')
    list_filter = ('event_date', 'organizer', 'event_time')
    ordering = ('event_date', 'event_time')
    fields = ('title', 'description', 'event_date', 'event_time', 'organizer', 'location')
admin.site.register(Event, EventAdmin)

