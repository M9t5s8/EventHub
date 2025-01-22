from django.contrib import admin
from django.db import connection
from .models import  Organizer

# Action to delete selected records and reset ID counter for Organizer
def delete_and_reset_organizer(modeladmin, request, queryset):
    # Delete selected records
    queryset.delete()

    # Reset the auto-increment ID counter for All_Organizer table (specific to SQLite)
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='organizer_all_organizer';")

delete_and_reset_organizer.short_description = "Delete selected Organizer records and reset ID counter"

# Admin customization for All_Organizer
class OrganizerAdmin(admin.ModelAdmin):
    list_display = ('id', 'organizer_name', 'organizer_email', 'organizer_password')  
    search_fields = ('organizer_name', 'organizer_email')
    actions = [delete_and_reset_organizer]
    ordering = ('id',)  
    list_filter = ('organizer_email',)

   
# Register models in admin for Organizer
admin.site.register(Organizer, OrganizerAdmin)
