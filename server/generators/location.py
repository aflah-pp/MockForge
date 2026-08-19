from faker import Faker

from .base import BaseGenerator
from .registry import register

fake = Faker()


@register
class LatitudeGenerator(BaseGenerator):
    """
    Generate a Random Latitude
    """

    key = "location.latitude"
    supported_types = ("decimal",)

    def generate(self, options):
        return fake.latitude()


@register
class LongitudeGenerator(BaseGenerator):
    """
    Generate a Random Longitude
    """

    key = "location.longitude"
    supported_types = ("decimal",)

    def generate(self, options):
        return fake.longitude()
