from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView

from projects.models import Projects
from resources.service import ResourceService

from .serializers import (
    RuntimeQuerySerializer,
    RuntimeResponseSerializer,
)
from .service import RuntimeService


class RuntimeAPIView(APIView):
    """
    Public runtime endpoint for generating mock API responses.

    Authentication is not required.

    Both the project and resource must be published and must not
    be deleted.

    Endpoint:

        GET /api/{project_slug}/{resource_slug}/

    Multiple records:

        GET /api/{project_slug}/{resource_slug}/?count=5
    """

    authentication_classes = []
    permission_classes = []

    def get(self, request, project_slug, resource_slug):
        """
        Generate mock data for a public resource.
        """

        query_serializer = RuntimeQuerySerializer(
            data=request.query_params,
        )

        query_serializer.is_valid(
            raise_exception=True,
        )

        count = query_serializer.validated_data["count"]

        try:
            project = Projects.objects.get(
                slug=project_slug,
                deleted_at__isnull=True,
                is_published=True,
            )
        except Projects.DoesNotExist as exc:
            raise Http404("Project not found.") from exc

        resource = ResourceService.get_resource(
            project=project,
            resource_slug=resource_slug,
        )

        if resource.deleted_at is not None:
            raise Http404("Resource not found.")

        if not resource.is_published:
            raise Http404("Resource not found.")

        if count == 1:
            record = RuntimeService.generate_record(
                resource,
            )

            return Response(
                RuntimeResponseSerializer.serialize(
                    record,
                )
            )

        records = RuntimeService.generate_records(
            resource=resource,
            count=count,
        )

        return Response(
            RuntimeResponseSerializer.serialize(
                records,
            )
        )
