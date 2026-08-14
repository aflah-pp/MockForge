from faker import Faker

from .base import BaseGenerator
from .registry import register

fake = Faker()


@register
class EmailGenerator(BaseGenerator):
    """
    Generate a realistic email address.

    An optional domain can be supplied to constrain the email domain.
    """

    key = "internet.email"
    supported_types = ("string",)
    allowed_options = frozenset({"domain"})

    def validate_options(self, options):
        if "domain" in options:
            domain = options["domain"]

            if not isinstance(domain, str):
                raise ValueError("domain must be a string.")

            if not domain.strip():
                raise ValueError("domain cannot be empty.")

    def generate(self, options):
        domain = options.get("domain")

        if domain:
            return f"{fake.user_name()}@{domain.strip()}"

        return fake.email()


@register
class URLGenerator(BaseGenerator):
    """
    Generate a realistic URL.
    """

    key = "internet.url"
    supported_types = ("string",)

    def generate(self, options):
        return fake.url()


@register
class DomainGenerator(BaseGenerator):
    """
    Generate a realistic domain name.
    """

    key = "internet.domain"
    supported_types = ("string",)

    def generate(self, options):
        return fake.domain_name()


@register
class PhoneGenerator(BaseGenerator):
    """
    Generate a realistic telephone number.
    """

    key = "internet.phone"
    supported_types = ("string",)

    def generate(self, options):
        return fake.phone_number()
