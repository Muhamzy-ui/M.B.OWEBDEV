from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display   = ["name", "email", "subject", "status", "ip_address", "created_at"]
    list_filter    = ["status", "created_at"]
    search_fields  = ["name", "email", "subject", "message"]
    list_editable  = ["status"]
    readonly_fields = ["ip_address", "created_at"]
    ordering       = ["-created_at"]

    fieldsets = [
        ("Sender",  {"fields": ["name", "email", "ip_address"]}),
        ("Message", {"fields": ["subject", "message"]}),
        ("Status",  {"fields": ["status", "created_at"]}),
    ]