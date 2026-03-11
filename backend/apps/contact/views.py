from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings

from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactMessageView(APIView):
    """
    POST /api/contact/
    Saves the message to the database and sends an email notification.
    """

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Save to database
        msg = serializer.save(
            ip_address=self._get_client_ip(request),
        )

        # Send email notification (prints to console in dev mode)
        self._send_notification(msg)

        return Response(
            {
                "success": True,
                "message": "Your message has been sent! Mahmud will reply within 24 hours.",
                "id": msg.id,
            },
            status=status.HTTP_201_CREATED,
        )

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")

    def _send_notification(self, msg):
        contact_email = getattr(settings, "CONTACT_EMAIL", "mahmudolasunkami895@gmail.com")
        try:
            # Email to Mahmud
            send_mail(
                subject=f"[Portfolio] New message from {msg.name}",
                message=(
                    f"Name:    {msg.name}\n"
                    f"Email:   {msg.email}\n"
                    f"Subject: {msg.subject or 'N/A'}\n\n"
                    f"Message:\n{msg.message}\n\n"
                    f"---\nIP: {msg.ip_address}"
                ),
                from_email=contact_email,
                recipient_list=[contact_email],
                fail_silently=True,
            )
        except Exception:
            # Never break the API because of email failure
            pass