from .base import BaseGenerator

_REGISTRY: dict[str, BaseGenerator] = {}


def register(generator_class):
    """
    Register a generator class in the MockForge generator registry.

    Generator keys must be unique and every generator must explicitly
    declare the data types it supports.
    """
    instance = generator_class()

    if not instance.key:
        raise ValueError(f"{generator_class.__name__} must define a generator key.")

    if instance.key in _REGISTRY:
        raise ValueError(f"Generator key '{instance.key}' is already registered.")

    if not instance.supported_types:
        raise ValueError(f"Generator '{instance.key}' must define supported types.")

    _REGISTRY[instance.key] = instance

    return generator_class


def get_generator(key: str) -> BaseGenerator:
    """
    Return a registered generator by its database key.

    Raises:
        ValueError: If the generator is not registered.
    """
    try:
        return _REGISTRY[key]
    except KeyError as exc:
        raise ValueError(f"Generator '{key}' not found.") from exc


def list_generators() -> list[str]:
    """
    Return all registered generator keys.
    """
    return sorted(_REGISTRY.keys())


def get_generator_metadata() -> list[dict]:
    """
    Return safe metadata describing all registered generators.

    This metadata can be exposed to the frontend without exposing
    Python implementation details.
    """
    return [
        {
            "key": generator.key,
            "supported_types": list(generator.supported_types),
            "options": sorted(generator.allowed_options),
        }
        for generator in sorted(
            _REGISTRY.values(),
            key=lambda generator: generator.key,
        )
    ]
