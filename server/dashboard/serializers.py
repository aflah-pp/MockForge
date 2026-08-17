from rest_framework import serializers


class DashboardStatsSerializer(serializers.Serializer):
    projects = serializers.IntegerField()
    published_projects = serializers.IntegerField()
    draft_projects = serializers.IntegerField()
    resources = serializers.IntegerField()
    published_resources = serializers.IntegerField()
    fields = serializers.IntegerField()
    api_requests = serializers.IntegerField()


class RecentProjectSerializer(serializers.Serializer):
    uuid = serializers.UUIDField()
    name = serializers.CharField()
    slug = serializers.CharField()
    is_published = serializers.BooleanField()
    resources = serializers.IntegerField()
    fields = serializers.IntegerField()
    updated_at = serializers.DateTimeField()


class ResourceDistributionSerializer(serializers.Serializer):
    name = serializers.CharField()
    slug = serializers.CharField()
    resources = serializers.IntegerField()
    fields = serializers.IntegerField()


class DashboardSerializer(serializers.Serializer):
    user = serializers.DictField()
    stats = DashboardStatsSerializer()
    recent_projects = RecentProjectSerializer(many=True)
    resource_distribution = ResourceDistributionSerializer(many=True)
