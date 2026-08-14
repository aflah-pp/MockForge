from faker import Faker

from .base import BaseGenerator
from .registry import register

fake = Faker()


@register
class FirstNameGenerator(BaseGenerator):
    """
    Generate a realistic first name.
    """

    key = "person.first_name"
    supported_types = ("string",)

    def generate(self, options):
        return fake.first_name()


@register
class LastNameGenerator(BaseGenerator):
    """
    Generate a realistic last name.
    """

    key = "person.last_name"
    supported_types = ("string",)

    def generate(self, options):
        return fake.last_name()


@register
class FullNameGenerator(BaseGenerator):
    """
    Generate a realistic full name.
    """

    key = "person.full_name"
    supported_types = ("string",)

    def generate(self, options):
        return fake.name()


@register
class UsernameGenerator(BaseGenerator):
    """
    Generate a realistic username.
    """

    key = "person.username"
    supported_types = ("string",)

    def generate(self, options):
        return fake.user_name()


@register
class JobTitleGenerator(BaseGenerator):
    """
    Generate a realistic job title.
    """

    key = "person.job_title"
    supported_types = ("string",)

    def generate(self, options):
        return fake.job()
