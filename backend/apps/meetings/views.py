from datetime import datetime, date as date_type
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings

from .models import Meeting, ALL_TIME_SLOTS
from .serializers import MeetingSerializer


class MeetingListCreateView(APIView):
    """
    POST /api/meetings/
    Book a new meeting slot.
    """

    def post(self, request):
        serializer = MeetingSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        meeting = serializer.save()
        self._send_emails(meeting)

        return Response(
            {
                "success": True,
                "id": meeting.id,
                "message": (
                    f"Meeting booked for {meeting.date} at {meeting.time}. "
                    "Check your email for confirmation."
                ),
            },
            status=status.HTTP_201_CREATED,
        )

    def _send_emails(self, meeting):
        contact_email = getattr(settings, "CONTACT_EMAIL", "mahmudolasunkami895@gmail.com")
        try:
            # Notification to Mahmud
            send_mail(
                subject=f"[Portfolio] New Meeting — {meeting.name}",
                message=(
                    f"Name:  {meeting.name}\n"
                    f"Email: {meeting.email}\n"
                    f"Date:  {meeting.date}\n"
                    f"Time:  {meeting.time} (WAT)\n"
                    f"Topic: {meeting.topic}\n"
                    f"Notes: {meeting.notes or 'None'}"
                ),
                from_email=contact_email,
                recipient_list=[contact_email],
                fail_silently=True,
            )
            # Confirmation to the booker
            send_mail(
                subject=f"Meeting Confirmed — {meeting.date} at {meeting.time}",
                message=(
                    f"Hi {meeting.name},\n\n"
                    f"Your meeting with Mahmud Bashir Olasunkanmi is confirmed.\n\n"
                    f"Date:  {meeting.date}\n"
                    f"Time:  {meeting.time} (WAT — Abuja, Nigeria)\n"
                    f"Topic: {meeting.topic}\n\n"
                    f"M.B.O WebDev\n"
                    f"mahmudolasunkami895@gmail.com"
                ),
                from_email=contact_email,
                recipient_list=[meeting.email],
                fail_silently=True,
            )
        except Exception:
            pass


class AvailableSlotsView(APIView):
    """
    GET /api/meetings/slots/?date=YYYY-MM-DD
    Returns which time slots are available and which are booked.
    """

    def get(self, request):
        date_str = request.query_params.get("date")

        if not date_str:
            return Response(
                {"error": "Provide a date query param: /api/meetings/slots/?date=2026-03-20"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            target = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {"error": "Date must be in YYYY-MM-DD format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if target < date_type.today():
            return Response({"date": date_str, "available": [], "booked": ALL_TIME_SLOTS})

        if target.weekday() >= 5:
            return Response({"date": date_str, "available": [], "booked": [], "note": "Weekend — no meetings."})

        booked = list(
            Meeting.objects.filter(date=target).values_list("time", flat=True)
        )
        available = [slot for slot in ALL_TIME_SLOTS if slot not in booked]

        return Response({
            "date":      date_str,
            "available": available,
            "booked":    booked,
        })