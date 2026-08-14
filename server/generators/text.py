from faker import Faker

from .base import BaseGenerator
from .registry import register

fake = Faker()


@register
class SentenceGenerator(BaseGenerator):
    """
    Generate a realistic sentence.
    """

    key = "text.sentence"
    supported_types = ("string",)
    allowed_options = frozenset({"words"})

    def validate_options(self, options):
        words = options.get("words", 6)

        if not isinstance(words, int) or isinstance(words, bool):
            raise ValueError("words must be an integer.")

        if not 1 <= words <= 100:
            raise ValueError("words must be between 1 and 100.")

    def generate(self, options):
        words = options.get("words", 6)

        return fake.sentence(nb_words=words)


@register
class ParagraphGenerator(BaseGenerator):
    """
    Generate a realistic paragraph.
    """

    key = "text.paragraph"
    supported_types = ("string",)
    allowed_options = frozenset({"sentences"})

    def validate_options(self, options):
        sentences = options.get("sentences", 3)

        if not isinstance(sentences, int) or isinstance(sentences, bool):
            raise ValueError("sentences must be an integer.")

        if not 1 <= sentences <= 50:
            raise ValueError("sentences must be between 1 and 50.")

    def generate(self, options):
        sentences = options.get("sentences", 3)

        return fake.paragraph(nb_sentences=sentences)
