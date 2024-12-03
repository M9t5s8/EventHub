from django.contrib import admin
from organizer.models import Organizer
class Organizer_admin(admin.ModelAdmin):
    list_display=('organizer_name','organizer_email','organizer_password')
admin.site.register(Organizer,Organizer_admin)

