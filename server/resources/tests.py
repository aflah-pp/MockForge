import logging

from django.core.exceptions import ValidationError
from django.http import Http404
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from projects.models import Projects
from users.models import User

from .models import Fields, Resources
from .service import ResourceService

logger = logging.getLogger(__name__)


class ResourceServiceTestCase(TestCase):
    """
    Test resource and field business logic implemented by
    ResourceService.
    """

    def setUp(self):
        """
        Create isolated users and projects used across resource tests.
        """

        self.owner = User.objects.create_user(
            username="resource-owner",
            email="resource-owner@example.com",
            password="TestPassword123!",
        )

        self.other_user = User.objects.create_user(
            username="resource-other",
            email="resource-other@example.com",
            password="TestPassword123!",
        )

        self.project = Projects.objects.create(
            owner=self.owner,
            name="Test Project",
            slug="test-project",
            is_published=False,
            created_by=self.owner,
        )

        self.other_project = Projects.objects.create(
            owner=self.other_user,
            name="Other Project",
            slug="other-project",
            is_published=False,
            created_by=self.other_user,
        )

    def test_create_resource_generates_slug(self):
        """
        Resource creation should automatically generate a slug
        from the resource name.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Product Catalog",
            },
            user=self.owner,
        )

        self.assertEqual(resource.name, "Product Catalog")
        self.assertEqual(resource.slug, "product-catalog")
        self.assertEqual(resource.project, self.project)
        self.assertFalse(resource.is_published)
        self.assertIsNone(resource.deleted_at)

    def test_create_resource_generates_unique_slug(self):
        """
        Resources with the same name inside a project should receive
        unique slugs.
        """

        first = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        second = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        self.assertEqual(first.slug, "products")
        self.assertEqual(second.slug, "products-2")

    def test_same_resource_name_allowed_in_different_projects(self):
        """
        The same resource name may exist in different projects because
        resource identity is scoped to its project.
        """

        first = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        second = ResourceService.create(
            project=self.other_project,
            validated_data={
                "name": "Products",
            },
            user=self.other_user,
        )

        self.assertEqual(first.slug, "products")
        self.assertEqual(second.slug, "products")

    def test_get_resource_returns_project_scoped_resource(self):
        """
        Resource lookup should require both the project and resource slug.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        result = ResourceService.get_resource(
            project=self.project,
            resource_slug="products",
        )

        self.assertEqual(result.pk, resource.pk)

    def test_get_resource_does_not_return_resource_from_another_project(self):
        """
        A resource belonging to another project must not be accessible
        through the current project.
        """

        ResourceService.create(
            project=self.other_project,
            validated_data={
                "name": "Products",
            },
            user=self.other_user,
        )

        with self.assertRaises(Http404):
            ResourceService.get_resource(
                project=self.project,
                resource_slug="products",
            )

    def test_list_resources_excludes_deleted_resources(self):
        """
        Resource listings should only contain active resources.
        """

        active = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Active Products",
            },
            user=self.owner,
        )

        deleted = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Deleted Products",
            },
            user=self.owner,
        )

        ResourceService.delete(
            resource=deleted,
            user=self.owner,
        )

        resources = ResourceService.list_resources(
            project=self.project,
        )

        self.assertIn(active, resources)
        self.assertNotIn(deleted, resources)

    def test_rename_resource_regenerates_slug(self):
        """
        Renaming a resource should regenerate its slug.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        ResourceService.rename(
            resource=resource,
            name="Product Catalog",
            user=self.owner,
        )

        resource.refresh_from_db()

        self.assertEqual(resource.name, "Product Catalog")
        self.assertEqual(resource.slug, "product-catalog")
        self.assertEqual(resource.updated_by, self.owner)

    def test_publish_resource(self):
        """
        Publishing an active resource should enable publication.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        ResourceService.publish(
            resource=resource,
            user=self.owner,
        )

        resource.refresh_from_db()

        self.assertTrue(resource.is_published)
        self.assertEqual(resource.updated_by, self.owner)

    def test_unpublish_resource(self):
        """
        Unpublishing an active resource should disable publication.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        ResourceService.publish(
            resource=resource,
            user=self.owner,
        )

        ResourceService.unpublish(
            resource=resource,
            user=self.owner,
        )

        resource.refresh_from_db()

        self.assertFalse(resource.is_published)
        self.assertEqual(resource.updated_by, self.owner)

    def test_publish_already_published_resource_fails(self):
        """
        Publishing an already published resource should fail.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        ResourceService.publish(
            resource=resource,
            user=self.owner,
        )

        with self.assertRaises(ValidationError):
            ResourceService.publish(
                resource=resource,
                user=self.owner,
            )

    def test_unpublish_already_unpublished_resource_fails(self):
        """
        Unpublishing an already unpublished resource should fail.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        with self.assertRaises(ValidationError):
            ResourceService.unpublish(
                resource=resource,
                user=self.owner,
            )

    def test_delete_resource_soft_deletes_resource(self):
        """
        Resource deletion should be implemented as a soft delete.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        ResourceService.publish(
            resource=resource,
            user=self.owner,
        )

        ResourceService.delete(
            resource=resource,
            user=self.owner,
        )

        resource.refresh_from_db()

        self.assertIsNotNone(resource.deleted_at)
        self.assertEqual(resource.deleted_by, self.owner)
        self.assertEqual(resource.updated_by, self.owner)
        self.assertFalse(resource.is_published)

    def test_deleted_resource_cannot_be_retrieved(self):
        """
        Soft-deleted resources should not be returned by normal lookup.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        ResourceService.delete(
            resource=resource,
            user=self.owner,
        )

        with self.assertRaises(Http404):
            ResourceService.get_resource(
                project=self.project,
                resource_slug=resource.slug,
            )

    def test_create_field_generates_slug(self):
        """
        Field creation should automatically generate a field slug.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        field = ResourceService.create_field(
            resource=resource,
            validated_data={
                "name": "Product Name",
                "description": "Name of the product",
                "data_type": "string",
                "generator_key": "commerce.product_name",
                "generator_options": {},
            },
            user=self.owner,
        )

        self.assertEqual(field.name, "Product Name")
        self.assertEqual(field.slug, "product-name")
        self.assertEqual(field.resource, resource)
        self.assertEqual(field.created_by, self.owner)

    def test_create_field_generates_unique_slug(self):
        """
        Fields with duplicate names inside a resource should receive
        unique slugs.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        first = ResourceService.create_field(
            resource=resource,
            validated_data={
                "name": "Price",
                "description": "",
                "data_type": "decimal",
                "generator_key": "commerce.price",
                "generator_options": {},
            },
            user=self.owner,
        )

        second = ResourceService.create_field(
            resource=resource,
            validated_data={
                "name": "Price",
                "description": "",
                "data_type": "decimal",
                "generator_key": "commerce.price",
                "generator_options": {},
            },
            user=self.owner,
        )

        self.assertEqual(first.slug, "price")
        self.assertEqual(second.slug, "price-2")

    def test_create_field_validates_generator_configuration(self):
        """
        Invalid generator configurations must not be persisted.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        with self.assertRaises(ValidationError):
            ResourceService.create_field(
                resource=resource,
                validated_data={
                    "name": "Price",
                    "description": "",
                    "data_type": "decimal",
                    "generator_key": "random.decimal",
                    "generator_options": {
                        "minimum": 100,
                        "maximum": 10,
                    },
                },
                user=self.owner,
            )

        self.assertFalse(
            Fields.objects.filter(
                resource=resource,
                name="Price",
            ).exists()
        )

    def test_create_field_rejects_unknown_generator(self):
        """
        Unknown generator keys must not be persisted.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        with self.assertRaises(ValidationError):
            ResourceService.create_field(
                resource=resource,
                validated_data={
                    "name": "Something",
                    "description": "",
                    "data_type": "string",
                    "generator_key": "unknown.generator",
                    "generator_options": {},
                },
                user=self.owner,
            )

    def test_get_field_uses_slug(self):
        """
        Field lookup should use the field slug within its resource.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        field = ResourceService.create_field(
            resource=resource,
            validated_data={
                "name": "Product Name",
                "description": "",
                "data_type": "string",
                "generator_key": "person.full_name",
                "generator_options": {},
            },
            user=self.owner,
        )

        result = ResourceService.get_field(
            resource=resource,
            field_slug="product-name",
        )

        self.assertEqual(result.pk, field.pk)

    def test_list_fields_excludes_deleted_fields(self):
        """
        Field listings should exclude soft-deleted fields.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        active_field = ResourceService.create_field(
            resource=resource,
            validated_data={
                "name": "Name",
                "description": "",
                "data_type": "string",
                "generator_key": "person.full_name",
                "generator_options": {},
            },
            user=self.owner,
        )

        deleted_field = ResourceService.create_field(
            resource=resource,
            validated_data={
                "name": "Price",
                "description": "",
                "data_type": "decimal",
                "generator_key": "commerce.price",
                "generator_options": {},
            },
            user=self.owner,
        )

        ResourceService.delete_field(
            field=deleted_field,
            user=self.owner,
        )

        fields = ResourceService.list_fields(
            resource=resource,
        )

        self.assertIn(active_field, fields)
        self.assertNotIn(deleted_field, fields)

    def test_update_field_regenerates_slug_when_name_changes(self):
        """
        Updating a field name should regenerate its slug.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        field = ResourceService.create_field(
            resource=resource,
            validated_data={
                "name": "Name",
                "description": "",
                "data_type": "string",
                "generator_key": "person.full_name",
                "generator_options": {},
            },
            user=self.owner,
        )

        ResourceService.update_field(
            field=field,
            validated_data={
                "name": "Product Name",
            },
            user=self.owner,
        )

        field.refresh_from_db()

        self.assertEqual(field.name, "Product Name")
        self.assertEqual(field.slug, "product-name")
        self.assertEqual(field.updated_by, self.owner)

    def test_update_field_revalidates_generator_configuration(self):
        """
        Updating generator configuration should trigger validation.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        field = ResourceService.create_field(
            resource=resource,
            validated_data={
                "name": "Price",
                "description": "",
                "data_type": "decimal",
                "generator_key": "random.decimal",
                "generator_options": {
                    "minimum": 10,
                    "maximum": 100,
                },
            },
            user=self.owner,
        )

        with self.assertRaises(ValidationError):
            ResourceService.update_field(
                field=field,
                validated_data={
                    "generator_options": {
                        "minimum": 100,
                        "maximum": 10,
                    },
                },
                user=self.owner,
            )

        field.refresh_from_db()

        self.assertEqual(
            field.generator_options,
            {
                "minimum": 10,
                "maximum": 100,
            },
        )

    def test_delete_field_soft_deletes_field(self):
        """
        Field deletion should preserve the record while marking it
        as deleted.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        field = ResourceService.create_field(
            resource=resource,
            validated_data={
                "name": "Name",
                "description": "",
                "data_type": "string",
                "generator_key": "person.full_name",
                "generator_options": {},
            },
            user=self.owner,
        )

        ResourceService.delete_field(
            field=field,
            user=self.owner,
        )

        field.refresh_from_db()

        self.assertIsNotNone(field.deleted_at)
        self.assertEqual(field.deleted_by, self.owner)
        self.assertEqual(field.updated_by, self.owner)

    def test_delete_resource_soft_deletes_active_fields(self):
        """
        Deleting a resource should also soft-delete all of its
        active fields.
        """

        resource = ResourceService.create(
            project=self.project,
            validated_data={
                "name": "Products",
            },
            user=self.owner,
        )

        field_one = ResourceService.create_field(
            resource=resource,
            validated_data={
                "name": "Name",
                "description": "",
                "data_type": "string",
                "generator_key": "person.full_name",
                "generator_options": {},
            },
            user=self.owner,
        )

        field_two = ResourceService.create_field(
            resource=resource,
            validated_data={
                "name": "Price",
                "description": "",
                "data_type": "decimal",
                "generator_key": "commerce.price",
                "generator_options": {},
            },
            user=self.owner,
        )

        ResourceService.delete(
            resource=resource,
            user=self.owner,
        )

        field_one.refresh_from_db()
        field_two.refresh_from_db()

        self.assertIsNotNone(field_one.deleted_at)
        self.assertIsNotNone(field_two.deleted_at)
        self.assertEqual(field_one.deleted_by, self.owner)
        self.assertEqual(field_two.deleted_by, self.owner)


class ResourceAPITestCase(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username="api-owner",
            email="api-owner@example.com",
            password="TestPassword123!",
        )

        self.other_user = User.objects.create_user(
            username="api-other",
            email="api-other@example.com",
            password="TestPassword123!",
        )

        self.project = Projects.objects.create(
            owner=self.owner,
            name="API Project",
            slug="api-project",
            is_published=False,
            created_by=self.owner,
        )

        self.other_project = Projects.objects.create(
            owner=self.other_user,
            name="Other API Project",
            slug="other-api-project",
            is_published=False,
            created_by=self.other_user,
        )

        self.resources_url = f"/api/v1/projects/{self.project.slug}/resources/"

        self.other_resources_url = (
            f"/api/v1/projects/{self.other_project.slug}/resources/"
        )

        self.client.force_authenticate(
            user=self.owner,
        )

    def create_resource(self, name="Products"):
        response = self.client.post(
            self.resources_url,
            {
                "name": name,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        return response

    def test_unauthenticated_resource_list_fails(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(
            self.resources_url,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_list_resources(self):
        self.create_resource("Products")
        self.create_resource("Orders")

        response = self.client.get(
            self.resources_url,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data),
            2,
        )

    def test_create_resource(self):
        response = self.create_resource(
            "Product Catalog",
        )

        self.assertEqual(
            response.data["name"],
            "Product Catalog",
        )

        self.assertEqual(
            response.data["slug"],
            "product-catalog",
        )

        self.assertFalse(
            response.data["is_published"],
        )

    def test_create_resource_rejects_empty_name(self):
        response = self.client.post(
            self.resources_url,
            {
                "name": "   ",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_retrieve_resource(self):
        response = self.create_resource(
            "Products",
        )

        resource_slug = response.data["slug"]

        response = self.client.get(
            f"{self.resources_url}{resource_slug}/",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["slug"],
            "products",
        )

    def test_resource_is_project_scoped(self):
        self.client.post(
            self.other_resources_url,
            {
                "name": "Other Products",
            },
            format="json",
        )

        response = self.client.get(
            f"{self.resources_url}other-products/",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_other_user_cannot_access_project_resources(self):
        self.client.force_authenticate(
            user=self.other_user,
        )

        response = self.client.get(
            self.resources_url,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_rename_resource(self):
        response = self.create_resource(
            "Products",
        )

        resource_slug = response.data["slug"]

        response = self.client.patch(
            f"{self.resources_url}{resource_slug}/rename/",
            {
                "name": "Product Catalog",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["name"],
            "Product Catalog",
        )

        self.assertEqual(
            response.data["slug"],
            "product-catalog",
        )

    def test_rename_resource_requires_name(self):
        response = self.create_resource(
            "Products",
        )

        resource_slug = response.data["slug"]

        response = self.client.patch(
            f"{self.resources_url}{resource_slug}/rename/",
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_publish_resource(self):
        response = self.create_resource(
            "Products",
        )

        resource_slug = response.data["slug"]

        response = self.client.post(
            f"{self.resources_url}{resource_slug}/publish/",
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertTrue(
            response.data["is_published"],
        )

    def test_unpublish_resource(self):
        response = self.create_resource(
            "Products",
        )

        resource_slug = response.data["slug"]

        self.client.post(
            f"{self.resources_url}{resource_slug}/publish/",
            {},
            format="json",
        )

        response = self.client.post(
            f"{self.resources_url}{resource_slug}/unpublish/",
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertFalse(
            response.data["is_published"],
        )

    def test_publish_already_published_resource_fails(self):
        response = self.create_resource(
            "Products",
        )

        resource_slug = response.data["slug"]

        self.client.post(
            f"{self.resources_url}{resource_slug}/publish/",
            {},
            format="json",
        )

        response = self.client.post(
            f"{self.resources_url}{resource_slug}/publish/",
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_unpublish_already_unpublished_resource_fails(self):
        response = self.create_resource(
            "Products",
        )

        resource_slug = response.data["slug"]

        response = self.client.post(
            f"{self.resources_url}{resource_slug}/unpublish/",
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_delete_resource(self):
        response = self.create_resource(
            "Products",
        )

        resource_slug = response.data["slug"]

        response = self.client.delete(
            f"{self.resources_url}{resource_slug}/",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        response = self.client.get(
            f"{self.resources_url}{resource_slug}/",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_deleted_resource_is_excluded_from_list(self):
        response = self.create_resource(
            "Products",
        )

        resource_slug = response.data["slug"]

        self.create_resource(
            "Orders",
        )

        self.client.delete(
            f"{self.resources_url}{resource_slug}/",
        )

        response = self.client.get(
            self.resources_url,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data),
            1,
        )

        self.assertEqual(
            response.data[0]["slug"],
            "orders",
        )


class FieldAPITestCase(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username="field-api-owner",
            email="field-api-owner@example.com",
            password="TestPassword123!",
        )

        self.other_user = User.objects.create_user(
            username="field-api-other",
            email="field-api-other@example.com",
            password="TestPassword123!",
        )

        self.project = Projects.objects.create(
            owner=self.owner,
            name="Field API Project",
            slug="field-api-project",
            is_published=False,
            created_by=self.owner,
        )

        self.other_project = Projects.objects.create(
            owner=self.other_user,
            name="Other Field Project",
            slug="other-field-project",
            is_published=False,
            created_by=self.other_user,
        )

        self.client.force_authenticate(
            user=self.owner,
        )

        self.resource = Resources.objects.create(
            project=self.project,
            name="Products",
            slug="products",
            is_published=False,
            created_by=self.owner,
        )

        self.fields_url = (
            f"/api/v1/projects/"
            f"{self.project.slug}/resources/"
            f"{self.resource.slug}/fields/"
        )

    def create_field(self, name="Product Name"):
        response = self.client.post(
            self.fields_url,
            {
                "name": name,
                "description": "Product field",
                "data_type": "string",
                "generator_key": "person.full_name",
                "generator_options": {},
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        return response

    def test_unauthenticated_field_list_fails(self):
        self.client.force_authenticate(
            user=None,
        )

        response = self.client.get(
            self.fields_url,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_list_fields(self):
        self.create_field(
            "Product Name",
        )

        self.create_field(
            "Product Owner",
        )

        response = self.client.get(
            self.fields_url,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data),
            2,
        )

    def test_create_field(self):
        response = self.create_field(
            "Product Name",
        )

        self.assertEqual(
            response.data["name"],
            "Product Name",
        )

        self.assertEqual(
            response.data["slug"],
            "product-name",
        )

        self.assertEqual(
            response.data["data_type"],
            "string",
        )

    def test_create_field_rejects_empty_name(self):
        response = self.client.post(
            self.fields_url,
            {
                "name": "   ",
                "description": "",
                "data_type": "string",
                "generator_key": "person.full_name",
                "generator_options": {},
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_create_field_rejects_empty_generator_key(self):
        response = self.client.post(
            self.fields_url,
            {
                "name": "Product Name",
                "description": "",
                "data_type": "string",
                "generator_key": "   ",
                "generator_options": {},
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_retrieve_field(self):
        response = self.create_field(
            "Product Name",
        )

        field_slug = response.data["slug"]

        response = self.client.get(
            f"{self.fields_url}{field_slug}/",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["slug"],
            "product-name",
        )

    def test_update_field(self):
        response = self.create_field(
            "Name",
        )

        field_slug = response.data["slug"]

        response = self.client.patch(
            f"{self.fields_url}{field_slug}/",
            {
                "name": "Product Name",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["name"],
            "Product Name",
        )

        self.assertEqual(
            response.data["slug"],
            "product-name",
        )

    def test_update_field_generator_configuration(self):
        response = self.client.post(
            self.fields_url,
            {
                "name": "Price",
                "description": "",
                "data_type": "decimal",
                "generator_key": "random.decimal",
                "generator_options": {
                    "minimum": 10,
                    "maximum": 100,
                },
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        field_slug = response.data["slug"]

        response = self.client.patch(
            f"{self.fields_url}{field_slug}/",
            {
                "generator_options": {
                    "minimum": 100,
                    "maximum": 10,
                },
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_create_field_rejects_unknown_generator(self):
        response = self.client.post(
            self.fields_url,
            {
                "name": "Unknown",
                "description": "",
                "data_type": "string",
                "generator_key": "unknown.generator",
                "generator_options": {},
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_delete_field(self):
        response = self.create_field(
            "Product Name",
        )

        field_slug = response.data["slug"]

        response = self.client.delete(
            f"{self.fields_url}{field_slug}/",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        response = self.client.get(
            f"{self.fields_url}{field_slug}/",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_deleted_field_is_excluded_from_list(self):
        response = self.create_field(
            "Deleted Field",
        )

        deleted_slug = response.data["slug"]

        self.create_field(
            "Active Field",
        )

        self.client.delete(
            f"{self.fields_url}{deleted_slug}/",
        )

        response = self.client.get(
            self.fields_url,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data),
            1,
        )

        self.assertEqual(
            response.data[0]["slug"],
            "active-field",
        )

    def test_other_user_cannot_access_fields(self):
        self.client.force_authenticate(
            user=self.other_user,
        )

        response = self.client.get(
            self.fields_url,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_field_resource_scope_is_enforced(self):
        other_resource = Resources.objects.create(
            project=self.project,
            name="Orders",
            slug="orders",
            is_published=False,
            created_by=self.owner,
        )

        other_fields_url = (
            f"/api/v1/projects/"
            f"{self.project.slug}/resources/"
            f"{other_resource.slug}/fields/"
        )

        response = self.client.get(
            other_fields_url,
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data,
            [],
        )
