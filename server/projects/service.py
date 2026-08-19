import logging

from django.core.exceptions import ValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.text import slugify

from .models import Projects

logger = logging.getLogger(__name__)


class ProjectService:
    """
    Service layer for Mokvio project business logic.
    """

    @staticmethod
    def get_user_projects(user):
        """
        Return all active projects owned by the specified user.

        Soft-deleted projects are excluded from normal project
        listings.
        """

        return Projects.objects.filter(
            owner=user,
            deleted_at__isnull=True,
        )

    @staticmethod
    def get_project_or_404(user, slug):
        """
        Return an active project owned by the specified user.

        Raises Http404 when the project does not exist, does not
        belong to the specified user, or has been soft-deleted.

        Project access is always owner-scoped at the service layer.
        """

        return get_object_or_404(
            Projects,
            owner=user,
            slug=slug,
            deleted_at__isnull=True,
        )

    @staticmethod
    def validate_unique_slug(
        user,
        slug,
        exclude_id=None,
    ):
        """
        Validate and normalize a project slug.

        The resulting slug must be unique for the specified owner.

        Args:
            user:
                Project owner.

            slug:
                Project name or slug candidate.

            exclude_id:
                Optional project primary key to exclude when
                regenerating the slug of an existing project.

        Returns:
            A normalized unique slug.

        Raises:
            ValidationError:
                If a valid slug cannot be generated or the slug
                already belongs to another project owned by the user.
        """

        slug = slugify(slug)

        if not slug:
            raise ValidationError(
                {
                    "slug": "A valid project slug cannot be generated.",
                }
            )

        queryset = Projects.objects.filter(
            owner=user,
            slug=slug,
        )

        if exclude_id is not None:
            queryset = queryset.exclude(
                pk=exclude_id,
            )

        if queryset.exists():
            raise ValidationError(
                {
                    "slug": f"You already have a project with the slug '{slug}'.",
                }
            )

        return slug

    @staticmethod
    @transaction.atomic
    def create_project(
        user,
        data,
    ):
        """
        Create a new project owned by the specified user.

        The project slug is automatically generated from the
        project name.

        """

        name = data.get(
            "name",
            "",
        ).strip()

        if not name:
            raise ValidationError(
                {
                    "name": "Project name is required.",
                }
            )

        slug = ProjectService.validate_unique_slug(
            user=user,
            slug=name,
        )

        project = Projects.objects.create(
            owner=user,
            name=name,
            slug=slug,
            is_published=True,
            created_by=user,
        )

        logger.info(
            "Project created. project_id=%s owner_id=%s slug=%s",
            project.pk,
            user.pk,
            project.slug,
        )

        return project

    @staticmethod
    @transaction.atomic
    def rename_project(
        project,
        user,
        name,
    ):
        """
        Rename an active project and regenerate its slug.

        The new slug is derived from the supplied project name and
        must remain unique for the project owner.

        A soft-deleted project cannot be renamed.
        """

        if project.deleted_at is not None:
            raise ValidationError(
                {
                    "project": "A deleted project cannot be renamed.",
                }
            )

        name = name.strip()

        if not name:
            raise ValidationError(
                {
                    "name": "Project name cannot be empty.",
                }
            )

        slug = ProjectService.validate_unique_slug(
            user=project.owner,
            slug=name,
            exclude_id=project.pk,
        )

        if project.name == name and project.slug == slug:
            return project

        project.name = name
        project.slug = slug
        project.updated_by = user

        project.save(
            update_fields=[
                "name",
                "slug",
                "updated_by",
                "updated_at",
            ],
        )

        logger.info(
            "Project renamed. project_id=%s user_id=%s slug=%s",
            project.pk,
            user.pk,
            project.slug,
        )

        return project

    @staticmethod
    @transaction.atomic
    def publish_project(
        project,
        user,
    ):
        """
        Publish an active project.

        A soft-deleted project cannot be published.
        """

        if project.deleted_at is not None:
            raise ValidationError(
                {
                    "project": "A deleted project cannot be published.",
                }
            )

        if project.is_published:
            return project

        project.is_published = True
        project.updated_by = user

        project.save(
            update_fields=[
                "is_published",
                "updated_by",
                "updated_at",
            ],
        )

        logger.info(
            "Project published. project_id=%s user_id=%s",
            project.pk,
            user.pk,
        )

        return project

    @staticmethod
    @transaction.atomic
    def unpublish_project(
        project,
        user,
    ):
        """
        Unpublish an active project.
        A soft-deleted project cannot be unpublished.
        """

        if project.deleted_at is not None:
            raise ValidationError(
                {
                    "project": "A deleted project cannot be unpublished.",
                }
            )

        if not project.is_published:
            return project

        project.is_published = False
        project.updated_by = user

        project.save(
            update_fields=[
                "is_published",
                "updated_by",
                "updated_at",
            ],
        )

        logger.info(
            "Project unpublished. project_id=%s user_id=%s",
            project.pk,
            user.pk,
        )

        return project

    @staticmethod
    @transaction.atomic
    def toggle_publish(
        project,
        user,
    ):
        """
        Toggle the publication state of an active project.
        A soft-deleted project cannot change publication state.

        The user performing the action is recorded as updated_by.
        """

        if project.deleted_at is not None:
            raise ValidationError(
                {
                    "project": "A deleted project cannot change publication status.",
                }
            )

        project.is_published = not project.is_published
        project.updated_by = user

        project.save(
            update_fields=[
                "is_published",
                "updated_by",
                "updated_at",
            ],
        )

        logger.info(
            "Project publication toggled. project_id=%s user_id=%s published=%s",
            project.pk,
            user.pk,
            project.is_published,
        )

        return project

    @staticmethod
    @transaction.atomic
    def delete_project(
        project,
        user,
    ):
        """
        Soft-delete an active project.

        The project record remains in the database.

        Soft-deleted projects are excluded from normal project
        queries and cannot be used by the public mock runtime.
        """

        if project.deleted_at is not None:
            return project

        project.deleted_at = timezone.now()
        project.deleted_by = user
        project.is_published = False
        project.updated_by = user

        project.save(
            update_fields=[
                "deleted_at",
                "deleted_by",
                "is_published",
                "updated_by",
                "updated_at",
            ],
        )

        logger.warning(
            "Project soft-deleted. project_id=%s user_id=%s",
            project.pk,
            user.pk,
        )

        return project

    @staticmethod
    @transaction.atomic
    def restore_project(
        project,
        user,
    ):
        """
        Restore a previously soft-deleted project.

        Restored projects are always unpublished. Publication must
        be explicitly enabled again after restoration.

        Raises:
            ValidationError:
                If the project is already active.
        """

        if project.deleted_at is None:
            return project

        project.deleted_at = None
        project.deleted_by = None
        project.is_published = False
        project.updated_by = user

        project.save(
            update_fields=[
                "deleted_at",
                "deleted_by",
                "is_published",
                "updated_by",
                "updated_at",
            ],
        )

        logger.info(
            "Project restored. project_id=%s user_id=%s",
            project.pk,
            user.pk,
        )

        return project
