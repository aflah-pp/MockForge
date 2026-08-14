from django.contrib.auth.models import AbstractUser
from django.db import models

from shared.models import UUIDPrimaryKeyMixin


class User(UUIDPrimaryKeyMixin, AbstractUser):
    """
    Application user model.

    Represents the authentication identity of a MockForge user and stores
    basic profile information required by the application.

    User accounts maintain their own lifecycle timestamps because they are
    authentication identities rather than user-owned configuration records.
    """

    username = models.CharField(
        max_length=30,
        unique=True,
        db_index=True,
    )

    email = models.EmailField(
        unique=True,
        db_index=True,
    )

    is_verified = models.BooleanField(
        default=False,
        db_index=True,
    )

    avatar = models.ImageField(
        upload_to="users/avatars/",
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.username
