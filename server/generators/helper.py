from .registry import get_generator


def get_generator_data_type(generator_key):
    generator = get_generator(generator_key)

    if generator is None:
        raise ValueError(f"Unknown generator: {generator_key}")

    supported_types = tuple(generator.supported_types)

    if not supported_types:
        raise ValueError(
            f"Generator '{generator_key}' does not define a supported data type."
        )

    if len(supported_types) != 1:
        raise ValueError(
            f"Generator '{generator_key}' must support exactly one data type."
        )

    return supported_types[0]
