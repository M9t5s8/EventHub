from django.contrib import admin
from django.db import connection
from .models import Active_Attender, All_Attender

# Action to delete selected records and reset ID counter for Attender
def delete_and_reset_attender(modeladmin, request, queryset):
    # Delete selected records
    queryset.delete()

    # Reset the auto-increment ID counter for All_Attender table (specific to SQLite)
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='attender_all_attender';")

delete_and_reset_attender.short_description = "Delete selected Attender records and reset ID counter"

# Admin customization for All_Attender
class AllAttenderAdmin(admin.ModelAdmin):
    list_display = ('id', 'attender_username', 'attender_email', 'attender_password')  
    search_fields = ('attender_username', 'attender_email')
    actions = [delete_and_reset_attender]
    ordering = ('attender_username',)  
    list_filter = ('attender_email',)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if not change:
            active_attender_data = Active_Attender(attender=obj)
            active_attender_data.save()

# Admin customization for Active_Attender
class ActiveAttenderAdmin(admin.ModelAdmin):
    list_display = ('get_id', 'attender_username', 'attender_email', 'attender_password')  
    search_fields = ('attender_username', 'attender_email')
    list_filter = ('attender__attender_email',)  
    ordering = ('attender__attender_username',)

    def get_id(self, obj):
        return obj.attender.id  # Access the 'id' field from the related 'All_Attender'

    get_id.admin_order_field = 'attender__id'  # Allow sorting by the related 'id'
    get_id.short_description = 'ID'  # Set the display name for the column

    def attender_username(self, obj):
        return obj.attender.attender_username  # Access the related 'All_Attender' username

    def attender_email(self, obj):
        return obj.attender.attender_email  # Access the related 'All_Attender' email

    def attender_password(self, obj):
        return obj.attender.attender_password  # Access the related 'All_Attender' password

# Register models in admin for Attender
admin.site.register(All_Attender, AllAttenderAdmin)
admin.site.register(Active_Attender, ActiveAttenderAdmin)
