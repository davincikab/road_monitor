from django.contrib import admin
from .models import UserProfile

# Register your models here.
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'id_number', 'constituency','phone_number')
    list_filter = ('employee_status', 'ward', 'constituency')