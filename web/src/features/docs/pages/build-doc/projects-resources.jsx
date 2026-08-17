import DocLayout from "@/features/docs/components/layout/doc-layout";
import MarkdownRenderer from "@/features/docs/components/markdown/md-rendorer";
import DocsPagination from "@/features/docs/components/navigation/doc-pagination";

const content = `
# Projects & Resources

MockForge uses **projects** and **resources** to organize your mock API.

The basic structure is:

\`\`\`text
Project
   ↓
Resource
   ↓
Fields
   ↓
Mock API
\`\`\`

## Create a project

Open the MockForge dashboard and create a new project.

For example:

\`\`\`text
Ecommerce
\`\`\`

A project contains the resources that belong to your API.

For example:

\`\`\`text
Ecommerce
├── Product
├── User
├── Order
└── Category
\`\`\`

## Create a resource

A resource represents the type of data your API provides.

For example:

\`\`\`text
Product
\`\`\`

Inside the Ecommerce project, create a resource named **Product**.

Your project now looks like:

\`\`\`text
Ecommerce
└── Product
\`\`\`

## Add resources to your project

A project can contain multiple resources.

For example:

\`\`\`text
Ecommerce
├── Product
├── User
├── Order
└── Category
\`\`\`

Each resource can have its own fields and data generators.

## Resource fields

A Product resource could contain:

\`\`\`text
Product
├── name
├── price
├── stock
└── image
\`\`\`

These fields define what data the Product API returns.

You will learn how to create them in the **Fields** section.

## Publish a resource

After creating your resource and configuring its fields, you can publish the resource.

A published resource can be accessed through its generated mock API endpoint.

## Example

Suppose you create:

\`\`\`text
Project:
Ecommerce

Resource:
Product
\`\`\`

After adding fields and publishing the resource, MockForge provides a mock API endpoint for that resource.

You can then use that endpoint from your frontend application.

## What's next?

Your project and resource are ready.

Continue with **Fields** to add data to your resource.
`;

function ProjectsResources() {
  return (
    <DocLayout>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <MarkdownRenderer>{content}</MarkdownRenderer>
        <DocsPagination />
      </div>
    </DocLayout>
  );
}

export default ProjectsResources;
