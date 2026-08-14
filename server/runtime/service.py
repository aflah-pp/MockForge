from generators.registry import get_generator
from resources.service import ResourceService


class RuntimeService:
    @staticmethod
    def generate_record(resource):
        fields = ResourceService.list_fields(resource)

        record = {}

        for field in fields:
            generator = get_generator(field.generator_key)

            record[field.slug] = generator.generate(
                field.generator_options,
            )

        return record

    @staticmethod
    def generate_records(resource, count=1):
        return [RuntimeService.generate_record(resource) for _ in range(count)]
