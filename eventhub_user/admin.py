from django.contrib import admin
from .models import CustomUser

class CustomUserAdmin(admin.ModelAdmin):
    ordering = ['email']
    list_display = ['id', 'email', 'name', 'role', 'is_staff', 'is_active', 'joined_at']
    search_fields = ['email', 'name']
    list_filter = ['role', 'is_active', 'is_staff', 'joined_at']

admin.site.register(CustomUser, CustomUserAdmin)
