import csv
import json
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path
from uuid import UUID

from django.test import SimpleTestCase

from .registry import get_generator
from .validators import GeneratorValidationError, validate_generator_configuration

REPORT_DIR = Path("test_reports")
CSV_FILE = REPORT_DIR / "generator_test_report.csv"
JSON_FILE = REPORT_DIR / "generator_test_report.json"


GENERATOR_TEST_CASES = [
    {
        "id": "GEN-001",
        "key": "address.city",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-002",
        "key": "address.country",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-003",
        "key": "address.street",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-004",
        "key": "address.zipcode",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-005",
        "key": "choice.picker",
        "data_type": "string",
        "options": {
            "choices": [
                "Active",
                "Inactive",
            ],
        },
    },
    {
        "id": "GEN-006",
        "key": "commerce.product_name",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-007",
        "key": "commerce.price",
        "data_type": "decimal",
        "options": {
            "minimum": 10,
            "maximum": 100,
            "decimal_places": 2,
        },
    },
    {
        "id": "GEN-008",
        "key": "commerce.category",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-009",
        "key": "commerce.currency",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-010",
        "key": "company.name",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-011",
        "key": "datetime.date",
        "data_type": "date",
        "options": {},
    },
    {
        "id": "GEN-012",
        "key": "datetime.datetime",
        "data_type": "datetime",
        "options": {},
    },
    {
        "id": "GEN-013",
        "key": "internet.email",
        "data_type": "string",
        "options": {
            "domain": "example.com",
        },
    },
    {
        "id": "GEN-014",
        "key": "internet.url",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-015",
        "key": "internet.domain",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-016",
        "key": "internet.phone",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-017",
        "key": "person.first_name",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-018",
        "key": "person.last_name",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-019",
        "key": "person.full_name",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-020",
        "key": "person.username",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-021",
        "key": "person.job_title",
        "data_type": "string",
        "options": {},
    },
    {
        "id": "GEN-022",
        "key": "random.integer",
        "data_type": "integer",
        "options": {
            "minimum": 10,
            "maximum": 100,
        },
    },
    {
        "id": "GEN-023",
        "key": "random.decimal",
        "data_type": "decimal",
        "options": {
            "minimum": 10,
            "maximum": 100,
            "decimal_places": 2,
        },
    },
    {
        "id": "GEN-024",
        "key": "random.boolean",
        "data_type": "boolean",
        "options": {
            "true_probability": 50,
        },
    },
    {
        "id": "GEN-025",
        "key": "uuid.v4",
        "data_type": "uuid",
        "options": {},
    },
    {
        "id": "GEN-026",
        "key": "text.sentence",
        "data_type": "string",
        "options": {
            "words": 5,
        },
    },
    {
        "id": "GEN-027",
        "key": "text.paragraph",
        "data_type": "string",
        "options": {
            "sentences": 3,
        },
    },
]


def serialize_value(value):
    if isinstance(value, (date, datetime)):
        return value.isoformat()

    if isinstance(value, Decimal):
        return str(value)

    if isinstance(value, UUID):
        return str(value)

    return value


def validate_generated_value(value, data_type):
    if data_type == "string":
        return isinstance(value, str) and bool(value.strip())

    if data_type == "integer":
        return isinstance(value, int) and not isinstance(value, bool)

    if data_type == "decimal":
        return isinstance(value, Decimal)

    if data_type == "boolean":
        return isinstance(value, bool)

    if data_type == "uuid":
        return isinstance(value, UUID)

    if data_type == "date":
        return isinstance(value, date) and not isinstance(value, datetime)

    if data_type == "datetime":
        return isinstance(value, datetime)

    return False


class GeneratorReportTestCase(SimpleTestCase):
    def test_generate_generator_report(self):
        results = []

        for test_case in GENERATOR_TEST_CASES:
            generator_key = test_case["key"]
            data_type = test_case["data_type"]
            options = test_case["options"]

            generated_value = None
            error = ""
            status = "PASS"

            try:
                validate_generator_configuration(
                    generator_key=generator_key,
                    data_type=data_type,
                    options=options,
                )

                generator = get_generator(generator_key)

                generated_value = generator.generate(options)

                if not validate_generated_value(
                    generated_value,
                    data_type,
                ):
                    status = "FAIL"
                    error = "Generated value does not match declared data type."

            except GeneratorValidationError as exc:
                status = "FAIL"
                error = str(exc)

            except Exception as exc:
                status = "FAIL"
                error = str(exc)

            serialized_value = serialize_value(generated_value)

            results.append(
                {
                    "test_case": test_case["id"],
                    "generator": generator_key,
                    "data_type": data_type,
                    "options": json.dumps(options, sort_keys=True),
                    "backend_value": serialized_value,
                    "python_type": (
                        type(generated_value).__name__
                        if generated_value is not None
                        else ""
                    ),
                    "status": status,
                    "error": error,
                }
            )

            self.assertEqual(
                status,
                "PASS",
                f"{generator_key}: {error}",
            )

        REPORT_DIR.mkdir(
            parents=True,
            exist_ok=True,
        )

        with CSV_FILE.open(
            "w",
            newline="",
            encoding="utf-8",
        ) as file:
            writer = csv.DictWriter(
                file,
                fieldnames=[
                    "test_case",
                    "generator",
                    "data_type",
                    "options",
                    "backend_value",
                    "python_type",
                    "status",
                    "error",
                ],
            )

            writer.writeheader()
            writer.writerows(results)

        with JSON_FILE.open(
            "w",
            encoding="utf-8",
        ) as file:
            json.dump(
                results,
                file,
                indent=4,
                default=str,
            )
