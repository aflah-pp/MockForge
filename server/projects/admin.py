from django.contrib import admin

from .models import Projects


@admin.register(Projects)
class ProjectsAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "owner",
        "is_published",
        "created_at",
        "updated_at",
    )
    list_filter = ("is_published",)
    search_fields = (
        "name",
        "slug",
        "owner__email",
    )
    readonly_fields = (
        "slug",
        "created_at",
        "updated_at",
    )
