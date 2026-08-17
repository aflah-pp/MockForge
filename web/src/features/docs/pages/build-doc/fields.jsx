import DocLayout from "@/features/docs/components/layout/doc-layout";
import MarkdownRenderer from "@/features/docs/components/markdown/md-rendorer";
import DocsPagination from "@/features/docs/components/navigation/doc-pagination";

const content = `
# Fields

Fields define the data returned by a resource.

For example, a Product resource can have:

\`\`\`text
Product
├── name
├── price
├── stock
└── image
\`\`\`

Each field has a name, type, and generator.

## Add a field

Open a resource and select **Add Field**.

For example:

\`\`\`text
Name:
name
\`\`\`

Then select the field type and generator.

Repeat this for the other data your resource needs.

## Example

For a Product resource, you could create:

| Field | Type | Generator |
| --- | --- | --- |
| name | String | Name |
| price | Decimal | Price |
| stock | Integer | Integer |
| image | Image URL | Image URL |

Your resource will now look like:

\`\`\`text
Product
├── name
├── price
├── stock
└── image
\`\`\`

## Field name

Choose a name that clearly describes the data.

Good examples:

\`\`\`text
name
email
price
stock
image
created_at
\`\`\`

Avoid unclear names such as:

\`\`\`text
data1
test
abc
thing
\`\`\`

Clear field names make your API easier to understand.


## Generator

The generator controls how MockForge creates the value.

For example:

\`\`\`text
price
↓
Decimal
↓
Price Generator
↓
2499.99
\`\`\`

You can learn more about generators in **Data Generators**.

## Edit a field

Open the field from the resource and update its configuration.

You can change the available field settings depending on the field type.

## Delete a field

If you no longer need a field, you can delete it from the resource.

After deleting a field, it will no longer be included in the generated API response.

## Example response

If your Product resource contains:

\`\`\`text
name
price
stock
image
\`\`\`

The API could return:

\`\`\`json
{
  "name": "Acme Corporation",
  "price": 2499.99,
  "stock": 42,
  "image": "https://example.com/image.jpg"
}
\`\`\`

The generated values can change between requests.

## What's next?

Your resource now has fields.

Continue with **Data Generators** to learn how MockForge creates realistic values.
`;

function Fields() {
  return (
    <DocLayout>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <MarkdownRenderer>{content}</MarkdownRenderer>
        <DocsPagination />
      </div>
    </DocLayout>
  );
}

export default Fields;
