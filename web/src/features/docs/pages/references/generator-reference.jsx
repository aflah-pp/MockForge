import DocLayout from "@/features/docs/components/layout/doc-layout";
import MarkdownRenderer from "@/features/docs/components/markdown/md-rendorer";
import DocsPagination from "@/features/docs/components/navigation/doc-pagination";

const content = `
# Generators

Generators are used to create values for your fields.

When you create a field, you select a generator that matches the field type.

For example:

\`\`\`text
Field:
name

Type:
String

Generator:
person.full_name
\`\`\`

MockForge generates the value when the mock API is requested.

## Generator format

Each generator has:

- A generator key
- Supported field types
- Optional configuration values

The generator list can also be retrieved from:

\`\`\`http
GET /api/v1/generators/
\`\`\`

Example:

\`\`\`json
{
  "key": "person.full_name",
  "supported_types": ["string"],
  "options": []
}
\`\`\`

## Address generators

### address.city

Generates a city name.

Supported type:

\`\`\`text
string
\`\`\`

### address.country

Generates a country name.

Supported type:

\`\`\`text
string
\`\`\`

### address.street

Generates a street address.

Supported type:

\`\`\`text
string
\`\`\`

### address.zipcode

Generates a ZIP or postal code.

Supported type:

\`\`\`text
string
\`\`\`

## Choice generators

### choice.picker

Selects a value from a list of choices.

Supported type:

\`\`\`text
string
\`\`\`

Option:

\`\`\`text
choices
\`\`\`

Example configuration:

\`\`\`text
choices:
Apple, Samsung, Google
\`\`\`

This generator is useful when you want generated values to come from a specific set of values.

## Commerce generators

### commerce.category

Generates a product category.

Supported type:

\`\`\`text
string
\`\`\`

### commerce.currency

Generates a currency value.

Supported type:

\`\`\`text
string
\`\`\`

### commerce.price

Generates a decimal price.

Supported type:

\`\`\`text
decimal
\`\`\`

Options:

\`\`\`text
decimal_places
minimum
maximum
\`\`\`

These options can be used to control the generated price.

### commerce.product_name

Generates a product name.

Supported type:

\`\`\`text
string
\`\`\`

## Company generators

### company.name

Generates a company name.

Supported type:

\`\`\`text
string
\`\`\`

## Date and time generators

### datetime.date

Generates a date.

Supported type:

\`\`\`text
date
\`\`\`

Options:

\`\`\`text
start
end
\`\`\`

### datetime.datetime

Generates a date and time value.

Supported type:

\`\`\`text
datetime
\`\`\`

Options:

\`\`\`text
start
end
\`\`\`

## Internet generators

### internet.domain

Generates a domain name.

Supported type:

\`\`\`text
string
\`\`\`

### internet.email

Generates an email address.

Supported type:

\`\`\`text
string
\`\`\`

Option:

\`\`\`text
domain
\`\`\`

The domain option can be used when you want generated emails to use a specific domain.

### internet.phone

Generates a phone number.

Supported type:

\`\`\`text
string
\`\`\`

### internet.url

Generates a URL.

Supported type:

\`\`\`text
string
\`\`\`

## Person generators

### person.first_name

Generates a first name.

Supported type:

\`\`\`text
string
\`\`\`

### person.full_name

Generates a full name.

Supported type:

\`\`\`text
string
\`\`\`

### person.job_title

Generates a job title.

Supported type:

\`\`\`text
string
\`\`\`

### person.last_name

Generates a last name.

Supported type:

\`\`\`text
string
\`\`\`

### person.username

Generates a username.

Supported type:

\`\`\`text
string
\`\`\`

## Random generators

### random.boolean

Generates a boolean value.

Supported type:

\`\`\`text
boolean
\`\`\`

Option:

\`\`\`text
true_probability
\`\`\`

This controls how likely the generated value is to be true.

### random.decimal

Generates a random decimal value.

Supported type:

\`\`\`text
decimal
\`\`\`

Options:

\`\`\`text
decimal_places
minimum
maximum
\`\`\`

### random.integer

Generates a random integer.

Supported type:

\`\`\`text
integer
\`\`\`

Options:

\`\`\`text
minimum
maximum
\`\`\`

## Text generators

### text.paragraph

Generates a paragraph of text.

Supported type:

\`\`\`text
string
\`\`\`

Option:

\`\`\`text
sentences
\`\`\`

### text.sentence

Generates a sentence.

Supported type:

\`\`\`text
string
\`\`\`

Option:

\`\`\`text
words
\`\`\`

## UUID generators

### uuid.v4

Generates a UUID version 4 value.

Supported type:

\`\`\`text
uuid
\`\`\`

## Generator summary

| Generator | Type | Options |
| --- | --- | --- |
| address.city | string | None |
| address.country | string | None |
| address.street | string | None |
| address.zipcode | string | None |
| choice.picker | string | choices |
| commerce.category | string | None |
| commerce.currency | string | None |
| commerce.price | decimal | decimal_places, minimum, maximum |
| commerce.product_name | string | None |
| company.name | string | None |
| datetime.date | date | start, end |
| datetime.datetime | datetime | start, end |
| internet.domain | string | None |
| internet.email | string | domain |
| internet.phone | string | None |
| internet.url | string | None |
| person.first_name | string | None |
| person.full_name | string | None |
| person.job_title | string | None |
| person.last_name | string | None |
| person.username | string | None |
| random.boolean | boolean | true_probability |
| random.decimal | decimal | decimal_places, minimum, maximum |
| random.integer | integer | minimum, maximum |
| text.paragraph | string | sentences |
| text.sentence | string | words |
| uuid.v4 | uuid | None |

## Choosing a generator

Choose a generator based on the field you are creating.

For example:

\`\`\`text
Field       Type        Generator

name        string      person.full_name
email       string      internet.email
price       decimal     commerce.price
stock       integer     random.integer
active      boolean     random.boolean
created_at  datetime    datetime.datetime
id          uuid        uuid.v4
\`\`\`

The generator must support the field type you selected.

If a generator does not support the selected field type, it cannot be used for that field.

## What's next?

You can now use these generators when creating fields and configuring your mock resources.
`;

function GeneratorsReference() {
  return (
    <DocLayout>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <MarkdownRenderer>{content}</MarkdownRenderer>

        <DocsPagination />
      </div>
    </DocLayout>
  );
}

export default GeneratorsReference;
