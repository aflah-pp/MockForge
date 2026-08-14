from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import FieldViewSet, ResourceViewSet

resource_router = DefaultRouter()

resource_router.register(
    "",
    ResourceViewSet,
    basename="resource",
)

field_router = DefaultRouter()

field_router.register(
    "",
    FieldViewSet,
    basename="field",
)


urlpatterns = [
    path(
        "",
        include(resource_router.urls),
    ),
    path(
        "<slug:resource_slug>/fields/",
        include(field_router.urls),
    ),
]
