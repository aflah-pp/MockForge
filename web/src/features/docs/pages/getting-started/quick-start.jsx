import DocLayout from "@/features/docs/components/layout/doc-layout";
import MarkdownRenderer from "@/features/docs/components/markdown/md-rendorer";
import DocsPagination from "@/features/docs/components/navigation/doc-pagination";

const content = `
# Quick Start

Let's create your first MockForge API.

This example creates a simple **Product API** for an ecommerce application.

## 1. Create a project

From the dashboard, create a new project.

Use:

\`\`\`text
Name: Ecommerce
\`\`\`

A project is the container for everything related to your API.

## 2. Create a resource

Inside the Ecommerce project, create a resource:

\`\`\`text
Product
\`\`\`

The resource represents the data your API will provide.

Your structure now looks like:

\`\`\`text
Ecommerce
└── Product
\`\`\`

## 3. Add fields

Add the fields that your Product resource needs.

For example:

| Field | Type | Generator |
| --- | --- | --- |
| name | String | Company Name |
| price | Decimal | Price |
| stock | Integer | Integer |
| image | Image URL | Placeholder Image |

You can configure the generator for each field depending on the kind of data you want.

## 4. Generate your API

Once your resource is ready, MockForge provides a mock API endpoint based on your project and resource.

For example:

\`\`\`text
/api/ecommerce/products
\`\`\`

The endpoint uses the project and resource slugs.

## 5. Make a request

Send a GET request to your endpoint:

\`\`\`http
GET /api/ecommerce/products
\`\`\`

You can test the endpoint directly in your browser, Postman, Insomnia, or your frontend application.

## 6. Get your mock data

MockForge generates data based on the fields and generators you configured.

For example:

\`\`\`json
[
  {
    "id": 1,
    "name": "Acme Corporation",
    "price": 2499.99,
    "stock": 42,
    "image": "https://example.com/image.jpg"
  },
  {
    "id": 2,
    "name": "Global Industries",
    "price": 1599.5,
    "stock": 18,
    "image": "https://example.com/image.jpg"
  }
]
\`\`\`

The exact generated values will vary.

## 7. Use it in your application

You can now use the endpoint from your frontend.

For example:

\`\`\`javascript
const response = await fetch(
  "https://your-mockforge-url/api/ecommerce/products"
);

const products = await response.json();
\`\`\`

You can also use Axios or any other HTTP client.

## That's it

You now have a working mock API without creating a backend or database model for Product.

The complete flow is:

\`\`\`text
Project
  ↓
Resource
  ↓
Fields
  ↓
Generators
  ↓
Mock API
  ↓
JSON Response
\`\`\`

## What's next?

Continue with **Project Structure** to understand how MockForge organizes projects, resources, fields, and data generators.
`;

function QuickStart() {
  return (
    <DocLayout>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <MarkdownRenderer>{content}</MarkdownRenderer>
        <DocsPagination />
      </div>
    </DocLayout>
  );
}

export default QuickStart;
