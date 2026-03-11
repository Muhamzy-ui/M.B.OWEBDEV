from django.contrib import admin
from .models import Meeting


@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display   = ["name", "email", "date", "time", "topic", "status", "created_at"]
    list_filter    = ["status", "date"]
    search_fields  = ["name", "email", "topic"]
    list_editable  = ["status"]
    readonly_fields = ["created_at"]
    ordering       = ["date", "time"]
    date_hierarchy = "date"

    fieldsets = [
        ("Booker",   {"fields": ["name", "email"]}),
        ("Schedule", {"fields": ["date", "time", "status"]}),
        ("Details",  {"fields": ["topic", "notes", "created_at"]}),
    ]