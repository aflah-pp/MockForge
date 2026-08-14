import DocLayout from "@/features/docs/components/layout/doc-layout";
import MarkdownRenderer from "@/features/docs/components/markdown/md-rendorer";
import DocsPagination from "@/features/docs/components/navigation/doc-pagination";

const content = `
# Introduction

Welcome to **MockForge**.

MockForge is an open-source platform for creating mock REST APIs without building a backend from scratch.

It is designed for developers who need a working API while building a frontend, mobile application, prototype, or testing environment.

## Why MockForge?

When building a frontend, you often need an API before the real backend is ready.

Normally, you might need to:

- Build a backend
- Create database models
- Add test data
- Create API endpoints
- Deploy the backend

MockForge removes that work for simple mock APIs.

You define what your API should look like, and MockForge generates realistic data for you.

## How it works

MockForge is built around three simple concepts:

\`\`\`text
Project
   ↓
Resource
   ↓
Fields
\`\`\`

A **Project** represents an application or API.

A **Resource** represents something in your API, such as:

\`\`\`text
Product
User
Company
Order
Student
\`\`\`

A **Field** describes the data that belongs to a resource.

For example:

\`\`\`text
Product

name
price
stock
image
\`\`\`

You can then choose how MockForge should generate the value for each field.

## Version 1

MockForge V1 focuses on one thing:

> **Create a simple mock REST API quickly.**

V1 includes:

- User authentication
- Projects
- Resources
- Custom fields
- Configurable data generators
- Dynamic fake data
- GET mock endpoints
- Image URL and file URL fields

Advanced API features are outside the scope of V1.

## What's next?

Continue with **Installation** to set up MockForge.
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
