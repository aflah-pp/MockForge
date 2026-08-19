import logging

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from projects.service import ProjectService

from .serializers import (
    FieldCreateSerializer,
    FieldDetailSerializer,
    FieldListSerializer,
    FieldUpdateSerializer,
    ResourceCreateSerializer,
    ResourceDetailSerializer,
    ResourceListSerializer,
)
from .service import ResourceService

logger = logging.getLogger(__name__)


class ResourceViewSet(viewsets.GenericViewSet):
    """
    API ViewSet for authenticated Mokvio resource management.

    """

    permission_classes = [IsAuthenticated]

    lookup_field = "slug"
    lookup_value_regex = r"[-a-zA-Z0-9_]+"

    def get_project(self):
        """
        Return the active project identified by the project slug.

        """

        return ProjectService.get_project_or_404(
            user=self.request.user,
            slug=self.kwargs["project_slug"],
        )

    def get_queryset(self):
        """
        Return active resources belonging to the resolved project.
        """

        project = self.get_project()

        return ResourceService.list_resources(
            project=project,
        )

    def get_serializer_class(self):
        """
        Return the serializer appropriate for the current action.
        """

        if self.action == "list":
            return ResourceListSerializer

        if self.action == "create":
            return ResourceCreateSerializer

        return ResourceDetailSerializer

    def _validation_error(self, exc):
        """
        Convert a Django ValidationError into a DRF ValidationError.

        The service layer uses Django's ValidationError while the
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
        Return all active resources belonging to the project.
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
        Create a new resource under the authenticated user's project.

        """

        project = self.get_project()

        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:
            resource = ResourceService.create(
                project=project,
                validated_data=serializer.validated_data,
                user=request.user,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        logger.info(
            "Resource creation endpoint completed. "
            "resource_id=%s project_id=%s user_id=%s",
            resource.pk,
            project.pk,
            request.user.pk,
        )

        return Response(
            ResourceDetailSerializer(resource).data,
            status=status.HTTP_201_CREATED,
        )

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve an active resource belonging to the project.
        """

        project = self.get_project()

        resource = ResourceService.get_resource(
            project=project,
            resource_slug=self.kwargs["slug"],
        )

        return Response(
            ResourceDetailSerializer(resource).data,
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        """
        Soft-delete an active resource and its active fields.
        """

        project = self.get_project()

        resource = ResourceService.get_resource(
            project=project,
            resource_slug=self.kwargs["slug"],
        )

        try:
            ResourceService.delete(
                resource=resource,
                user=request.user,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        logger.warning(
            "Resource deletion endpoint completed. "
            "resource_id=%s project_id=%s user_id=%s",
            resource.pk,
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
    def rename(self, request, project_slug=None, slug=None):
        """
        Rename an active resource.
        """

        name = request.data.get("name")

        if name is None:
            raise ValidationError(
                {
                    "name": "Resource name is required.",
                }
            )

        if not isinstance(name, str):
            raise ValidationError(
                {
                    "name": "Resource name must be a string.",
                }
            )

        project = self.get_project()

        resource = ResourceService.get_resource(
            project=project,
            resource_slug=slug,
        )

        try:
            resource = ResourceService.rename(
                resource=resource,
                name=name,
                user=request.user,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        logger.info(
            "Resource rename endpoint completed. "
            "resource_id=%s project_id=%s user_id=%s",
            resource.pk,
            project.pk,
            request.user.pk,
        )

        return Response(
            ResourceDetailSerializer(resource).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="publish",
    )
    def publish(self, request, project_slug=None, slug=None):
        """
        Publish an active resource.
        """

        project = self.get_project()

        resource = ResourceService.get_resource(
            project=project,
            resource_slug=slug,
        )

        try:
            resource = ResourceService.publish(
                resource=resource,
                user=request.user,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        return Response(
            ResourceDetailSerializer(resource).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="unpublish",
    )
    def unpublish(self, request, project_slug=None, slug=None):
        """
        Unpublish an active resource.
        """

        project = self.get_project()

        resource = ResourceService.get_resource(
            project=project,
            resource_slug=slug,
        )

        try:
            resource = ResourceService.unpublish(
                resource=resource,
                user=request.user,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        return Response(
            ResourceDetailSerializer(resource).data,
            status=status.HTTP_200_OK,
        )


class FieldViewSet(viewsets.GenericViewSet):
    """
    API ViewSet for authenticated Mokvio field management.

    """

    permission_classes = [IsAuthenticated]

    lookup_field = "slug"
    lookup_value_regex = r"[-a-zA-Z0-9_]+"

    def get_project(self):
        return ProjectService.get_project_or_404(
            user=self.request.user,
            slug=self.kwargs["project_slug"],
        )

    def get_resource(self):
        project = self.get_project()

        return ResourceService.get_resource(
            project=project,
            resource_slug=self.kwargs["resource_slug"],
        )

    def get_queryset(self):
        resource = self.get_resource()

        return ResourceService.list_fields(
            resource=resource,
        )

    def get_serializer_class(self):
        if self.action == "list":
            return FieldListSerializer

        if self.action == "create":
            return FieldCreateSerializer

        if self.action == "partial_update":
            return FieldUpdateSerializer

        return FieldDetailSerializer

    def _validation_error(self, exc):
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
        resource = self.get_resource()

        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:
            field = ResourceService.create_field(
                resource=resource,
                validated_data=serializer.validated_data,
                user=request.user,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        logger.info(
            "Field creation endpoint completed. field_id=%s resource_id=%s user_id=%s",
            field.pk,
            resource.pk,
            request.user.pk,
        )

        return Response(
            FieldDetailSerializer(field).data,
            status=status.HTTP_201_CREATED,
        )

    def retrieve(self, request, *args, **kwargs):
        resource = self.get_resource()

        field = ResourceService.get_field(
            resource=resource,
            field_slug=self.kwargs["slug"],
        )

        return Response(
            FieldDetailSerializer(field).data,
            status=status.HTTP_200_OK,
        )

    def partial_update(self, request, *args, **kwargs):
        resource = self.get_resource()

        field = ResourceService.get_field(
            resource=resource,
            field_slug=self.kwargs["slug"],
        )

        serializer = self.get_serializer(
            field,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:
            field = ResourceService.update_field(
                field=field,
                validated_data=serializer.validated_data,
                user=request.user,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        logger.info(
            "Field update endpoint completed. field_id=%s resource_id=%s user_id=%s",
            field.pk,
            resource.pk,
            request.user.pk,
        )

        return Response(
            FieldDetailSerializer(field).data,
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        resource = self.get_resource()

        field = ResourceService.get_field(
            resource=resource,
            field_slug=self.kwargs["slug"],
        )

        try:
            ResourceService.delete_field(
                field=field,
                user=request.user,
            )

        except DjangoValidationError as exc:
            self._validation_error(exc)

        logger.warning(
            "Field deletion endpoint completed. field_id=%s resource_id=%s user_id=%s",
            field.pk,
            resource.pk,
            request.user.pk,
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )
