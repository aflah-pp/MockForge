import DocLayout from "@/features/docs/components/layout/doc-layout";
import MarkdownRenderer from "@/features/docs/components/markdown/md-rendorer";
import DocsPagination from "@/features/docs/components/navigation/doc-pagination";

const content = `
# Introduction

Welcome to **MockForge**.

MockForge helps you create mock APIs without building the backend first.

If you are building a frontend and need some API data, you can create it in MockForge and start using it immediately.

## What can you do with MockForge?

You can:

- Create projects
- Create API resources
- Add fields to your resources
- Choose how each field should generate data
- Publish your resource
- Get a mock API URL
- Use that API in your application

For example, if you are building an ecommerce application, you could create:

\`\`\`text
Ecommerce
└── Product
    ├── name
    ├── price
    ├── stock
    └── image
\`\`\`

MockForge will generate data for these fields when your API is requested.

## Why use MockForge?

Imagine you are building a frontend and you need:

\`\`\`text
GET /products
\`\`\`

But the real backend is not ready yet.

Instead of waiting for the backend, you can create the same kind of API with MockForge.

Your workflow becomes:

\`\`\`text
Frontend
   ↓
MockForge
   ↓
JSON data
\`\`\`

You can continue building your pages, tables, forms, loading states, and other frontend features while the real backend is being developed.

## How MockForge works

You only need to understand three things to get started.

### Project

A project is where you keep your API resources.

For example:

\`\`\`text
Ecommerce
\`\`\`

### Resource

A resource represents something your API provides.

For example:

\`\`\`text
Product
User
Order
Category
\`\`\`

### Field

Fields are the data inside a resource.

For example:

\`\`\`text
Product
├── name
├── price
├── stock
└── image
\`\`\`

You then choose a generator for each field.

For example:

\`\`\`text
name
↓
Full Name
↓
"John Smith"
\`\`\`

## Your API

After creating your resource and fields, publish it and MockForge gives you a mock API endpoint.

You can then use that endpoint from:

- React
- Vue
- Angular
- React Native
- Flutter
- JavaScript
- Axios
- Fetch
- Postman
- Any HTTP client

## Does MockForge store fake records?

No.

You create the structure of your API in MockForge.

When someone requests the mock endpoint, MockForge generates the data.

You don't need to manually create hundreds of fake records.

## What MockForge is for

MockForge is mainly useful when:

- Your frontend needs an API before the backend is ready.
- You want realistic data while developing.
- You want to quickly prototype an application.
- You want a simple API for testing.

MockForge is not meant to replace your production backend.

It is a tool that helps you build and test applications faster.

## Ready to start?

If you are running MockForge yourself, continue with **Installation**.

If MockForge is already running, go directly to **Quick Start**.
`;

function Introduction() {
  return (
    <DocLayout>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <MarkdownRenderer>{content}</MarkdownRenderer>

        <DocsPagination />
      </div>
    </DocLayout>
  );
}

export default Introduction;
