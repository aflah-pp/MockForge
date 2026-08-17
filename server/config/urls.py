from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

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
                path("dashboard/", include("dashboard.urls"), name="dashboard"),
                path("projects/", include("projects.urls"), name="projects"),
                path("generators/", include("generators.urls"), name="generators"),
                path("", include("runtime.urls"), name="runtime"),
            ]
        ),
    ),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
