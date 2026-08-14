from faker import Faker

from .base import BaseGenerator
from .registry import register

fake = Faker()


@register
class CityGenerator(BaseGenerator):
    """
    Generate a realistic city name.
    """

    key = "address.city"
    supported_types = ("string",)

    def generate(self, options):
        return fake.city()


@register
class CountryGenerator(BaseGenerator):
    """
    Generate a realistic country name.
    """

    key = "address.country"
    supported_types = ("string",)

    def generate(self, options):
        return fake.country()


@register
class StreetGenerator(BaseGenerator):
    """
    Generate a realistic street address.
    """

    key = "address.street"
    supported_types = ("string",)

    def generate(self, options):
        return fake.street_address()


@register
class ZipCodeGenerator(BaseGenerator):
    """
    Generate a realistic postal code.
    """

    key = "address.zipcode"
    supported_types = ("string",)

    def generate(self, options):
        return fake.postcode()
