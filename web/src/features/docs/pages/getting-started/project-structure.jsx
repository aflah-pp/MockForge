import DocLayout from "@/features/docs/components/layout/doc-layout";
import MarkdownRenderer from "@/features/docs/components/markdown/md-rendorer";
import DocsPagination from "@/features/docs/components/navigation/doc-pagination";

const content = `
# Project Structure

MockForge uses a simple structure to define APIs.

The core concepts are:

\`\`\`text
Project
   ↓
Resource
   ↓
Field
   ↓
Generator
\`\`\`

Each part has a specific responsibility.

## Project

A **Project** is the top-level container for your APIs.

For example:

\`\`\`text
Ecommerce
\`\`\`

A project can contain multiple resources.

For example:

\`\`\`text
Ecommerce
├── Product
├── Category
└── Order
\`\`\`

A project belongs to a user and keeps related resources together.

## Resource

A **Resource** represents something your API provides.

Common examples include:

\`\`\`text
Product
User
Company
Order
Student
Employee
\`\`\`

For example, an Ecommerce project could contain:

\`\`\`text
Ecommerce
└── Product
\`\`\`

The resource name is used to build the mock API endpoint.

For example:

\`\`\`text
/api/ecommerce/products
\`\`\`

## Field

A **Field** describes a piece of data belonging to a resource.

For example, a Product could contain:

\`\`\`text
name
price
stock
image
\`\`\`

Each field has a data type and can have a generator.

Example:

| Field | Type | Generator |
| --- | --- | --- |
| name | String | Company Name |
| price | Decimal | Price |
| stock | Integer | Integer |
| image | Image URL | Placeholder Image |

Fields define what the generated response should contain.

## Generator

A **Generator** determines how MockForge creates a value for a field.

For example:

\`\`\`text
email → Email Generator
city  → City Generator
price → Price Generator
name  → Company Name Generator
\`\`\`

MockForge uses a Generator Engine to produce the values.

The Generator Engine can use different underlying tools depending on the generator.

For example:

\`\`\`text
Field
  ↓
Generator
  ↓
Generator Engine
  ↓
Generated Value
\`\`\`

The generator system is designed to be extensible, so new generators can be added without changing the basic Project, Resource, and Field structure.

## Putting everything together

Suppose you create an Ecommerce project.

Your structure could look like:

\`\`\`text
Ecommerce
│
├── Product
│   ├── name
│   ├── price
│   ├── stock
│   └── image
│
└── Category
    ├── name
    └── description
\`\`\`

Each field has its own type and generator configuration.

MockForge uses these definitions to generate the API response.

## API relationship

The project and resource determine the API endpoint:

\`\`\`text
/api/{project_slug}/{resource_slug}
\`\`\`

For example:

\`\`\`text
/api/ecommerce/products
\`\`\`

The fields determine the shape of the response.

For example:

\`\`\`json
[
  {
    "name": "Acme Corporation",
    "price": 2499.99,
    "stock": 42,
    "image": "https://example.com/image.jpg"
  }
]
\`\`\`

## The important idea

MockForge does not create a new Django model every time you create a resource.

Instead, it stores the API definition as metadata:

\`\`\`text
Project
  ↓
Resource
  ↓
Field Definitions
  ↓
Generator Configuration
  ↓
Generated JSON
\`\`\`

This allows users to create different API structures without requiring a new backend model for every resource.

## What's next?

Now that you understand the structure, continue with **Projects** in the Build Your Mock API section.
`;

function ProjectStructure() {
  return (
    <DocLayout>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <MarkdownRenderer>{content}</MarkdownRenderer>
        <DocsPagination />
      </div>
    </DocLayout>
  );
}

export default ProjectStructure;
