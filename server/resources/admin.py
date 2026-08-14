from django.contrib import admin

from .models import Fields, Resources


@admin.register(Resources)
class ResourcesAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "project",
        "is_published",
        "deleted_at",
        "created_at",
    )

    list_filter = (
        "is_published",
        "deleted_at",
    )

    search_fields = (
        "name",
        "slug",
        "project__name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "deleted_at",
        "deleted_by",
    )

    ordering = ("-created_at",)

    list_per_page = 25


@admin.register(Fields)
class FieldsAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "resource",
        "data_type",
        "generator_key",
        "display_order",
        "deleted_at",
        "created_at",
    )

    list_filter = (
        "data_type",
        "generator_key",
        "deleted_at",
    )

    search_fields = (
        "name",
        "slug",
        "resource__name",
        "resource__project__name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "deleted_at",
        "deleted_by",
    )

    ordering = (
        "resource",
        "display_order",
    )

    list_per_page = 25

    fieldsets = (
        (
            "Field",
            {
                "fields": (
                    "resource",
                    "name",
                    "slug",
                    "data_type",
                    "display_order",
                ),
            },
        ),
        (
            "Generator",
            {
                "fields": (
                    "generator_key",
                    "generator_options",
                ),
            },
        ),
        (
            "Audit",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                    "deleted_at",
                    "deleted_by",
                ),
            },
        ),
    )
