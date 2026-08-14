from django.urls import path

from .views import RuntimeAPIView

urlpatterns = [
    path(
        "<slug:project_slug>/<slug:resource_slug>/",
        RuntimeAPIView.as_view(),
        name="runtime-resource",
    ),
]
