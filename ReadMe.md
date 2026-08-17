# MockForge

Open-source mock API infrastructure for building and testing applications before the real backend is ready.

MockForge lets you define projects, resources, fields, and data generators through a web dashboard and exposes generated mock REST endpoints that return realistic JSON data.

---

## Why MockForge?

Frontend development should not have to wait for backend development.

Without a mock API, a typical workflow looks like:

```text
Frontend
   ↓
"I need an API"
   ↓
Backend is not ready
   ↓
Frontend development waits
```

MockForge changes that:

```text
Frontend
   ↓
MockForge
   ↓
Generated JSON
```

You can create a mock API, connect it to your application, and start building UI, forms, loading states, empty states, and other frontend functionality immediately.

---

## Current Status

MockForge is currently in active development.

The current V1 release focuses on:

- User authentication
- Project management
- Resource management
- Field management
- Configurable data generators
- Dynamic mock API generation
- GET mock endpoints
- Image URL generation
- File URL generation
- Dashboard statistics
- API configuration through the web interface
- Self-hosted development
- Hosted usage

The project currently focuses on simple, developer-friendly mock REST APIs rather than trying to become a complete backend replacement.

---

## Core Workflow

The main MockForge workflow is:

```text
Create Account
      ↓
Create Project
      ↓
Create Resource
      ↓
Create Fields
      ↓
Choose Generators
      ↓
Publish Resource
      ↓
Get Mock API
      ↓
Send HTTP Request
      ↓
Receive Generated JSON
```

For example:

```text
Ecommerce
└── Product
    ├── name
    ├── price
    ├── stock
    └── image
```

MockForge can generate a response from this configuration without requiring you to manually create product records.

---

## Features

### Authentication

MockForge provides user authentication for the dashboard.

Current authentication functionality includes:

- Registration
- Login
- JWT authentication
- Refresh tokens
- HttpOnly refresh-token cookies
- Logout
- Logout from all sessions
- Current-user information
- Profile updates
- Password changes
- Email verification
- Account deactivation

### Projects

Projects are the top-level container for your mock APIs.

A project can contain multiple resources.

Example:

```text
Ecommerce
├── Product
├── User
├── Order
└── Category
```

Projects support:

- Creation
- Listing
- Updating
- Publishing
- Unpublishing
- Slug-based identification
- Soft deletion

### Resources

Resources represent the data exposed by your mock API.

Examples:

```text
Product
User
Company
Order
Student
Article
```

Each resource belongs to a project and contains its field definitions.

### Fields

Fields define the structure of a resource.

Example:

```text
Product
├── name
├── price
├── stock
├── available
└── image
```

MockForge currently supports field types such as:

- String
- Integer
- Decimal
- Boolean
- UUID
- Date
- DateTime

Fields can be connected to supported data generators.

### Data Generators

Generators determine how MockForge creates values.

For example:

```text
name
   ↓
person.full_name
   ↓
"John Smith"
```

Or:

```text
price
   ↓
commerce.price
   ↓
2499.99
```

Generators are registered through the backend generator registry and exposed to the frontend dynamically.

This allows the dashboard to understand which generators are available and which field types they support.

---

## Available Generators

### Address

```text
address.city
address.country
address.street
address.zipcode
```

Supported type:

```text
string
```

### Choice

```text
choice.picker
```

Supported type:

```text
string
```

Options:

```text
choices
```

This allows you to provide your own possible values.

### Commerce

```text
commerce.category
commerce.currency
commerce.price
commerce.product_name
```

Supported types:

```text
string
decimal
```

`commerce.price` supports:

```text
decimal_places
minimum
maximum
```

### Company

```text
company.name
```

Supported type:

```text
string
```

### Date and Time

```text
datetime.date
datetime.datetime
```

Supported types:

```text
date
datetime
```

Both support:

```text
start
end
```

### Internet

```text
internet.domain
internet.email
internet.phone
internet.url
```

Supported type:

```text
string
```

`internet.email` supports:

```text
domain
```

### Person

```text
person.first_name
person.full_name
person.job_title
person.last_name
person.username
```

Supported type:

```text
string
```

### Random

```text
random.boolean
random.decimal
random.integer
```

Supported types:

```text
boolean
decimal
integer
```

`random.boolean` supports:

```text
true_probability
```

`random.decimal` supports:

```text
decimal_places
minimum
maximum
```

`random.integer` supports:

```text
minimum
maximum
```

### Text

```text
text.paragraph
text.sentence
```

Supported type:

```text
string
```

`text.paragraph` supports:

```text
sentences
```

`text.sentence` supports:

```text
words
```

### UUID

```text
uuid.v4
```

Supported type:

```text
uuid
```

---

## Dynamic Mock API

After configuring a resource, MockForge can expose it as a mock API endpoint.

A typical endpoint follows the project and resource structure.

Example:

```text
/api/ecommerce/products
```

A GET request can return generated JSON such as:

```json
[
  {
    "id": "8a2f4b22-8c0e-4a4d-bf9c-4a9e6a9e1f22",
    "name": "Wireless Keyboard",
    "price": 2499.99,
    "stock": 42,
    "image": "https://example.com/image.jpg"
  }
]
```

The generated values are dynamic and can change between requests.

---

## Generated Data Is Not Stored as Records

MockForge stores the API configuration rather than creating thousands of fake database rows.

The database stores information such as:

```text
Project
Resource
Field
Generator
Generator configuration
```

When a mock endpoint is requested:

```text
HTTP Request
     ↓
Resource configuration
     ↓
Field definitions
     ↓
Generator registry
     ↓
Generated values
     ↓
JSON Response
```

This keeps mock-data generation lightweight and configuration-driven.

---

## Dashboard

The MockForge dashboard provides a central place to manage your mock APIs.

The dashboard includes project information and real-time application data based on the user's current projects and resources.

It is designed to give developers a quick overview without requiring them to manually inspect database records or API configuration.

---

## Technology Stack

### Backend

MockForge uses:

- Python
- Django
- Django REST Framework
- PostgreSQL
- JWT authentication

The backend follows a modular Django architecture with separated applications for major domain areas.

### Frontend

The web application uses:

- React
- Vite
- JavaScript / JSX
- Tailwind CSS
- React Router
- shadcn/ui
- Lucide React

The frontend is organized around feature-based modules.

### Database

MockForge uses:

- PostgreSQL

The database stores application and API configuration data such as:

- Users
- Projects
- Resources
- Fields
- Generator configuration
- Audit-related information

---

## Project Structure

The repository is organized into separate backend and frontend applications.

```text
MockForge
├── server
│   ├── config
│   ├── users
│   ├── projects
│   ├── resources
│   ├── generators
│   ├── dashboard
│   └── shared
│
└── web
    └── src
        ├── components
        ├── features
        ├── service
        └── ...
```

The backend contains the API and business logic.

The frontend contains the dashboard, documentation, forms, resource management interface, and API-related UI.

---

## API Architecture

MockForge separates API concerns into dedicated backend modules.

The backend contains areas for:

```text
Authentication
Projects
Resources
Fields
Generators
Dashboard
Shared infrastructure
```

Business logic is kept separate from views where appropriate, allowing the API layer to remain easier to maintain and test.

---

## Generator Architecture

Generators are registered centrally through the generator registry.

Conceptually:

```text
Generator Registry
       ↓
Generator Definition
       ↓
Supported Field Types
       ↓
Generator Options
       ↓
Runtime Value Generation
```

Each generator can define:

- A unique generator key
- Supported field types
- Configurable options
- Runtime generation behavior

This makes the generator system extensible without hard-coding every generator directly into the frontend.

---

## Testing

MockForge includes automated backend tests covering the application's core functionality.

The backend test suite currently contains more than 180 tests and is executed as part of the project's continuous integration workflow.

Example CI result:

```text
Ran 182 tests in 97.788s

OK
```

The test database is created and destroyed during the test run, keeping test execution isolated from normal development data.

The project also uses code-quality tooling such as Ruff for Python linting and formatting checks.

---

## Continuous Integration

The project uses CI to validate backend changes before they are considered ready.

The CI workflow checks the backend test suite and code quality.

The goal is:

```text
Code Change
    ↓
Lint / Quality Checks
    ↓
Automated Tests
    ↓
Pass
    ↓
Ready for Integration
```

---

## Self-Hosted Development

MockForge can currently be run locally without Docker.

The self-hosted development environment requires:

```text
Python
Node.js
npm
PostgreSQL
Git
```

The local architecture is:

```text
Browser
   ↓
React + Vite
   ↓
Django API
   ↓
PostgreSQL
```

Docker support is not currently part of the project.

It may be added later as the deployment and self-hosting workflow evolves.

---

## Hosted Usage

If you use a hosted MockForge deployment, you do not need to install the development stack locally.

You can use the web application to:

```text
Create account
     ↓
Create project
     ↓
Create resource
     ↓
Configure fields
     ↓
Publish resource
     ↓
Use generated API
```

Self-hosting is intended for developers who want to run and modify their own MockForge instance.

---

## Using MockForge With Frontend Applications

MockForge is HTTP-based, so you do not need a special SDK to consume a generated API.

You can use:

- Fetch
- Axios
- React
- Vue
- Angular
- React Native
- Flutter
- Mobile HTTP clients
- Postman
- Insomnia
- Any standard HTTP client

Example:

```javascript
const response = await fetch("https://your-mockforge-url/api/ecommerce/products");

const products = await response.json();
```

---

## Current V1 Scope

MockForge V1 intentionally keeps the feature set focused.

### Included

- Authentication
- Projects
- Resources
- Fields
- Data generators
- Dynamic mock data
- GET mock APIs
- Dashboard
- Image URL fields
- File URL fields
- Self-hosted development

### Not Yet Included

The following features are planned for future versions:

- PUT
- PATCH
- DELETE
- Advanced CRUD behavior
- Pagination
- Filtering
- Sorting
- Resource relationships
- WebSocket mocking
- Authentication inside generated mock APIs
- API templates
- AI-generated responses
- CLI tooling
- Package-based integrations
- Docker support

These features are part of the longer-term roadmap and are not requirements for the current V1 architecture.

---

## Roadmap

MockForge is being actively developed.

Planned areas include:

### Real-time WebSocket Support

Create mock WebSocket endpoints for:

- Live updates
- Chat applications
- Streaming data
- Real-time dashboards

### Authentication and Authorization

Support for:

- JWT authentication
- API keys
- Role-based access control
- Protected mock endpoints

### Full REST Method Support

Expand beyond GET endpoints with:

```text
POST
PUT
PATCH
DELETE
```

This will allow MockForge to simulate more complete CRUD workflows.

### API Templates

Pre-built API configurations for common applications such as:

```text
E-commerce
Blog
User Management
Dashboard
```

### Pagination

Support for:

- Offset pagination
- Cursor-based pagination
- Configurable page sizes
- Pagination metadata

### AI-Generated Responses

Future versions may allow developers to describe the data they need and generate more complex mock response structures automatically.

---

## Documentation

The project documentation covers:

```text
Getting Started
    ├── Introduction
    ├── Installation
    └── Quick Start

Build Your Mock API
    ├── Projects & Resources
    ├── Fields
    └── Data Generators

Use Your API
    └── Connecting MockForge APIs

API Reference
    ├── API Reference
    └── Generators

Roadmap
    └── What's Coming
```

---

## Open Source

MockForge is an open-source project.

The goal is to build a practical mock API platform that developers can use while working on frontend applications, prototypes, mobile applications, and development environments.

Contributions, issues, feature discussions, and feedback are welcome.

---

## Development Philosophy

MockForge is intentionally being built incrementally.

The project does not try to solve every API-development problem at once.

The current focus is:

```text
Simple
     ↓
Useful
     ↓
Reliable
     ↓
Extensible
```

The goal is to build a solid foundation first and add more advanced API behavior as the project matures.

---

## License

[License](./LICENSE)


---

## Repository

GitHub:

https://github.com/aflah-pp/MockForge

---

## Status

MockForge is actively developed and its APIs and features may evolve between releases.

Current development is focused on strengthening the V1 platform, testing, documentation, API behavior, and the foundation required for future features.

---

## Built for Developers

MockForge exists for a simple reason:

```text
Don't wait for the backend.

Build the frontend.
Mock the API.
Ship faster.
```
