import uuid

from django.conf import settings
from django.db import models


class UUIDPrimaryKeyMixin(models.Model):
    """
    Provides a UUID primary key for application models.

    UUIDs provide non-sequential identifiers that are suitable for
    resources exposed through public APIs.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    class Meta:
        abstract = True


class AuditMixin(models.Model):
    """
    Provides common lifecycle and audit metadata for application records.

    Tracks when a record was created, updated, or soft-deleted and which
    authenticated application user performed each operation.

    Audit fields are populated by the application service layer.
    Models do not access HTTP requests or request.user directly.

    Deletion fields provide metadata for future soft-delete support.
    They do not change Django's default delete behavior.
    """

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(app_label)s_%(class)s_created",
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(app_label)s_%(class)s_updated",
    )

    deleted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(app_label)s_%(class)s_deleted",
    )

    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
        db_index=True,
    )

    class Meta:
        abstract = True
