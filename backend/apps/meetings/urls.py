from django.urls import path
from .views import MeetingListCreateView, AvailableSlotsView

urlpatterns = [
    path("",       MeetingListCreateView.as_view(), name="meetings-create"),
    path("slots/", AvailableSlotsView.as_view(),    name="meetings-slots"),
]