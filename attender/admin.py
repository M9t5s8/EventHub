from django.contrib import admin
from django.db import connection
from .models import  Attender

# Action to delete selected records and reset ID counter for Attender
def delete_and_reset_attender(modeladmin, request, queryset):
    # Delete selected records
    queryset.delete()

    # Reset the auto-increment ID counter for All_Attender table (specific to SQLite)
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='attender_all_attender';")

delete_and_reset_attender.short_description = "Delete selected Attender records and reset ID counter"

# Admin customization for All_Attender
class AttenderAdmin(admin.ModelAdmin):
    list_display = ('id', 'attender_username', 'attender_email', 'attender_password')  
    search_fields = ('attender_username', 'attender_email')
    actions = [delete_and_reset_attender]
    ordering = ('attender_username',)  
    list_filter = ('attender_email',)

    

# Register models in admin for Attender
admin.site.register(Attender, AttenderAdmin)
