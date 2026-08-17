from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .registry import get_generator_metadata


class GeneratorListView(APIView):
    """
    API endpoint for retrieving available MockForge generators.

    The generator registry is the single source of truth for all
    available generators.

    The endpoint exposes only safe metadata required by the frontend
    to dynamically build field configuration forms.

    Authentication is not required because generator metadata does not
    expose project-specific or user-specific information.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        """
        Return registered generators.

        An optional ``data_type`` query parameter filters generators
        by supported field data type.

        Examples:

            GET /api/v1/generators/
            GET /api/v1/generators/?data_type=string
        """

        generators = get_generator_metadata()

        data_type = request.query_params.get("data_type")

        if data_type:
            generators = [
                generator
                for generator in generators
                if data_type in generator["supported_types"]
            ]

        return Response(
            generators,
            status=status.HTTP_200_OK,
        )
