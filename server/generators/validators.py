from typing import Any

from .registry import get_generator


class GeneratorValidationError(ValueError):
    """
    Raised when a generator configuration is invalid.
    """


def validate_generator_configuration(
    generator_key: str,
    data_type: str,
    options: dict[str, Any],
) -> None:
    """
    Validate a complete Mokvio generator configuration.

    Validation includes:

    - generator existence
    - supported data type
    - options object type
    - unknown options
    - generator-specific option validation
    """
    try:
        generator = get_generator(generator_key)
    except ValueError as exc:
        raise GeneratorValidationError(str(exc)) from exc

    if data_type not in generator.supported_types:
        raise GeneratorValidationError(
            f"Generator '{generator_key}' does not support " f"data type '{data_type}'."
        )

    if not isinstance(options, dict):
        raise GeneratorValidationError("generator_options must be an object.")

    unknown_options = set(options) - generator.allowed_options

    if unknown_options:
        names = ", ".join(sorted(unknown_options))

        raise GeneratorValidationError(f"Unsupported generator option(s): {names}.")

    try:
        generator.validate_options(options)
    except ValueError as exc:
        raise GeneratorValidationError(str(exc)) from exc
