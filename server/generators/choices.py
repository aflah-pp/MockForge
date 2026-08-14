import random

from .base import BaseGenerator
from .registry import register


@register
class ChoicePickerGenerator(BaseGenerator):
    """
    Generate a random value from a configured list of choices.
    """

    key = "choice.picker"
    supported_types = ("string",)
    allowed_options = frozenset({"choices"})

    def validate_options(self, options):
        choices = options.get("choices")

        if not isinstance(choices, list):
            raise ValueError("choices must be a list.")

        if not choices:
            raise ValueError("At least one choice is required.")

        if not all(isinstance(choice, str) and choice.strip() for choice in choices):
            raise ValueError("Every choice must be a non-empty string.")

    def generate(self, options):
        return random.choice(options["choices"])
