from django.contrib import admin
from .models import BlogPost


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display   = ["title", "tag", "status", "views", "published_at", "created_at"]
    list_filter    = ["status", "tag"]
    search_fields  = ["title", "content", "excerpt"]
    list_editable  = ["status"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ["views", "created_at", "updated_at"]
    ordering       = ["-created_at"]

    fieldsets = [
        ("Content",   {"fields": ["title", "slug", "excerpt", "content", "cover_image"]}),
        ("Meta",      {"fields": ["tag", "read_time", "status", "published_at"]}),
        ("Stats",     {"fields": ["views", "created_at", "updated_at"]}),
    ]