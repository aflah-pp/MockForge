import logging

from django.conf import settings
from django.core.exceptions import ValidationError as DjangoValidationError
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from users.serializers import (
    ChangePasswordSerializer,
    UserCreateSerializer,
    UserDetailSerializer,
    UserUpdateSerializer,
)
from users.service import AccountService

logger = logging.getLogger(__name__)


def set_refresh_cookie(response, refresh_token):
    """
    Store a refresh token in an HttpOnly browser cookie.

    The refresh token is intentionally excluded from the JSON
    response body to reduce exposure to client-side JavaScript.

    Args:
        response: DRF Response instance.
        refresh_token: Serialized JWT refresh token.

    Returns:
        The same response with the refresh-token cookie attached.
    """
    response.set_cookie(
        key=settings.JWT_REFRESH_COOKIE_NAME,
        value=refresh_token,
        max_age=settings.JWT_REFRESH_COOKIE_MAX_AGE,
        httponly=True,
        secure=settings.JWT_REFRESH_COOKIE_SECURE,
        samesite=settings.JWT_REFRESH_COOKIE_SAMESITE,
        domain=settings.JWT_REFRESH_COOKIE_DOMAIN,
        path=settings.JWT_REFRESH_COOKIE_PATH,
    )

    return response


def clear_refresh_cookie(response):
    """
    Remove the refresh-token cookie from the client.

    Args:
        response: DRF Response instance.

    Returns:
        The same response with the refresh-token cookie removed.
    """
    response.delete_cookie(
        key=settings.JWT_REFRESH_COOKIE_NAME,
        domain=settings.JWT_REFRESH_COOKIE_DOMAIN,
        path=settings.JWT_REFRESH_COOKIE_PATH,
        samesite=settings.JWT_REFRESH_COOKIE_SAMESITE,
    )

    return response


def service_validation_error(exc):
    """
    Convert a Django ValidationError raised by the service layer
    into a DRF ValidationError.

    This keeps HTTP-specific error formatting inside the API layer
    while allowing services to remain independent of DRF.

    Args:
        exc: Django ValidationError instance.

    Returns:
        DRF ValidationError containing the original validation details.
    """
    if hasattr(exc, "message_dict"):
        return ValidationError(exc.message_dict)

    if hasattr(exc, "messages"):
        return ValidationError(
            {
                "detail": exc.messages,
            }
        )

    return ValidationError(
        {
            "detail": str(exc),
        }
    )


@extend_schema(
    tags=["User Module"],
    summary="Register a new user account",
    description=("Creates a new MockForge user account. "),
)
class RegisterView(APIView):
    """
    Public endpoint for creating a new user account.

    Request validation is performed by UserCreateSerializer.
    Account creation and password handling are delegated to
    AccountService.

    Returns the newly created user's public account information.
    """

    permission_classes = [permissions.AllowAny]

    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    def post(self, request):
        serializer = UserCreateSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:
            user = AccountService.register(
                **serializer.validated_data,
            )
        except DjangoValidationError as exc:
            raise service_validation_error(exc)

        return Response(
            {
                "message": "Account created successfully.",
                "user": UserDetailSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(
    tags=["User Module"],
    summary="Authenticate user with JWT",
    description=("Authenticates a user using username and password. "),
)
class LoginView(APIView):
    """
    Public endpoint for authenticating a user.

    Successful authentication returns:

    - A short-lived JWT access token.
    - The authenticated user's public account information.

    The refresh token is stored exclusively in an HttpOnly cookie.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username:
            raise ValidationError(
                {
                    "username": "Username is required.",
                }
            )

        if not password:
            raise ValidationError(
                {
                    "password": "Password is required.",
                }
            )

        try:
            user, tokens = AccountService.login(
                username=username,
                password=password,
            )
        except DjangoValidationError as exc:
            raise service_validation_error(exc)

        response = Response(
            {
                "access": tokens["access"],
                "user": UserDetailSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )

        return set_refresh_cookie(
            response,
            tokens["refresh"],
        )


@extend_schema(
    tags=["User Module"],
    summary="Refresh the access token",
    description=(
        "Generates a new access token using the refresh token stored "
        "in the HttpOnly browser cookie. When refresh-token rotation "
        "is enabled, the existing refresh token is revoked and a new "
        "refresh token is issued."
    ),
)
class RefreshTokenView(APIView):
    """
    Public endpoint for refreshing an expired access token.

    The refresh token is never accepted through the request body.
    It must be supplied through the configured HttpOnly cookie.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get(
            settings.JWT_REFRESH_COOKIE_NAME,
        )

        if not refresh_token:
            raise ValidationError(
                {
                    "detail": "Refresh token not provided.",
                }
            )

        try:
            refresh = RefreshToken(
                refresh_token,
            )

            simple_jwt_settings = getattr(
                settings,
                "SIMPLE_JWT",
                {},
            )

            rotate = simple_jwt_settings.get(
                "ROTATE_REFRESH_TOKENS",
                False,
            )

            if rotate:
                refresh.blacklist()

                new_refresh = RefreshToken.for_user(
                    refresh.user,
                )

                response = Response(
                    {
                        "access": str(
                            new_refresh.access_token,
                        ),
                    },
                    status=status.HTTP_200_OK,
                )

                return set_refresh_cookie(
                    response,
                    str(new_refresh),
                )

            return Response(
                {
                    "access": str(
                        refresh.access_token,
                    ),
                },
                status=status.HTTP_200_OK,
            )

        except TokenError:
            raise ValidationError(
                {
                    "detail": "Invalid or expired refresh token.",
                }
            )


@extend_schema(
    tags=["User Module"],
    summary="Logout the current session",
    description=(
        "Revokes the refresh token associated with the current "
        "browser session and removes the refresh-token cookie."
    ),
)
class LogoutView(APIView):
    """
    Logout the currently authenticated browser session.

    The refresh token is obtained from the HttpOnly cookie,
    blacklisted, and then removed from the browser.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request):
        refresh_token = request.COOKIES.get(
            settings.JWT_REFRESH_COOKIE_NAME,
        )

        if not refresh_token:
            response = Response(
                {
                    "message": "Already logged out.",
                },
                status=status.HTTP_200_OK,
            )

            return clear_refresh_cookie(response)

        try:
            AccountService.logout(
                refresh_token=refresh_token,
            )
        except DjangoValidationError:
            response = Response(
                {
                    "message": "Logout completed.",
                },
                status=status.HTTP_200_OK,
            )

            return clear_refresh_cookie(response)

        response = Response(
            {
                "message": "Logged out successfully.",
            },
            status=status.HTTP_200_OK,
        )

        return clear_refresh_cookie(response)


@extend_schema(
    tags=["User Module"],
    summary="Logout from all active sessions",
    description=(
        "Revokes all refresh tokens belonging to the authenticated "
        "user and removes the current browser's refresh-token cookie."
    ),
)
class LogoutAllView(APIView):
    """
    Revoke every active refresh-token session belonging to
    the authenticated user.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request):
        try:
            AccountService.logout_all(
                user=request.user,
            )
        except DjangoValidationError as exc:
            raise service_validation_error(exc)

        response = Response(
            {
                "message": "All sessions have been logged out.",
            },
            status=status.HTTP_200_OK,
        )

        return clear_refresh_cookie(response)


@extend_schema(
    tags=["User Module"],
    summary="Get the current user's account",
    description=(
        "Returns the public account information of the currently " "authenticated user."
    ),
)
class CurrentUserView(generics.RetrieveAPIView):
    """
    Return the authenticated user's public account information.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = UserDetailSerializer

    def get_object(self):
        return self.request.user


@extend_schema(
    tags=["User Module"],
    summary="Update the current user's account",
    description=(
        "Updates editable profile information belonging to the "
        "authenticated user. Supports JSON and multipart form data "
        "for avatar uploads."
    ),
)
class UserUpdateView(APIView):
    """
    Update the authenticated user's editable profile information.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    def patch(self, request):
        serializer = UserUpdateSerializer(
            instance=request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:
            user = AccountService.update_account(
                user=request.user,
                **serializer.validated_data,
            )
        except DjangoValidationError as exc:
            raise service_validation_error(exc)

        return Response(
            UserDetailSerializer(user).data,
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["User Module"],
    summary="Change the current user's password",
    description=(
        "Changes the authenticated user's password. "
        "The current password must be supplied. After a successful "
        "password change, all existing refresh-token sessions are "
        "revoked."
    ),
)
class ChangePasswordView(APIView):
    """
    Change the authenticated user's password.

    Password validation and session revocation are handled by
    AccountService.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        try:
            AccountService.change_password(
                user=request.user,
                old_password=serializer.validated_data["old_password"],
                new_password=serializer.validated_data["new_password"],
            )
        except DjangoValidationError as exc:
            raise service_validation_error(exc)

        response = Response(
            {
                "message": "Password changed successfully. "
                "All sessions have been logged out.",
            },
            status=status.HTTP_200_OK,
        )

        return clear_refresh_cookie(response)


@extend_schema(
    tags=["User Module"],
    summary="Verify the current user's email",
    description=("Marks the authenticated user's email address as verified. "),
)
class VerifyEmailView(APIView):
    """
    Verify the authenticated user's email address.

    The current endpoint represents the final verification action.
    Token generation and signed verification should be implemented
    separately before exposing this endpoint in production.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request):
        try:
            user = AccountService.verify_email(
                user=request.user,
            )
        except DjangoValidationError as exc:
            raise service_validation_error(exc)

        return Response(
            {
                "message": "Email verified successfully.",
                "user": UserDetailSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["User Module"],
    summary="Deactivate the current user's account",
    description=(
        "Deactivates the authenticated user's account without "
        "deleting the database record or application data. "
        "All refresh-token sessions are revoked."
    ),
)
class DeactivateAccountView(APIView):
    """
    Deactivate the authenticated user's account.

    Deactivation preserves the user's database record and
    application data while preventing normal authentication.
    """

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request):
        try:
            user = AccountService.deactivate_account(
                user=request.user,
            )

            if user is None:
                return Response(
                    {
                        "detail": "User not found.",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

        except DjangoValidationError as exc:
            raise service_validation_error(exc)

        response = Response(
            {
                "message": "Account deactivated successfully.",
            },
            status=status.HTTP_200_OK,
        )

        return clear_refresh_cookie(response)
