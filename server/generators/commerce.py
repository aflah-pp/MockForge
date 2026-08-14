import random
from decimal import Decimal

from faker import Faker

from .base import BaseGenerator
from .registry import register

fake = Faker()


@register
class ProductNameGenerator(BaseGenerator):
    """
    Generate a realistic product name.
    """

    key = "commerce.product_name"
    supported_types = ("string",)

    def generate(self, options):
        return fake.catch_phrase()


@register
class PriceGenerator(BaseGenerator):
    """
    Generate a decimal price within configurable bounds.
    """

    key = "commerce.price"
    supported_types = ("decimal",)
    allowed_options = frozenset(
        {
            "minimum",
            "maximum",
            "decimal_places",
        }
    )

    def validate_options(self, options):
        minimum = options.get("minimum", 10)
        maximum = options.get("maximum", 1000)
        decimal_places = options.get("decimal_places", 2)

        if not isinstance(minimum, (int, float, Decimal)):
            raise ValueError("minimum must be numeric.")

        if not isinstance(maximum, (int, float, Decimal)):
            raise ValueError("maximum must be numeric.")

        if minimum > maximum:
            raise ValueError("Minimum price cannot exceed maximum price.")

        if not isinstance(decimal_places, int) or isinstance(decimal_places, bool):
            raise ValueError("decimal_places must be an integer.")

        if not 0 <= decimal_places <= 10:
            raise ValueError("decimal_places must be between 0 and 10.")

    def generate(self, options):
        minimum = Decimal(str(options.get("minimum", 10)))
        maximum = Decimal(str(options.get("maximum", 1000)))
        decimal_places = options.get("decimal_places", 2)

        value = Decimal(
            str(
                random.uniform(
                    float(minimum),
                    float(maximum),
                )
            )
        )

        return round(value, decimal_places)


@register
class CategoryGenerator(BaseGenerator):
    """
    Generate a random product category.
    """

    key = "commerce.category"
    supported_types = ("string",)

    def generate(self, options):
        categories = [
            "Electronics",
            "Clothing",
            "Books",
            "Food",
            "Toys",
            "Furniture",
            "Sports",
            "Beauty",
        ]

        return random.choice(categories)


@register
class CurrencyGenerator(BaseGenerator):
    """
    Generate a random ISO 4217 currency code.
    """

    key = "commerce.currency"
    supported_types = ("string",)

    def generate(self, options):
        return random.choice(
            [
                "USD",
                "EUR",
                "GBP",
                "INR",
                "JPY",
            ]
        )
