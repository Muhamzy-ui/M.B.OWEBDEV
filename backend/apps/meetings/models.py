from django.db import models


ALL_TIME_SLOTS = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
]

TIME_CHOICES = [(t, t) for t in ALL_TIME_SLOTS]


class Meeting(models.Model):
    STATUS_CHOICES = [
        ("pending",   "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    name   = models.CharField(max_length=100)
    email  = models.EmailField()
    topic  = models.CharField(max_length=200)
    notes  = models.TextField(blank=True, default="")
    date   = models.DateField()
    time   = models.CharField(max_length=10, choices=TIME_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering        = ["date", "time"]
        unique_together = [["date", "time"]]   # No double-booking
        verbose_name    = "Meeting"
        verbose_name_plural = "Meetings"

    def __str__(self):
        return f"{self.name} — {self.date} at {self.time}"