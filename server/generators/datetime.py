from faker import Faker

from .base import BaseGenerator
from .registry import register

fake = Faker()


@register
class DateGenerator(BaseGenerator):
    """
    Generate a random calendar date within a configurable range.
    """

    key = "datetime.date"
    supported_types = ("date",)
    allowed_options = frozenset({"start", "end"})

    def validate_options(self, options):
        if "start" in options and not isinstance(
            options["start"],
            str,
        ):
            raise ValueError("start must be a string.")

        if "end" in options and not isinstance(
            options["end"],
            str,
        ):
            raise ValueError("end must be a string.")

    def generate(self, options):
        start = options.get("start", "-10y")
        end = options.get("end", "today")

        return fake.date_between(
            start_date=start,
            end_date=end,
        )


@register
class DateTimeGenerator(BaseGenerator):
    """
    Generate a random datetime within a configurable range.
    """

    key = "datetime.datetime"
    supported_types = ("datetime",)
    allowed_options = frozenset({"start", "end"})

    def validate_options(self, options):
        if "start" in options and not isinstance(
            options["start"],
            str,
        ):
            raise ValueError("start must be a string.")

        if "end" in options and not isinstance(
            options["end"],
            str,
        ):
            raise ValueError("end must be a string.")

    def generate(self, options):
        start = options.get("start", "-10y")
        end = options.get("end", "now")

        return fake.date_time_between(
            start_date=start,
            end_date=end,
        )
