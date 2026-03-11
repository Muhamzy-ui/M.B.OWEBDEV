from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import BlogPost
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer


class BlogPostListView(APIView):
    """
    GET /api/blog/
    GET /api/blog/?tag=Django
    Returns all published posts, optionally filtered by tag.
    """

    def get(self, request):
        qs = BlogPost.objects.filter(status="published")

        tag = request.query_params.get("tag")
        if tag:
            qs = qs.filter(tag__icontains=tag)

        serializer = BlogPostListSerializer(
            qs, many=True, context={"request": request}
        )
        return Response(serializer.data)


class BlogPostDetailView(APIView):
    """
    GET /api/blog/<slug>/
    Returns one published post and increments the view counter.
    """

    def get(self, request, slug):
        try:
            post = BlogPost.objects.get(slug=slug, status="published")
        except BlogPost.DoesNotExist:
            return Response(
                {"error": f"Post '{slug}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Increment view count without triggering full save()
        BlogPost.objects.filter(pk=post.pk).update(views=post.views + 1)
        post.views += 1

        serializer = BlogPostDetailSerializer(post, context={"request": request})
        return Response(serializer.data)