from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, PredictionHistory


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'phone', 'location', 'is_staff', 'date_joined']
    list_filter = ['is_staff', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']

    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('phone', 'location')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Extra Info', {'fields': ('email', 'first_name', 'last_name', 'phone', 'location')}),
    )


@admin.register(PredictionHistory)
class PredictionHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'predicted_crop', 'nitrogen', 'phosphorus', 'potassium',
                    'temperature', 'humidity', 'ph', 'rainfall', 'created_at']
    list_filter = ['predicted_crop', 'created_at']
    search_fields = ['user__username', 'user__email', 'predicted_crop']
    ordering = ['-created_at']
    readonly_fields = ['created_at']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
