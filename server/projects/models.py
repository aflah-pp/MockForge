from django.db import models
from django.utils.text import slugify

from shared.models import AuditMixin, UUIDPrimaryKeyMixin


class Projects(UUIDPrimaryKeyMixin, AuditMixin):
    """
    Represents a MockForge project owned by a single user.

    Audit metadata is inherited from AuditMixin.
    """

    owner = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="projects",
        help_text="User who owns this project.",
    )

    name = models.CharField(
        max_length=50,
        help_text="Human-readable name of the project.",
    )

    slug = models.SlugField(
        max_length=100,
        db_index=True,
        help_text="URL-safe identifier unique within the owner's projects.",
    )

    is_published = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Whether this project is publicly available through its mock API.",
    )

    class Meta:
        """
        Database constraints, indexes, and default ordering for projects.
        """

        constraints = [
            models.UniqueConstraint(
                fields=["owner", "slug"],
                name="unique_owner_project_slug",
            ),
        ]

        indexes = [
            models.Index(
                fields=["owner", "updated_at"],
                name="project_owner_updated_idx",
            ),
            models.Index(
                fields=["slug", "is_published"],
                name="project_slug_published_idx",
            ),
        ]

        ordering = ["-updated_at"]

    def save(self, *args, **kwargs):
        if self.slug:
            self.slug = slugify(self.slug)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.slug})"
