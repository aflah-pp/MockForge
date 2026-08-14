from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from rest_framework import serializers


class RuntimeQuerySerializer(serializers.Serializer):
    count = serializers.IntegerField(
        required=False,
        default=1,
        min_value=1,
        max_value=10,
    )


class RuntimeResponseSerializer:
    @classmethod
    def serialize(cls, data):
        if isinstance(data, list):
            return [cls._serialize_record(record) for record in data]

        return cls._serialize_record(data)

    @classmethod
    def _serialize_record(cls, record):
        return {key: cls._serialize_value(value) for key, value in record.items()}

    @staticmethod
    def _serialize_value(value):
        if isinstance(value, UUID):
            return str(value)

        if isinstance(value, datetime):
            return value.isoformat()

        if isinstance(value, date):
            return value.isoformat()

        if isinstance(value, Decimal):
            return float(value)

        return value
