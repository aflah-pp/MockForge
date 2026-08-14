import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DocLayout from "@/features/docs/components/layout/doc-layout";
import MarkdownRenderer from "@/features/docs/components/markdown/md-rendorer";

const content = `# Getting Started

Welcome to **MockForge**.

MockForge lets you create mock REST APIs without building a backend from scratch.

Define your **projects**, **resources**, and **fields**, choose how your data should be generated, and get an API you can use in your application.

## How MockForge works

The basic structure is:

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
\`\`\`

A **project** contains your API resources.

A **resource** represents something such as a product, user, company, or order.

**Fields** define the data returned by that resource.

**Generators** determine how MockForge creates realistic values for those fields.

## Your first API

A typical MockForge workflow looks like this:

1. Create a project.
2. Create a resource.
3. Add fields.
4. Configure field generators.
5. Get your mock API URL.
6. Use the API in your application.

For example:

\`\`\`text
Ecommerce
└── Product
    ├── name
    ├── price
    ├── stock
    └── image
\`\`\`

This can produce an endpoint such as:

\`\`\`text
/api/ecommerce/products
\`\`\`

A GET request returns generated JSON based on your resource definition.

## Built for developers

MockForge is useful when you need an API before the real backend is ready.

You can use your mock API with:

- React
- Vue
- Angular
- Flutter
- React Native
- JavaScript
- Axios
- Any HTTP client

## Version 1

MockForge V1 focuses on simple mock GET APIs with dynamically generated data.

It includes:

- Projects
- Resources
- Fields
- Configurable generators
- Dynamic fake data
- Image URL fields
- File URL fields
- JWT authentication

Advanced API features such as pagination, filtering, sorting, CRUD operations, and resource relationships are outside the scope of V1.

## Continue

Ready to build?

Start with **Installation**, or jump directly to **Quick Start** if you already have MockForge running.

If you want to understand the architecture first, read **Project Structure**.`;

function GettingStarted() {
  return (
    <DocLayout>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <MarkdownRenderer>{content}</MarkdownRenderer>
        <div className="mt-8 mb-18">
          <Button asChild>
            <Link to="/docs/getting-started/introduction">Start Building</Link>
          </Button>
        </div>
      </div>
    </DocLayout>
  );
}

export default GettingStarted;
