from django.contrib import admin
from contact.models import Contact
class Contact_admin(admin.ModelAdmin):
    list_display=('contact_name','contact_email','contact_message')
admin.site.register(Contact,Contact_admin)

