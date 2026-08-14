from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from .views import server_status

admin.site.site_header = "MockForge Administration"
admin.site.index_title = "Admin Services"
admin.site.site_title = "MockForge"


urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/v1/",
        include(
            [
                path("status/", server_status, name="server status"),
                path("users/", include("users.urls"), name="users"),
                path("projects/", include("projects.urls"), name="projects"),
                path(
                    "generators/",
                    include("generators.urls"),
                ),
                path("", include("runtime.urls"), name="runtime"),
            ]
        ),
    ),
]

if settings.DEBUG:
    urlpatterns += [
        path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
        path(
            "api/docs/",
            SpectacularSwaggerView.as_view(url_name="schema"),
            name="swagger-docs",
        ),
    ]
