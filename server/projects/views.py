import logging

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import (
    ProjectCreateSerializer,
    ProjectDetailSerializer,
    ProjectListSerializer,
)
from .service import ProjectService

logger = logging.getLogger(__name__)


class ProjectViewSet(viewsets.GenericViewSet):
    """
    API ViewSet for authenticated Mokvio project management.
    """

    permission_classes = [IsAuthenticated]

    lookup_field = "slug"
    lookup_value_regex = r"[-a-zA-Z0-9_]+"

    def get_queryset(self):
        """
        Return only active projects owned by the authenticated user.
        """

        return ProjectService.get_user_projects(
            self.request.user,
        )

    def get_serializer_class(self):
        """
        Return the serializer appropriate for the current action.
        """

        if self.action == "list":
            return ProjectListSerializer

        if self.action == "create":
            return ProjectCreateSerializer

        return ProjectDetailSerializer

    def _validation_error(self, exc):
        """
        Convert a Django ValidationError into a DRF ValidationError.

        Application services use Django's ValidationError while the
        API layer exposes DRF-compatible validation responses.
        """

        if hasattr(exc, "message_dict"):
            raise ValidationError(
                exc.message_dict,
            )

        if hasattr(exc, "messages"):
            raise ValidationError(
                {
                    "detail": exc.messages,
                }
            )

        raise ValidationError(
            {
                "detail": str(exc),
            }
        )

    def list(self, request, *args, **kwargs):
        """
        Return all active projects owned by the authenticated user.
        """

        queryset = self.get_queryset()

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def create(self, request, *args, **kwargs):
        """
        Create a new project for the authenticated user.

        """

        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:
            project = ProjectService.create_project(
                user=request.user,
                data=serializer.validated_data,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        logger.info(
            "Project creation endpoint completed. " "project_id=%s user_id=%s",
            project.pk,
            request.user.pk,
        )

        return Response(
            ProjectDetailSerializer(project).data,
            status=status.HTTP_201_CREATED,
        )

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve an active project owned by the authenticated user.
        """

        project = self.get_object()

        return Response(
            ProjectDetailSerializer(project).data,
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        """
        Soft-delete an active project.
        """

        project = self.get_object()

        try:
            ProjectService.delete_project(
                project=project,
                user=request.user,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        logger.warning(
            "Project deletion endpoint completed. " "project_id=%s user_id=%s",
            project.pk,
            request.user.pk,
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )

    @action(
        detail=True,
        methods=["patch"],
        url_path="rename",
    )
    def rename(self, request, slug=None):
        """
        Rename an active project.
        """

        name = request.data.get("name")

        if name is None:
            raise ValidationError(
                {
                    "name": "Project name is required.",
                }
            )

        if not isinstance(name, str):
            raise ValidationError(
                {
                    "name": "Project name must be a string.",
                }
            )

        project = self.get_object()

        try:
            project = ProjectService.rename_project(
                project=project,
                user=request.user,
                name=name,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        logger.info(
            "Project rename endpoint completed. " "project_id=%s user_id=%s",
            project.pk,
            request.user.pk,
        )

        return Response(
            ProjectDetailSerializer(project).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="publish",
    )
    def publish(self, request, slug=None):
        """
        Publish an active project.

        Publication makes the project's generated mock API eligible
        for public runtime access.
        """

        project = self.get_object()

        try:
            project = ProjectService.publish_project(
                project=project,
                user=request.user,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        return Response(
            ProjectDetailSerializer(project).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="unpublish",
    )
    def unpublish(self, request, slug=None):
        """
        Unpublish an active project.

        The project remains available to its owner, but its
        generated mock API is no longer publicly accessible.
        """

        project = self.get_object()

        try:
            project = ProjectService.unpublish_project(
                project=project,
                user=request.user,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        return Response(
            ProjectDetailSerializer(project).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="toggle-publish",
    )
    def toggle_publish(self, request, slug=None):
        """
        Toggle the publication state of an active project.
        """

        project = self.get_object()

        try:
            project = ProjectService.toggle_publish(
                project=project,
                user=request.user,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        return Response(
            ProjectDetailSerializer(project).data,
            status=status.HTTP_200_OK,
        )
