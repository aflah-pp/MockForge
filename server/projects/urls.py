from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ProjectViewSet

router = DefaultRouter()

router.register(
    "",
    ProjectViewSet,
    basename="project",
)


urlpatterns = [
    path(
        "",
        include(router.urls),
    ),
    path(
        "<slug:project_slug>/resources/",
        include("resources.urls"),
    ),
]
