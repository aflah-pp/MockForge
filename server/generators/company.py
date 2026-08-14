from faker import Faker

from .base import BaseGenerator
from .registry import register

fake = Faker()


@register
class CompanyNameGenerator(BaseGenerator):
    """
    Generate a realistic company name.
    """

    key = "company.name"
    supported_types = ("string",)

    def generate(self, options):
        return fake.company()
