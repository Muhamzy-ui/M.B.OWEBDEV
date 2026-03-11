from rest_framework import serializers
from .models import BlogPost


class BlogPostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for the blog list page — no full content."""
    class Meta:
        model  = BlogPost
        fields = [
            "id", "title", "slug", "excerpt", "tag",
            "read_time", "cover_image", "views", "published_at",
        ]


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """Full serializer for single post page — includes content."""
    class Meta:
        model  = BlogPost
        fields = "__all__"