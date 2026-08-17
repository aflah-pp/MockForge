from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import DashboardSerializer
from .service import DashboardService


class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        dashboard = DashboardService.get_dashboard(request.user)
        serializer = DashboardSerializer(dashboard)
        return Response(serializer.data)
