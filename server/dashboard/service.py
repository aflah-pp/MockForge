from django.db.models import Count, Q

from projects.models import Projects
from resources.models import Resources


class DashboardService:

    @staticmethod
    def get_dashboard(user):
        projects = Projects.objects.filter(
            owner=user,
            deleted_at__isnull=True,
        )

        resources = Resources.objects.filter(
            project__owner=user,
            project__deleted_at__isnull=True,
            deleted_at__isnull=True,
        )

        total_projects = projects.count()

        published_projects = projects.filter(
            is_published=True,
        ).count()

        draft_projects = projects.filter(
            is_published=False,
        ).count()

        total_resources = resources.count()

        published_resources = resources.filter(
            is_published=True,
        ).count()

        total_fields = (
            resources.aggregate(
                total=Count(
                    "fields",
                    filter=Q(fields__deleted_at__isnull=True),
                )
            )["total"]
            or 0
        )

        recent_projects = projects.annotate(
            resource_count=Count(
                "resources",
                filter=Q(resources__deleted_at__isnull=True),
                distinct=True,
            ),
            field_count=Count(
                "resources__fields",
                filter=Q(
                    resources__deleted_at__isnull=True,
                    resources__fields__deleted_at__isnull=True,
                ),
                distinct=True,
            ),
        ).order_by("-updated_at")[:5]

        recent_projects_data = []

        for project in recent_projects:
            recent_projects_data.append(
                {
                    "uuid": project.id,
                    "name": project.name,
                    "slug": project.slug,
                    "is_published": project.is_published,
                    "resources": project.resource_count,
                    "fields": project.field_count,
                    "updated_at": project.updated_at,
                }
            )

        distribution_projects = projects.annotate(
            resource_count=Count(
                "resources",
                filter=Q(resources__deleted_at__isnull=True),
                distinct=True,
            ),
            field_count=Count(
                "resources__fields",
                filter=Q(
                    resources__deleted_at__isnull=True,
                    resources__fields__deleted_at__isnull=True,
                ),
                distinct=True,
            ),
        ).order_by("-field_count", "name")

        resource_distribution = []

        for project in distribution_projects:
            resource_distribution.append(
                {
                    "name": project.name,
                    "slug": project.slug,
                    "resources": project.resource_count,
                    "fields": project.field_count,
                }
            )

        return {
            "user": {
                "username": user.username,
            },
            "stats": {
                "projects": total_projects,
                "published_projects": published_projects,
                "draft_projects": draft_projects,
                "resources": total_resources,
                "published_resources": published_resources,
                "fields": total_fields,
                "api_requests": 0,
            },
            "recent_projects": recent_projects_data,
            "resource_distribution": resource_distribution,
        }
