from django.contrib import admin
from attender.models import Attender
class Attender_admin(admin.ModelAdmin):
    list_display=('attender_username','attender_email','attender_password')
admin.site.register(Attender,Attender_admin)