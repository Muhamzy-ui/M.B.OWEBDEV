from rest_framework import serializers
from datetime import date as date_type
from .models import Meeting


class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Meeting
        fields = [
            "id", "name", "email", "topic", "notes",
            "date", "time", "status", "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters.")
        return value.strip()

    def validate_topic(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Topic must be at least 3 characters.")
        return value.strip()

    def validate_email(self, value):
        return value.lower().strip()

    def validate_date(self, value):
        today = date_type.today()
        if value < today:
            raise serializers.ValidationError("Cannot book a meeting in the past.")
        if value.weekday() >= 5:
            raise serializers.ValidationError(
                "Meetings are only available Monday to Friday."
            )
        return value

    def validate(self, attrs):
        """Check that the selected date+time slot is not already booked."""
        qs = Meeting.objects.filter(date=attrs["date"], time=attrs["time"])
        # Exclude current instance when updating
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                {"time": "That slot is already booked. Please choose another time."}
            )
        return attrs