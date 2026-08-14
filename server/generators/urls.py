from django.urls import path

from .views import GeneratorListView

app_name = "generators"

urlpatterns = [
    path(
        "",
        GeneratorListView.as_view(),
        name="generator-list",
    ),
]
