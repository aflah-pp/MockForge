from rest_framework import serializers

from .models import Projects


class ProjectListSerializer(serializers.ModelSerializer):
    """
    Serializer for lightweight project list responses.
    """

    class Meta:
        model = Projects
        fields = [
            "id",
            "name",
            "slug",
            "is_published",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "is_published",
            "created_at",
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for retrieving a single project.
    """

    class Meta:
        model = Projects
        fields = [
            "id",
            "name",
            "slug",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "is_published",
            "created_at",
            "updated_at",
        ]


class ProjectCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for validating project creation input.
    """

    class Meta:
        model = Projects
        fields = [
            "name",
        ]

    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Project name cannot be empty.",
            )

        return value
