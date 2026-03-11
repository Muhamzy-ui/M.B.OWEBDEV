from django.db import models
from django.utils.text import slugify


class BlogPost(models.Model):
    STATUS_CHOICES = [
        ("draft",     "Draft"),
        ("published", "Published"),
    ]

    title       = models.CharField(max_length=200)
    slug        = models.SlugField(max_length=220, unique=True, blank=True)
    excerpt     = models.TextField(max_length=350, help_text="Short summary shown on the blog list.")
    content     = models.TextField(help_text="Full article content.")
    tag         = models.CharField(max_length=60, help_text="e.g. Django, React Native, PostgreSQL")
    read_time   = models.CharField(max_length=20, default="5 min")
    cover_image = models.ImageField(upload_to="blog/", null=True, blank=True)
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    views       = models.PositiveIntegerField(default=0, editable=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering        = ["-published_at", "-created_at"]
        verbose_name    = "Blog Post"
        verbose_name_plural = "Blog Posts"

    def save(self, *args, **kwargs):
        # Auto-generate slug from title if not set
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            n = 1
            while BlogPost.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.status.upper()}] {self.title}"