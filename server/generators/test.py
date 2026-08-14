from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from django.test import SimpleTestCase

from .registry import get_generator, get_generator_metadata, list_generators
from .validators import (
    GeneratorValidationError,
    validate_generator_configuration,
)


class GeneratorRegistryTestCase(SimpleTestCase):
    def test_all_expected_generators_are_registered(self):
        expected = {
            "address.city",
            "address.country",
            "address.street",
            "address.zipcode",
            "choice.picker",
            "commerce.product_name",
            "commerce.price",
            "commerce.category",
            "commerce.currency",
            "company.name",
            "datetime.date",
            "datetime.datetime",
            "internet.email",
            "internet.url",
            "internet.domain",
            "internet.phone",
            "person.first_name",
            "person.last_name",
            "person.full_name",
            "person.username",
            "person.job_title",
            "random.integer",
            "random.decimal",
            "random.boolean",
            "uuid.v4",
            "text.sentence",
            "text.paragraph",
        }

        self.assertTrue(expected.issubset(set(list_generators())))

    def test_generator_keys_are_unique(self):
        generators = list_generators()

        self.assertEqual(
            len(generators),
            len(set(generators)),
        )

    def test_get_generator_returns_registered_generator(self):
        generator = get_generator("person.full_name")

        self.assertEqual(
            generator.key,
            "person.full_name",
        )

    def test_get_generator_rejects_unknown_generator(self):
        with self.assertRaises(ValueError):
            get_generator("unknown.generator")

    def test_generator_metadata_contains_expected_structure(self):
        metadata = get_generator_metadata()

        self.assertTrue(metadata)

        for item in metadata:
            self.assertIn("key", item)
            self.assertIn("supported_types", item)
            self.assertIn("options", item)

    def test_generator_metadata_is_sorted_by_key(self):
        metadata = get_generator_metadata()

        keys = [item["key"] for item in metadata]

        self.assertEqual(
            keys,
            sorted(keys),
        )


class GeneratorValidationTestCase(SimpleTestCase):
    def test_valid_generator_configuration(self):
        validate_generator_configuration(
            generator_key="person.full_name",
            data_type="string",
            options={},
        )

    def test_unknown_generator_is_rejected(self):
        with self.assertRaises(GeneratorValidationError):
            validate_generator_configuration(
                generator_key="unknown.generator",
                data_type="string",
                options={},
            )

    def test_unsupported_data_type_is_rejected(self):
        with self.assertRaises(GeneratorValidationError):
            validate_generator_configuration(
                generator_key="person.full_name",
                data_type="integer",
                options={},
            )

    def test_generator_options_must_be_dictionary(self):
        with self.assertRaises(GeneratorValidationError):
            validate_generator_configuration(
                generator_key="person.full_name",
                data_type="string",
                options=[],
            )

    def test_unknown_generator_option_is_rejected(self):
        with self.assertRaises(GeneratorValidationError):
            validate_generator_configuration(
                generator_key="person.full_name",
                data_type="string",
                options={
                    "unknown": True,
                },
            )

    def test_random_integer_configuration_is_valid(self):
        validate_generator_configuration(
            generator_key="random.integer",
            data_type="integer",
            options={
                "minimum": 10,
                "maximum": 100,
            },
        )

    def test_random_integer_invalid_range_is_rejected(self):
        with self.assertRaises(GeneratorValidationError):
            validate_generator_configuration(
                generator_key="random.integer",
                data_type="integer",
                options={
                    "minimum": 100,
                    "maximum": 10,
                },
            )

    def test_random_decimal_configuration_is_valid(self):
        validate_generator_configuration(
            generator_key="random.decimal",
            data_type="decimal",
            options={
                "minimum": 10,
                "maximum": 100,
                "decimal_places": 2,
            },
        )

    def test_random_decimal_invalid_range_is_rejected(self):
        with self.assertRaises(GeneratorValidationError):
            validate_generator_configuration(
                generator_key="random.decimal",
                data_type="decimal",
                options={
                    "minimum": 100,
                    "maximum": 10,
                },
            )

    def test_random_boolean_probability_is_valid(self):
        validate_generator_configuration(
            generator_key="random.boolean",
            data_type="boolean",
            options={
                "true_probability": 75,
            },
        )

    def test_random_boolean_probability_out_of_range_is_rejected(self):
        with self.assertRaises(GeneratorValidationError):
            validate_generator_configuration(
                generator_key="random.boolean",
                data_type="boolean",
                options={
                    "true_probability": 101,
                },
            )

    def test_choice_generator_requires_choices(self):
        with self.assertRaises(GeneratorValidationError):
            validate_generator_configuration(
                generator_key="choice.picker",
                data_type="string",
                options={},
            )

    def test_choice_generator_accepts_valid_choices(self):
        validate_generator_configuration(
            generator_key="choice.picker",
            data_type="string",
            options={
                "choices": [
                    "Active",
                    "Inactive",
                ],
            },
        )

    def test_choice_generator_rejects_empty_choices(self):
        with self.assertRaises(GeneratorValidationError):
            validate_generator_configuration(
                generator_key="choice.picker",
                data_type="string",
                options={
                    "choices": [],
                },
            )

    def test_email_domain_configuration_is_valid(self):
        validate_generator_configuration(
            generator_key="internet.email",
            data_type="string",
            options={
                "domain": "example.com",
            },
        )

    def test_email_domain_must_be_string(self):
        with self.assertRaises(GeneratorValidationError):
            validate_generator_configuration(
                generator_key="internet.email",
                data_type="string",
                options={
                    "domain": 123,
                },
            )

    def test_text_sentence_word_count_is_valid(self):
        validate_generator_configuration(
            generator_key="text.sentence",
            data_type="string",
            options={
                "words": 10,
            },
        )

    def test_text_sentence_word_count_must_be_in_range(self):
        with self.assertRaises(GeneratorValidationError):
            validate_generator_configuration(
                generator_key="text.sentence",
                data_type="string",
                options={
                    "words": 101,
                },
            )

    def test_text_paragraph_sentence_count_is_valid(self):
        validate_generator_configuration(
            generator_key="text.paragraph",
            data_type="string",
            options={
                "sentences": 5,
            },
        )

    def test_text_paragraph_sentence_count_must_be_in_range(self):
        with self.assertRaises(GeneratorValidationError):
            validate_generator_configuration(
                generator_key="text.paragraph",
                data_type="string",
                options={
                    "sentences": 51,
                },
            )


class GeneratorExecutionTestCase(SimpleTestCase):
    def test_person_full_name_generates_string(self):
        generator = get_generator("person.full_name")

        value = generator.generate({})

        self.assertIsInstance(value, str)
        self.assertTrue(value.strip())

    def test_person_first_name_generates_string(self):
        generator = get_generator("person.first_name")

        value = generator.generate({})

        self.assertIsInstance(value, str)
        self.assertTrue(value.strip())

    def test_person_last_name_generates_string(self):
        generator = get_generator("person.last_name")

        value = generator.generate({})

        self.assertIsInstance(value, str)
        self.assertTrue(value.strip())

    def test_person_username_generates_string(self):
        generator = get_generator("person.username")

        value = generator.generate({})

        self.assertIsInstance(value, str)
        self.assertTrue(value.strip())

    def test_person_job_title_generates_string(self):
        generator = get_generator("person.job_title")

        value = generator.generate({})

        self.assertIsInstance(value, str)
        self.assertTrue(value.strip())

    def test_address_generators_generate_strings(self):
        keys = [
            "address.city",
            "address.country",
            "address.street",
            "address.zipcode",
        ]

        for key in keys:
            with self.subTest(key=key):
                value = get_generator(key).generate({})

                self.assertIsInstance(value, str)
                self.assertTrue(value.strip())

    def test_company_name_generates_string(self):
        generator = get_generator("company.name")

        value = generator.generate({})

        self.assertIsInstance(value, str)
        self.assertTrue(value.strip())

    def test_commerce_product_name_generates_string(self):
        generator = get_generator("commerce.product_name")

        value = generator.generate({})

        self.assertIsInstance(value, str)
        self.assertTrue(value.strip())

    def test_commerce_category_generates_known_value(self):
        generator = get_generator("commerce.category")

        value = generator.generate({})

        self.assertIn(
            value,
            [
                "Electronics",
                "Clothing",
                "Books",
                "Food",
                "Toys",
                "Furniture",
                "Sports",
                "Beauty",
            ],
        )

    def test_commerce_currency_generates_known_currency(self):
        generator = get_generator("commerce.currency")

        value = generator.generate({})

        self.assertIn(
            value,
            [
                "USD",
                "EUR",
                "GBP",
                "INR",
                "JPY",
            ],
        )

    def test_commerce_price_generates_decimal(self):
        generator = get_generator("commerce.price")

        value = generator.generate({})

        self.assertIsInstance(value, Decimal)
        self.assertGreaterEqual(value, Decimal("10"))
        self.assertLessEqual(value, Decimal("1000"))

    def test_commerce_price_respects_options(self):
        generator = get_generator("commerce.price")

        value = generator.generate(
            {
                "minimum": 50,
                "maximum": 50,
                "decimal_places": 2,
            }
        )

        self.assertEqual(
            value,
            Decimal("50.00"),
        )

    def test_random_integer_generates_integer(self):
        generator = get_generator("random.integer")

        value = generator.generate(
            {
                "minimum": 10,
                "maximum": 20,
            }
        )

        self.assertIsInstance(value, int)
        self.assertGreaterEqual(value, 10)
        self.assertLessEqual(value, 20)

    def test_random_integer_respects_fixed_range(self):
        generator = get_generator("random.integer")

        value = generator.generate(
            {
                "minimum": 50,
                "maximum": 50,
            }
        )

        self.assertEqual(value, 50)

    def test_random_decimal_generates_decimal(self):
        generator = get_generator("random.decimal")

        value = generator.generate(
            {
                "minimum": 10,
                "maximum": 20,
                "decimal_places": 2,
            }
        )

        self.assertIsInstance(value, Decimal)
        self.assertGreaterEqual(value, Decimal("10"))
        self.assertLessEqual(value, Decimal("20"))

    def test_random_decimal_respects_fixed_range(self):
        generator = get_generator("random.decimal")

        value = generator.generate(
            {
                "minimum": 25,
                "maximum": 25,
                "decimal_places": 2,
            }
        )

        self.assertEqual(
            value,
            Decimal("25.00"),
        )

    def test_random_boolean_generates_boolean(self):
        generator = get_generator("random.boolean")

        value = generator.generate({})

        self.assertIsInstance(value, bool)

    def test_random_boolean_zero_probability_is_always_false(self):
        generator = get_generator("random.boolean")

        for _ in range(10):
            value = generator.generate(
                {
                    "true_probability": 0,
                }
            )

            self.assertFalse(value)

    def test_random_boolean_full_probability_is_always_true(self):
        generator = get_generator("random.boolean")

        for _ in range(10):
            value = generator.generate(
                {
                    "true_probability": 100,
                }
            )

            self.assertTrue(value)

    def test_uuid_generator_generates_uuid(self):
        generator = get_generator("uuid.v4")

        value = generator.generate({})

        self.assertIsInstance(value, UUID)
        self.assertEqual(
            value.version,
            4,
        )

    def test_choice_generator_returns_configured_choice(self):
        generator = get_generator("choice.picker")

        choices = [
            "Active",
            "Inactive",
        ]

        value = generator.generate(
            {
                "choices": choices,
            }
        )

        self.assertIn(
            value,
            choices,
        )

    def test_email_generator_generates_email(self):
        generator = get_generator("internet.email")

        value = generator.generate({})

        self.assertIsInstance(value, str)
        self.assertIn("@", value)

    def test_email_generator_respects_domain(self):
        generator = get_generator("internet.email")

        value = generator.generate(
            {
                "domain": "example.com",
            }
        )

        self.assertTrue(value.endswith("@example.com"))

    def test_url_generator_generates_string(self):
        generator = get_generator("internet.url")

        value = generator.generate({})

        self.assertIsInstance(value, str)
        self.assertTrue(value.startswith(("http://", "https://")))

    def test_domain_generator_generates_string(self):
        generator = get_generator("internet.domain")

        value = generator.generate({})

        self.assertIsInstance(value, str)
        self.assertTrue(value.strip())

    def test_phone_generator_generates_string(self):
        generator = get_generator("internet.phone")

        value = generator.generate({})

        self.assertIsInstance(value, str)
        self.assertTrue(value.strip())

    def test_date_generator_generates_date(self):
        generator = get_generator("datetime.date")

        value = generator.generate({})

        self.assertIsInstance(value, date)
        self.assertNotIsInstance(value, datetime)

    def test_datetime_generator_generates_datetime(self):
        generator = get_generator("datetime.datetime")

        value = generator.generate({})

        self.assertIsInstance(value, datetime)

    def test_text_sentence_generates_string(self):
        generator = get_generator("text.sentence")

        value = generator.generate(
            {
                "words": 5,
            }
        )

        self.assertIsInstance(value, str)
        self.assertTrue(value.strip())

    def test_text_paragraph_generates_string(self):
        generator = get_generator("text.paragraph")

        value = generator.generate(
            {
                "sentences": 3,
            }
        )

        self.assertIsInstance(value, str)
        self.assertTrue(value.strip())
