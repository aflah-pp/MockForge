import DocLayout from "@/features/docs/components/layout/doc-layout";
import MarkdownRenderer from "@/features/docs/components/markdown/md-rendorer";
import DocsPagination from "@/features/docs/components/navigation/doc-pagination";

const content = `
# What's Coming

Mokvio V1 is intentionally small.

The goal is to make creating a useful mock API as simple as possible before adding more advanced features.

## V1 — Foundation

The first version focuses on:

- Projects
- Resources
- Custom fields
- Configurable data generators
- Dynamic fake data
- GET mock endpoints
- Image URL fields
- File URL fields
- JWT authentication

The foundation is designed so these features can be expanded without rebuilding the core system.

## Future

Features being considered for future versions include:

### CRUD APIs

Support for:

- POST
- PUT
- PATCH
- DELETE

This would allow Mokvio to behave more like a complete temporary backend.

### Pagination

Configure the number of records returned by an endpoint and control page size.

### Filtering

Allow developers to filter generated data using query parameters.

For example:

\`\`\`text
/api/ecommerce/products?category=electronics
\`\`\`

### Sorting

Allow API responses to be sorted using query parameters.

### Resource Relationships

Connect resources together.

For example:

\`\`\`text
User
 └── Orders

Order
 └── Products
\`\`\`

This would make it possible to create more realistic API responses.

### OpenAPI Support

Generate or import OpenAPI specifications so developers can work with existing API definitions.

### More Data Generators

Expand the Generator Engine with additional generators and configurable options.

### Real File Generation

Move beyond file URLs and support generated files such as PDFs and other downloadable content.

### CLI

A command-line interface may be introduced for developers who prefer working with Mokvio directly from their terminal.

## Open Source

Mokvio is an open-source project.

The roadmap is expected to evolve based on:

- Developer feedback
- GitHub issues
- Community contributions
- Real-world usage

Features listed here are planned or considered ideas, not guaranteed release commitments.

## Have an idea?

If there is a feature you would like to see in Mokvio, open an issue or start a discussion in the project's GitHub repository.

The best roadmap is one shaped by the developers actually using the tool.
`;

function Roadmap() {
  return (
    <DocLayout>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <MarkdownRenderer>{content}</MarkdownRenderer>
        <DocsPagination />
      </div>
    </DocLayout>
  );
}

export default Roadmap;
