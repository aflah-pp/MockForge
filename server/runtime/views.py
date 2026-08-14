from django.http import Http404
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiParameter,
    OpenApiResponse,
    extend_schema,
)
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

    @extend_schema(
        tags=["Runtime"],
        summary="Generate mock data",
        description=(
            "Generate mock data for a published MockForge resource.\n\n"
            "Authentication is not required.\n\n"
            "The project and resource must both be published and "
            "must not be deleted.\n\n"
            "The endpoint dynamically executes the generators "
            "configured for the resource fields.\n\n"
            "Endpoint:\n\n"
            "`GET /api/{project_slug}/{resource_slug}/`\n\n"
            "Example:\n\n"
            "`https://mockforge-api.onrender.com/api/shop/products/`\n\n"
            "Multiple records:\n\n"
            "`https://mockforge-api.onrender.com/api/shop/products/?count=5`"
        ),
        parameters=[
            OpenApiParameter(
                name="project_slug",
                type=str,
                location=OpenApiParameter.PATH,
                required=True,
                description="Slug of the published project.",
                examples=[
                    OpenApiExample(
                        "Project",
                        value="shop",
                    ),
                ],
            ),
            OpenApiParameter(
                name="resource_slug",
                type=str,
                location=OpenApiParameter.PATH,
                required=True,
                description="Slug of the published resource.",
                examples=[
                    OpenApiExample(
                        "Resource",
                        value="products",
                    ),
                ],
            ),
            OpenApiParameter(
                name="count",
                type=int,
                location=OpenApiParameter.QUERY,
                required=False,
                default=1,
                description=(
                    "Number of mock records to generate. " "Minimum 1 and maximum 100."
                ),
                examples=[
                    OpenApiExample(
                        "Single",
                        value=1,
                    ),
                    OpenApiExample(
                        "Multiple",
                        value=5,
                    ),
                ],
            ),
        ],
        responses={
            200: OpenApiResponse(
                description=(
                    "Generated mock data. "
                    "An object is returned for count=1. "
                    "An array is returned for count>1."
                ),
                examples=[
                    OpenApiExample(
                        "Single record",
                        value={
                            "id": "550e8400-e29b-41d4-a716-446655440000",
                            "name": "John Smith",
                            "price": 249.5,
                            "active": True,
                            "created_at": "2026-08-13T14:30:00",
                        },
                    ),
                    OpenApiExample(
                        "Multiple records",
                        value=[
                            {
                                "id": "550e8400-e29b-41d4-a716-446655440000",
                                "name": "John Smith",
                                "price": 249.5,
                                "active": True,
                            },
                            {
                                "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
                                "name": "Sarah Wilson",
                                "price": 721.3,
                                "active": False,
                            },
                        ],
                    ),
                ],
            ),
            400: OpenApiResponse(
                description="Invalid runtime query parameters.",
            ),
            404: OpenApiResponse(
                description=(
                    "Project or resource does not exist, "
                    "has been deleted, or is not published."
                ),
            ),
        },
    )
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
