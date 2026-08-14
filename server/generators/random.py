import random
import uuid
from decimal import Decimal

from .base import BaseGenerator
from .registry import register


@register
class RandomIntegerGenerator(BaseGenerator):
    """
    Generate a random integer within configurable bounds.
    """

    key = "random.integer"
    supported_types = ("integer",)
    allowed_options = frozenset(
        {
            "minimum",
            "maximum",
        }
    )

    def validate_options(self, options):
        minimum = options.get("minimum", 1)
        maximum = options.get("maximum", 100)

        if not isinstance(minimum, int) or isinstance(minimum, bool):
            raise ValueError("minimum must be an integer.")

        if not isinstance(maximum, int) or isinstance(maximum, bool):
            raise ValueError("maximum must be an integer.")

        if minimum > maximum:
            raise ValueError("Minimum cannot be greater than maximum.")

    def generate(self, options):
        minimum = options.get("minimum", 1)
        maximum = options.get("maximum", 100)

        return random.randint(minimum, maximum)


@register
class RandomDecimalGenerator(BaseGenerator):
    """
    Generate a random decimal value within configurable bounds.
    """

    key = "random.decimal"
    supported_types = ("decimal",)
    allowed_options = frozenset(
        {
            "minimum",
            "maximum",
            "decimal_places",
        }
    )

    def validate_options(self, options):
        minimum = Decimal(str(options.get("minimum", 0)))
        maximum = Decimal(str(options.get("maximum", 1000)))
        decimal_places = options.get("decimal_places", 2)

        if minimum > maximum:
            raise ValueError("Minimum cannot be greater than maximum.")

        if not isinstance(decimal_places, int) or isinstance(decimal_places, bool):
            raise ValueError("decimal_places must be an integer.")

        if not 0 <= decimal_places <= 10:
            raise ValueError("decimal_places must be between 0 and 10.")

    def generate(self, options):
        minimum = Decimal(str(options.get("minimum", 0)))
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
class RandomBooleanGenerator(BaseGenerator):
    """
    Generate a random boolean using a configurable probability.
    """

    key = "random.boolean"
    supported_types = ("boolean",)
    allowed_options = frozenset({"true_probability"})

    def validate_options(self, options):
        probability = options.get("true_probability", 50)

        if not isinstance(probability, (int, float)):
            raise ValueError("true_probability must be numeric.")

        if not 0 <= probability <= 100:
            raise ValueError("true_probability must be between 0 and 100.")

    def generate(self, options):
        probability = options.get("true_probability", 50)

        return random.random() < probability / 100


@register
class UUIDGenerator(BaseGenerator):
    """
    Generate a UUID version 4 value.
    """

    key = "uuid.v4"
    supported_types = ("uuid",)

    def generate(self, options):
        return uuid.uuid4()
