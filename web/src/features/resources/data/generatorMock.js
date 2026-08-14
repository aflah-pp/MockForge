const generatorUiMetadata = {
  "address.city": {
    label: "City",
    description: "Generates a realistic city name.",
  },

  "address.country": {
    label: "Country",
    description: "Generates a realistic country name.",
  },

  "address.street": {
    label: "Street Address",
    description: "Generates a realistic street address.",
  },

  "address.zipcode": {
    label: "Postal Code",
    description: "Generates a realistic postal code.",
  },

  "choice.picker": {
    label: "Choice Picker",
    description: "Generates a random value from a configured list of choices.",
    options: {
      choices: {
        label: "Choices",
        type: "list",
        default: [],
        placeholder: "Enter a choice",
      },
    },
  },

  "commerce.category": {
    label: "Product Category",
    description: "Generates a random product category.",
  },

  "commerce.currency": {
    label: "Currency",
    description: "Generates a random ISO 4217 currency code.",
  },

  "commerce.price": {
    label: "Price",
    description: "Generates a random decimal price within configurable bounds.",
    options: {
      minimum: {
        label: "Minimum Value",
        type: "number",
        default: 10,
      },
      maximum: {
        label: "Maximum Value",
        type: "number",
        default: 1000,
      },
      decimal_places: {
        label: "Decimal Places",
        type: "number",
        default: 2,
        min: 0,
        max: 10,
      },
    },
  },

  "commerce.product_name": {
    label: "Product Name",
    description: "Generates a realistic product name.",
  },

  "company.name": {
    label: "Company Name",
    description: "Generates a realistic company name.",
  },

  "datetime.date": {
    label: "Date",
    description: "Generates a random calendar date within a configurable range.",
    options: {
      start: {
        label: "Start Date",
        type: "text",
        default: "-10y",
        placeholder: "-10y",
      },
      end: {
        label: "End Date",
        type: "text",
        default: "today",
        placeholder: "today",
      },
    },
  },

  "datetime.datetime": {
    label: "Date & Time",
    description: "Generates a random datetime within a configurable range.",
    options: {
      start: {
        label: "Start Date",
        type: "text",
        default: "-10y",
        placeholder: "-10y",
      },
      end: {
        label: "End Date",
        type: "text",
        default: "now",
        placeholder: "now",
      },
    },
  },

  "internet.domain": {
    label: "Domain",
    description: "Generates a realistic domain name.",
  },

  "internet.email": {
    label: "Email Address",
    description: "Generates a realistic email address.",
    options: {
      domain: {
        label: "Email Domain",
        type: "text",
        default: "",
        placeholder: "example.com",
      },
    },
  },

  "internet.phone": {
    label: "Phone Number",
    description: "Generates a realistic telephone number.",
  },

  "internet.url": {
    label: "URL",
    description: "Generates a realistic URL.",
  },

  "person.first_name": {
    label: "First Name",
    description: "Generates a realistic person's first name.",
  },

  "person.full_name": {
    label: "Full Name",
    description: "Generates a realistic person's full name.",
  },

  "person.job_title": {
    label: "Job Title",
    description: "Generates a realistic job title.",
  },

  "person.last_name": {
    label: "Last Name",
    description: "Generates a realistic person's last name.",
  },

  "person.username": {
    label: "Username",
    description: "Generates a realistic username.",
  },

  "random.boolean": {
    label: "Random Boolean",
    description: "Generates a random true or false value.",
    options: {
      true_probability: {
        label: "True Probability",
        type: "number",
        default: 50,
        min: 0,
        max: 100,
      },
    },
  },

  "random.decimal": {
    label: "Random Decimal",
    description: "Generates a random decimal value within configurable bounds.",
    options: {
      minimum: {
        label: "Minimum Value",
        type: "number",
        default: 0,
      },
      maximum: {
        label: "Maximum Value",
        type: "number",
        default: 1000,
      },
      decimal_places: {
        label: "Decimal Places",
        type: "number",
        default: 2,
        min: 0,
        max: 10,
      },
    },
  },

  "random.integer": {
    label: "Random Integer",
    description: "Generates a random integer within configurable bounds.",
    options: {
      minimum: {
        label: "Minimum Value",
        type: "number",
        default: 1,
      },
      maximum: {
        label: "Maximum Value",
        type: "number",
        default: 100,
      },
    },
  },

  "text.paragraph": {
    label: "Paragraph",
    description: "Generates a realistic paragraph.",
    options: {
      sentences: {
        label: "Number of Sentences",
        type: "number",
        default: 3,
        min: 1,
        max: 50,
      },
    },
  },

  "text.sentence": {
    label: "Sentence",
    description: "Generates a realistic sentence.",
    options: {
      words: {
        label: "Number of Words",
        type: "number",
        default: 6,
        min: 1,
        max: 100,
      },
    },
  },

  "uuid.v4": {
    label: "UUID v4",
    description: "Generates a UUID version 4 value.",
  },
};

const backendGenerators = [
  {
    key: "address.city",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "address.country",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "address.street",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "address.zipcode",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "choice.picker",
    supported_types: ["string"],
    options: ["choices"],
  },
  {
    key: "commerce.category",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "commerce.currency",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "commerce.price",
    supported_types: ["decimal"],
    options: ["decimal_places", "maximum", "minimum"],
  },
  {
    key: "commerce.product_name",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "company.name",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "datetime.date",
    supported_types: ["date"],
    options: ["end", "start"],
  },
  {
    key: "datetime.datetime",
    supported_types: ["datetime"],
    options: ["end", "start"],
  },
  {
    key: "internet.domain",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "internet.email",
    supported_types: ["string"],
    options: ["domain"],
  },
  {
    key: "internet.phone",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "internet.url",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "person.first_name",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "person.full_name",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "person.job_title",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "person.last_name",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "person.username",
    supported_types: ["string"],
    options: [],
  },
  {
    key: "random.boolean",
    supported_types: ["boolean"],
    options: ["true_probability"],
  },
  {
    key: "random.decimal",
    supported_types: ["decimal"],
    options: ["decimal_places", "maximum", "minimum"],
  },
  {
    key: "random.integer",
    supported_types: ["integer"],
    options: ["maximum", "minimum"],
  },
  {
    key: "text.paragraph",
    supported_types: ["string"],
    options: ["sentences"],
  },
  {
    key: "text.sentence",
    supported_types: ["string"],
    options: ["words"],
  },
  {
    key: "uuid.v4",
    supported_types: ["uuid"],
    options: [],
  },
];

export const mockGenerators = backendGenerators.map((generator) => ({
  ...generator,
  label: generatorUiMetadata[generator.key]?.label ?? generator.key,
  description: generatorUiMetadata[generator.key]?.description ?? "Generates a mock value.",
  options: generator.options.map((optionKey) => ({
    key: optionKey,
    label: generatorUiMetadata[generator.key]?.options?.[optionKey]?.label ?? optionKey,
    type: generatorUiMetadata[generator.key]?.options?.[optionKey]?.type ?? "text",
    default: generatorUiMetadata[generator.key]?.options?.[optionKey]?.default ?? "",
    placeholder: generatorUiMetadata[generator.key]?.options?.[optionKey]?.placeholder,
    min: generatorUiMetadata[generator.key]?.options?.[optionKey]?.min,
    max: generatorUiMetadata[generator.key]?.options?.[optionKey]?.max,
  })),
}));

export function getGeneratorsForType(dataType) {
  return mockGenerators.filter((generator) => generator.supported_types.includes(dataType));
}

export function getGeneratorByKey(key) {
  return mockGenerators.find((generator) => generator.key === key);
}
