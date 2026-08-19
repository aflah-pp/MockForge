from datetime import date, datetime, time

from faker import Faker

from .base import BaseGenerator
from .registry import register

fake = Faker()


def parse_date_value(value, default_relative=None):
    if isinstance(value, date) and not isinstance(value, datetime):
        return value

    if isinstance(value, str):
        if value == "today":
            return date.today()

        try:
            return date.fromisoformat(value)
        except ValueError:
            if default_relative is not None:
                return value

    raise ValueError(
        f"Invalid date value: {value!r}. "
        "Use YYYY-MM-DD or a supported relative value."
    )


def parse_datetime_value(value, default_relative=None):
    if isinstance(value, datetime):
        return value

    if isinstance(value, str):
        if value == "now":
            return datetime.now()

        try:
            return datetime.fromisoformat(value)
        except ValueError:
            if default_relative is not None:
                return value

    raise ValueError(
        f"Invalid datetime value: {value!r}. "
        "Use ISO datetime format or a supported relative value."
    )


@register
class DateGenerator(BaseGenerator):
    key = "datetime.date"
    supported_types = ("date",)
    allowed_options = frozenset({"start", "end"})

    def validate_options(self, options):
        for key in ("start", "end"):
            if key not in options:
                continue

            if not isinstance(options[key], str):
                raise ValueError(f"{key} must be a string.")

            parse_date_value(
                options[key],
                default_relative=True,
            )

    def generate(self, options):
        start = options.get("start", "-10y")
        end = options.get("end", "today")

        start = parse_date_value(
            start,
            default_relative=True,
        )

        end = parse_date_value(
            end,
            default_relative=True,
        )

        return fake.date_between(
            start_date=start,
            end_date=end,
        )


@register
class DateTimeGenerator(BaseGenerator):
    key = "datetime.datetime"
    supported_types = ("datetime",)
    allowed_options = frozenset({"start", "end"})

    def validate_options(self, options):
        for key in ("start", "end"):
            if key not in options:
                continue

            if not isinstance(options[key], str):
                raise ValueError(f"{key} must be a string.")

            parse_datetime_value(
                options[key],
                default_relative=True,
            )

    def generate(self, options):
        start = options.get("start", "-10y")
        end = options.get("end", "now")

        start = parse_datetime_value(
            start,
            default_relative=True,
        )

        end = parse_datetime_value(
            end,
            default_relative=True,
        )

        if isinstance(start, date) and not isinstance(start, datetime):
            start = datetime.combine(start, time.min)

        if isinstance(end, date) and not isinstance(end, datetime):
            end = datetime.combine(end, time.max)

        return fake.date_time_between(
            start_date=start,
            end_date=end,
        )
