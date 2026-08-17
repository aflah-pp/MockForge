import DocLayout from "@/features/docs/components/layout/doc-layout";
import MarkdownRenderer from "@/features/docs/components/markdown/md-rendorer";
import DocsPagination from "@/features/docs/components/navigation/doc-pagination";

const content = `
# Data Generators

Data generators tell MockForge how to create fake values for your fields.

Instead of manually entering fake data, you choose a generator and MockForge creates the values for you.

## How generators work

The basic flow is:

\`\`\`text
Field
   ↓
Generator
   ↓
Generated value
\`\`\`

For example:

\`\`\`text
name
   ↓
Name Generator
   ↓
John Smith
\`\`\`

Another example:

\`\`\`text
price
   ↓
Price Generator
   ↓
2499.99
\`\`\`

## Select a generator

When creating or editing a field, choose a generator that matches the data you need.

For example:

| Field | Generator | Example |
| --- | --- | --- |
| name | Name | John Smith |
| email | Email | john@example.com |
| price | Price | 2499.99 |
| stock | Integer | 42 |
| image | Image URL | https://example.com/image.jpg |

The generated values can change when the API is requested.

## String data

String generators can be used for fields that contain text.

For example:

\`\`\`text
name
username
company
email
\`\`\`

A name generator could produce:

\`\`\`text
John Smith
Sarah Johnson
Michael Brown
\`\`\`

## Number data

Number generators can be used for fields such as:

\`\`\`text
price
stock
age
quantity
\`\`\`

For example:

\`\`\`text
price → 2499.99
stock → 42
age → 31
\`\`\`

## Boolean data

Boolean fields return either:

\`\`\`text
true
false
\`\`\`

This can be useful for fields such as:

\`\`\`text
is_active
is_verified
is_available
\`\`\`

## Date and DateTime

Date and DateTime generators can be used when your application needs date or time values.

For example:

\`\`\`text
created_at
updated_at
published_at
\`\`\`

A generated DateTime value could look like:

\`\`\`text
2026-08-17T10:30:00Z
\`\`\`

## Image and file URLs

You can use URL generators for fields that need images or files.

For example:

\`\`\`text
image
avatar
file
document
\`\`\`

The generated URL can then be used directly by your frontend.

## Why use generators?

Without generators, you would have to manually create fake values.

For example:

\`\`\`text
Product 1
Product 2
Product 3
Product 4
...
\`\`\`

Generators allow MockForge to create the values automatically.

This is useful when building:

- Product lists
- User tables
- Dashboards
- Admin panels
- Mobile applications
- Loading states
- Frontend prototypes

## Example

Suppose your Product resource contains:

\`\`\`text
name
price
stock
image
\`\`\`

You can configure:

| Field | Generator |
| --- | --- |
| name | Name |
| price | Price |
| stock | Integer |
| image | Image URL |

MockForge uses these settings when generating the API response.

## Generator configuration

Generators are configured for each field.

This means different fields can use different generators.

For example:

\`\`\`text
Product
├── name   → Name
├── price  → Price
├── stock  → Integer
└── image  → Image URL
\`\`\`

## What's next?

Your project now has a resource, fields, and generators.

Continue with **Use Your API** to learn how to connect your MockForge API to your application.
`;

function DataGenerators() {
  return (
    <DocLayout>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <MarkdownRenderer>{content}</MarkdownRenderer>
        <DocsPagination />
      </div>
    </DocLayout>
  );
}

export default DataGenerators;
