from django.contrib import admin
from event.models import Event
class Event_admin(admin.ModelAdmin):
    list_display=('event_name','event_date','event_location','event_description')
admin.site.register(Event,Event_admin)