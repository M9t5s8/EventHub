from django.contrib import admin
from django.db import connection
from .models import Active_Organizer, All_Organizer

# Action to delete selected records and reset ID counter for Organizer
def delete_and_reset_organizer(modeladmin, request, queryset):
    # Delete selected records
    queryset.delete()

    # Reset the auto-increment ID counter for All_Organizer table (specific to SQLite)
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='organizer_all_organizer';")

delete_and_reset_organizer.short_description = "Delete selected Organizer records and reset ID counter"

# Admin customization for All_Organizer
class AllOrganizerAdmin(admin.ModelAdmin):
    list_display = ('id', 'organizer_name', 'organizer_email', 'organizer_password')  
    search_fields = ('organizer_name', 'organizer_email')
    actions = [delete_and_reset_organizer]
    ordering = ('id',)  
    list_filter = ('organizer_email',)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if not change:
            active_organizer_data = Active_Organizer(organizer=obj)
            active_organizer_data.save()

# Admin customization for Active_Organizer
class ActiveOrganizerAdmin(admin.ModelAdmin):
    list_display = ('get_id', 'organizer_name', 'organizer_email', 'organizer_password')  
    search_fields = ('organizer__organizer_name', 'organizer__organizer_email')  # Correct field references for search
    list_filter = ('organizer__organizer_email',)  # Correct field reference for filtering
    ordering = ('organizer__organizer_name',)  # Correct field reference for ordering

    def get_id(self, obj):
        return obj.organizer.id  # Access the 'id' field from the related 'All_Organizer'

    get_id.admin_order_field = 'id'  # Allow sorting by the related 'id'
    get_id.short_description = 'ID'  # Set the display name for the column

    def organizer_name(self, obj):
        return obj.organizer.organizer_name  # Access the related 'All_Organizer' name

    def organizer_email(self, obj):
        return obj.organizer.organizer_email  # Access the related 'All_Organizer' email

    def organizer_password(self, obj):
        return obj.organizer.organizer_password  # Access the related 'All_Organizer' password


# Register models in admin for Organizer
admin.site.register(All_Organizer, AllOrganizerAdmin)
admin.site.register(Active_Organizer, ActiveOrganizerAdmin)
