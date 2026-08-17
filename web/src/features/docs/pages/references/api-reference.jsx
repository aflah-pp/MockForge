import DocLayout from "@/features/docs/components/layout/doc-layout";
import MarkdownRenderer from "@/features/docs/components/markdown/md-rendorer";
import DocsPagination from "@/features/docs/components/navigation/doc-pagination";

const content = `
# API Reference

This page describes the MockForge API currently available in V1.

MockForge provides API endpoints for managing your account, projects, resources, fields, and generated mock data.

## Base URL

When running MockForge locally:

\`\`\`text
http://127.0.0.1:8000
\`\`\`

The API is available under:

\`\`\`text
/api/v1/
\`\`\`

If you are using a hosted MockForge instance, replace the local URL with your hosted API URL.

## Authentication

Most management endpoints require authentication.

MockForge uses JWT authentication.

After signing in, the application uses the authenticated session when making requests.

Public mock API endpoints are intended to be consumed by your frontend application without exposing your MockForge management credentials.

## Main API areas

### Authentication

Authentication endpoints are available under:

\`\`\`text
/api/v1/users/
\`\`\`

These endpoints handle operations such as:

- Registration
- Login
- Token refresh
- Logout
- Current user information
- Password changes
- Email verification
- Account deactivation

### Projects

Projects contain the resources that belong to your mock API.

The project API is available under:

\`\`\`text
/api/v1/projects/
\`\`\`

Projects can be created, viewed, updated, published, unpublished, and deleted according to the available application permissions.

### Resources

Resources represent the objects exposed by your mock API.

For example:

\`\`\`text
Product
User
Order
Category
\`\`\`

Resources belong to projects.

A resource can contain multiple fields.

### Fields

Fields define the data returned by a resource.

For example:

\`\`\`text
Product

name
price
stock
image
\`\`\`

Fields also contain the configuration that determines how their values are generated.

### Generators

MockForge exposes the available generator definitions through:

\`\`\`text
GET /api/v1/generators/
\`\`\`

The generator endpoint tells the frontend which generators are available, which field types they support, and which options they accept.

For example:

\`\`\`json
{
  "key": "person.full_name",
  "supported_types": ["string"],
  "options": []
}
\`\`\`

### Mock API

After creating and publishing a resource, MockForge provides a mock endpoint that can be called by your application.

A typical endpoint follows the project and resource structure.

For example:

\`\`\`text
/api/ecommerce/products
\`\`\`

A GET request returns generated JSON based on the resource's field configuration.

## HTTP methods

V1 currently focuses on GET mock endpoints.

The generated mock API is intended for reading generated data.

Advanced REST operations such as:

\`\`\`text
POST
PUT
PATCH
DELETE
\`\`\`

are planned for future versions.

## Example request

A frontend application can request a mock endpoint using a normal HTTP request:

\`\`\`text
GET /api/ecommerce/products
\`\`\`

The response contains generated data based on the configured fields.

## Example response

A resource might return:

\`\`\`json
[
  {
    "id": 1,
    "name": "Example Product",
    "price": 29.99,
    "stock": 42
  },
  {
    "id": 2,
    "name": "Another Product",
    "price": 59.99,
    "stock": 18
  }
]
\`\`\`

The actual values are generated dynamically.

## V1 scope

The current API focuses on:

- Authentication
- Project management
- Resource management
- Field management
- Generator configuration
- Generated GET mock APIs

Features such as pagination, filtering, sorting, relationships, and full CRUD mock endpoints are planned for future releases.

## Next step

For the available data generators and their configuration options, continue with **Generators**.
`;

function ApiReference() {
  return (
    <DocLayout>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <MarkdownRenderer>{content}</MarkdownRenderer>

        <DocsPagination />
      </div>
    </DocLayout>
  );
}

export default ApiReference;
