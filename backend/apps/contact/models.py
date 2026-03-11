from django.db import models


class ContactMessage(models.Model):
    STATUS_CHOICES = [
        ("new",      "New"),
        ("read",     "Read"),
        ("replied",  "Replied"),
        ("archived", "Archived"),
    ]

    name       = models.CharField(max_length=100)
    email      = models.EmailField()
    subject    = models.CharField(max_length=200, blank=True, default="")
    message    = models.TextField()
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering        = ["-created_at"]
        verbose_name    = "Contact Message"
        verbose_name_plural = "Contact Messages"

    def __str__(self):
        return f"{self.name} — {self.subject or 'No subject'} ({self.created_at.strftime('%d %b %Y')})"