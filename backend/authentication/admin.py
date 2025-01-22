from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    # Fields to display in the admin panel list view
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff', 'is_active')
    
    # Fields to filter by in the admin panel
    list_filter = ('role', 'is_staff', 'is_active')
    
    # Fields to use when editing or adding a user in the admin panel
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Role', {'fields': ('role',)}),  # Adding the custom role field
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Fields to show when creating a new user in the admin panel
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role'),
        }),
    )
    
    # Fields to search for in the admin panel
    search_fields = ('username', 'email', 'role')
    
    # Default ordering in the admin panel
    ordering = ('username',)

# Register the CustomUser model with the admin site
admin.site.register(CustomUser, CustomUserAdmin)



