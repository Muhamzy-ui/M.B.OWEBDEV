"""
mbo_backend/urls.py
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def health(request):
    """Simple health-check endpoint — visit /api/ to confirm Django is running."""
    return JsonResponse({
        "status": "ok",
        "project": "M.B.O WebDev Backend",
        "developer": "Mahmud Bashir Olasunkanmi",
        "endpoints": {
            "contact":  "/api/contact/",
            "meetings": "/api/meetings/",
            "slots":    "/api/meetings/slots/?date=YYYY-MM-DD",
            "blog":     "/api/blog/",
            "admin":    "/admin/",
        },
    })


urlpatterns = [
    # Health check
    path("api/", health),

    # Admin
    path("admin/", admin.site.urls),

    # API apps
    path("api/contact/",  include("apps.contact.urls")),
    path("api/meetings/", include("apps.meetings.urls")),
    path("api/blog/",     include("apps.blog.urls")),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)