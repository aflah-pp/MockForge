from django.db import connection
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@extend_schema(tags=["Config"], summary="returns health of database and backend")
@api_view(["GET"])
@permission_classes([AllowAny])
def server_status(request):
    """
    Check the health of the server and its dependencies.
    """
    try:
        connection.ensure_connection()
        database_status = "healthy"
    except Exception:
        database_status = "unhealthy"

    response_data = {
        "status": "ok" if database_status == "healthy" else "error",
        "message": (
            "All systems operational."
            if database_status == "healthy"
            else "Database connection failure."
        ),
        "database": database_status,
        "timestamp": str(timezone.now()),
    }

    status_code = (
        status.HTTP_200_OK
        if database_status == "healthy"
        else status.HTTP_503_SERVICE_UNAVAILABLE
    )

    return Response(data=response_data, status=status_code)
