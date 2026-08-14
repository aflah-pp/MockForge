from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .registry import get_generator_metadata


class GeneratorListView(APIView):
    """
    API endpoint for retrieving available MockForge generators.

    The generator registry is the single source of truth for all
    available generators.

    This endpoint exposes safe generator metadata required by the
    frontend to dynamically build field creation forms.

    Returned metadata includes:

    - generator key
    - supported data types
    - supported configuration options

    Generator implementation details are never exposed.

    Authentication is required because generator metadata is part of
    the authenticated MockForge application API.
    """

    permission_classes = []

    def get(self, request, *args, **kwargs):
        """
        Return all registered generators.

        The optional ``data_type`` query parameter can be used to
        filter generators by their supported field data type.

        Example:

            GET /api/generators/
            GET /api/generators/?data_type=string

        Returns:
            Response:
                A list of generator metadata.
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
