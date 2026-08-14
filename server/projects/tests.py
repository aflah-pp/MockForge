import logging

from django.core.exceptions import ValidationError
from django.http import Http404
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from users.models import User

from .models import Projects
from .service import ProjectService

logger = logging.getLogger(__name__)


class ProjectServiceTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="projectowner",
            email="owner@example.com",
            password="StrongPassword123",
        )

        self.other_user = User.objects.create_user(
            username="otherowner",
            email="other@example.com",
            password="StrongPassword123",
        )

    def test_create_project(self):
        project = ProjectService.create_project(
            user=self.user,
            data={
                "name": "My API",
            },
        )

        self.assertEqual(project.owner, self.user)
        self.assertEqual(project.name, "My API")
        self.assertEqual(project.slug, "my-api")
        self.assertFalse(project.is_published)
        self.assertIsNone(project.deleted_at)
        self.assertEqual(project.created_by, self.user)

    def test_project_name_is_normalized(self):
        project = ProjectService.create_project(
            user=self.user,
            data={
                "name": "  My API  ",
            },
        )

        self.assertEqual(project.name, "My API")
        self.assertEqual(project.slug, "my-api")

    def test_duplicate_project_slug_is_rejected_for_same_user(self):
        ProjectService.create_project(
            user=self.user,
            data={
                "name": "My API",
            },
        )

        with self.assertRaises(ValidationError):
            ProjectService.create_project(
                user=self.user,
                data={
                    "name": "my-api",
                },
            )

    def test_same_slug_can_belong_to_different_users(self):
        first_project = ProjectService.create_project(
            user=self.user,
            data={
                "name": "My API",
            },
        )

        second_project = ProjectService.create_project(
            user=self.other_user,
            data={
                "name": "My API",
            },
        )

        self.assertEqual(
            first_project.slug,
            second_project.slug,
        )

        self.assertNotEqual(
            first_project.owner,
            second_project.owner,
        )

    def test_get_user_projects_excludes_deleted_projects(self):
        project = ProjectService.create_project(
            user=self.user,
            data={
                "name": "My API",
            },
        )

        ProjectService.delete_project(
            project=project,
            user=self.user,
        )

        projects = ProjectService.get_user_projects(
            self.user,
        )

        self.assertNotIn(
            project,
            projects,
        )

    def test_rename_project_updates_name_and_slug(self):
        project = ProjectService.create_project(
            user=self.user,
            data={
                "name": "Old API",
            },
        )

        project = ProjectService.rename_project(
            project=project,
            user=self.user,
            name="New API",
        )

        self.assertEqual(project.name, "New API")
        self.assertEqual(project.slug, "new-api")
        self.assertEqual(project.updated_by, self.user)

    def test_publish_project(self):
        project = ProjectService.create_project(
            user=self.user,
            data={
                "name": "Public API",
            },
        )

        project = ProjectService.publish_project(
            project=project,
            user=self.user,
        )

        self.assertTrue(project.is_published)
        self.assertEqual(project.updated_by, self.user)

    def test_unpublish_project(self):
        project = ProjectService.create_project(
            user=self.user,
            data={
                "name": "Public API",
            },
        )

        ProjectService.publish_project(
            project=project,
            user=self.user,
        )

        project = ProjectService.unpublish_project(
            project=project,
            user=self.user,
        )

        self.assertFalse(project.is_published)

    def test_toggle_publish(self):
        project = ProjectService.create_project(
            user=self.user,
            data={
                "name": "Toggle API",
            },
        )

        self.assertFalse(project.is_published)

        project = ProjectService.toggle_publish(
            project=project,
            user=self.user,
        )

        self.assertTrue(project.is_published)

        project = ProjectService.toggle_publish(
            project=project,
            user=self.user,
        )

        self.assertFalse(project.is_published)

    def test_delete_project_soft_deletes_project(self):
        project = ProjectService.create_project(
            user=self.user,
            data={
                "name": "Delete API",
            },
        )

        ProjectService.delete_project(
            project=project,
            user=self.user,
        )

        project.refresh_from_db()

        self.assertIsNotNone(project.deleted_at)
        self.assertEqual(project.deleted_by, self.user)
        self.assertFalse(project.is_published)

        self.assertTrue(
            Projects.objects.filter(
                pk=project.pk,
            ).exists(),
        )

    def test_deleted_project_cannot_be_published(self):
        project = ProjectService.create_project(
            user=self.user,
            data={
                "name": "Deleted API",
            },
        )

        ProjectService.delete_project(
            project=project,
            user=self.user,
        )

        with self.assertRaises(ValidationError):
            ProjectService.publish_project(
                project=project,
                user=self.user,
            )

    def test_restore_project(self):
        project = ProjectService.create_project(
            user=self.user,
            data={
                "name": "Restorable API",
            },
        )

        ProjectService.publish_project(
            project=project,
            user=self.user,
        )

        ProjectService.delete_project(
            project=project,
            user=self.user,
        )

        project = ProjectService.restore_project(
            project=project,
            user=self.user,
        )

        self.assertIsNone(project.deleted_at)
        self.assertIsNone(project.deleted_by)
        self.assertFalse(project.is_published)
        self.assertEqual(project.updated_by, self.user)

    def test_user_cannot_access_another_users_project(self):
        project = ProjectService.create_project(
            user=self.user,
            data={
                "name": "Private API",
            },
        )

        with self.assertRaises(Http404):
            ProjectService.get_project_or_404(
                user=self.other_user,
                slug=project.slug,
            )


class ProjectAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="apiowner",
            email="apiowner@example.com",
            password="StrongPassword123",
        )

        self.other_user = User.objects.create_user(
            username="apiother",
            email="apiother@example.com",
            password="StrongPassword123",
        )

        self.client.force_authenticate(
            user=self.user,
        )

        self.project = ProjectService.create_project(
            user=self.user,
            data={
                "name": "My API",
            },
        )

    def test_list_projects(self):
        response = self.client.get(
            reverse("project-list"),
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            len(response.data),
            1,
        )

        self.assertEqual(
            response.data[0]["slug"],
            self.project.slug,
        )

    def test_create_project(self):
        response = self.client.post(
            reverse("project-list"),
            {
                "name": "Second API",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            201,
        )

        self.assertEqual(
            response.data["name"],
            "Second API",
        )

        self.assertEqual(
            response.data["slug"],
            "second-api",
        )

        self.assertEqual(
            Projects.objects.filter(
                owner=self.user,
                slug="second-api",
            ).count(),
            1,
        )

    def test_retrieve_project(self):
        response = self.client.get(
            reverse(
                "project-detail",
                kwargs={
                    "slug": self.project.slug,
                },
            ),
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.data["id"],
            str(self.project.pk),
        )

    def test_other_user_cannot_retrieve_project(self):
        self.client.force_authenticate(
            user=self.other_user,
        )

        response = self.client.get(
            reverse(
                "project-detail",
                kwargs={
                    "slug": self.project.slug,
                },
            ),
        )

        self.assertEqual(
            response.status_code,
            404,
        )

    def test_rename_project(self):
        response = self.client.patch(
            reverse(
                "project-rename",
                kwargs={
                    "slug": self.project.slug,
                },
            ),
            {
                "name": "Renamed API",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.data["name"],
            "Renamed API",
        )

        self.assertEqual(
            response.data["slug"],
            "renamed-api",
        )

    def test_publish_project(self):
        response = self.client.post(
            reverse(
                "project-publish",
                kwargs={
                    "slug": self.project.slug,
                },
            ),
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertTrue(
            response.data["is_published"],
        )

    def test_unpublish_project(self):
        ProjectService.publish_project(
            project=self.project,
            user=self.user,
        )

        response = self.client.post(
            reverse(
                "project-unpublish",
                kwargs={
                    "slug": self.project.slug,
                },
            ),
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertFalse(
            response.data["is_published"],
        )

    def test_toggle_publish_project(self):
        response = self.client.post(
            reverse(
                "project-toggle-publish",
                kwargs={
                    "slug": self.project.slug,
                },
            ),
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertTrue(
            response.data["is_published"],
        )

    def test_delete_project(self):
        response = self.client.delete(
            reverse(
                "project-detail",
                kwargs={
                    "slug": self.project.slug,
                },
            ),
        )

        self.assertEqual(
            response.status_code,
            204,
        )

        self.project.refresh_from_db()

        self.assertIsNotNone(
            self.project.deleted_at,
        )

        self.assertFalse(
            self.project.is_published,
        )

    def test_deleted_project_not_in_list(self):
        ProjectService.delete_project(
            project=self.project,
            user=self.user,
        )

        response = self.client.get(
            reverse("project-list"),
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.data,
            [],
        )

    def test_unauthenticated_user_cannot_access_projects(self):
        self.client.force_authenticate(
            user=None,
        )

        response = self.client.get(
            reverse("project-list"),
        )

        self.assertEqual(
            response.status_code,
            401,
        )
