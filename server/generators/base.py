from abc import ABC, abstractmethod
from typing import Any


class BaseGenerator(ABC):
    """
    Base contract for every Mokvio generator.

    A generator must provide a unique database key, declare the field
    data types it supports, validate its configuration options, and
    generate a single value.
    """

    key: str = ""
    supported_types: tuple[str, ...] = ()
    allowed_options: frozenset[str] = frozenset()

    def validate_options(self, options: dict[str, Any]) -> None:
        """
        Validate generator-specific options.

        Args:
            options: Generator configuration supplied by the user.

        Raises:
            ValueError: If the configuration is invalid.
        """

    @abstractmethod
    def generate(self, options: dict[str, Any]) -> Any:
        """
        Generate one value using the supplied options.

        Args:
            options: Validated generator configuration.

        Returns:
            A generated value compatible with the generator's
            declared data types.
        """
        raise NotImplementedError
