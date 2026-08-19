# Mokvio

**Open‑source mock API infrastructure for building and testing applications before the real backend is ready.**

Mokvio lets you define projects, resources, fields, and data generators through a web dashboard and exposes generated mock REST endpoints that return realistic JSON data.

It’s a real working application, not a demo or static mockup. V1 focuses on getting the core mock API workflow reliable before adding more advanced behavior.

---

## Quick Links

- **Hosted App:** <https://mokvio.netlify.app/>
- **Repository:** <https://github.com/aflah-pp/Mokvio>
- **Documentation:** <https://mokvio.netlify.app/docs>
- **License:** [LICENSE](LICENSE)

---

## Why Mokvio?

Frontend development shouldn’t wait for backend development.

Typical workflow without a mock API:

- Frontend needs an API
- Backend isn’t ready
- Frontend work stalls

With Mokvio:

- Frontend → Mokvio → Generated JSON

You can create a mock API, connect it to your application, and start building UI, forms, loading states, empty states, error states, and other frontend functionality before the real backend exists.

The idea is simple: define the shape of the data once and let Mokvio generate the response.

---

## Live Demo

A hosted version of Mokvio is available so you can try the current V1 without setting up Python, Node.js, PostgreSQL, etc.

- **Web application:** <https://mokvio.netlify.app/>

The hosted app uses the current production deployment of the Mokvio frontend and backend. It’s part of an actively developed project, so behavior and features can change between releases.

---

## What Mokvio Actually Does

Mokvio doesn’t create a traditional database full of fake records for every mock request.

Instead, you define an API schema:

- Project
- Resource
- Fields
- Generators

Example:

```text
Ecommerce
└── Product
    ├── name
    ├── price
    ├── stock
    └── image
```

When a mock endpoint is hit, Mokvio uses that configuration to generate the response dynamically:

```text
HTTP Request
  → Resource configuration
  → Field definitions
  → Generator registry
  → Generated values
  → JSON Response
```

This keeps the configuration small and manageable instead of requiring thousands of fake database rows.

---

## Core Workflow

1. Create Account
2. Create Project
3. Create Resource
4. Create Fields
5. Choose Generators
6. Publish Resource
7. Get Mock API
8. Send HTTP Request
9. Receive Generated JSON

Example resource:

```text
Ecommerce
└── Product
    ├── name
    ├── price
    ├── stock
    └── image
```

Once published, the generated endpoint can be consumed by any application that can make HTTP requests.

---

## Features

### Authentication

Mokvio provides authentication for the dashboard and management API (separate from auth in apps consuming mock endpoints).

- Registration & login
- JWT authentication
- Refresh tokens with HttpOnly cookies
- Logout & logout from all sessions
- Current user info
- Profile updates & password changes
- Email verification
- Account deactivation

### Projects

Projects are the top‑level container for mock APIs. A project can contain multiple resources.

Example:

```text
Ecommerce
├── Product
├── User
├── Order
└── Category
```

Projects support:

- Creation, listing, updating
- Publishing & unpublishing
- Slug‑based identification
- Soft deletion

### Resources

Resources represent the data exposed by a mock API.

Examples: `Product`, `User`, `Company`, `Order`, `Student`, `Article`.

Each resource belongs to a project and contains its field definitions. A resource must be configured and published before it’s available through the generated mock API.

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

Supported field types include:

- String
- Integer
- Decimal
- Boolean
- UUID
- Date
- DateTime

Fields can be connected to supported data generators.

### Data Generators

Generators determine how Mokvio creates values.

Examples:

- `name` → `person.full_name` → `"John Smith"`
- `price` → `commerce.price` → `2499.99`

Generators are registered through the backend generator registry and exposed to the frontend dynamically. This keeps the generator system independent from the frontend and makes it easy to add new generators without hard‑coding them into the dashboard.

#### Available Generators

**Address** (`string`)

- `address.city`
- `address.country`
- `address.street`
- `address.zipcode`

**Choice** (`string`)

- `choice.picker`  
  Options: `choices` (your own possible values)

**Commerce**

- `commerce.category` (`string`)
- `commerce.currency` (`string`)
- `commerce.price` (`decimal`)  
  Options: `decimal_places`, `minimum`, `maximum`
- `commerce.product_name` (`string`)

**Company** (`string`)

- `company.name`

**Date and Time**

- `datetime.date` (`date`)
- `datetime.datetime` (`datetime`)  
  Options: `start`, `end`

**Internet** (`string`)

- `internet.domain`
- `internet.email` (option: `domain`)
- `internet.phone`
- `internet.url`

**Person** (`string`)

- `person.first_name`
- `person.full_name`
- `person.job_title`
- `person.last_name`
- `person.username`

**Random**

- `random.boolean` (`boolean`)  
  Option: `true_probability`
- `random.decimal` (`decimal`)  
  Options: `decimal_places`, `minimum`, `maximum`
- `random.integer` (`integer`)  
  Options: `minimum`, `maximum`

**Text** (`string`)

- `text.paragraph` (option: `sentences`)
- `text.sentence` (option: `words`)

**UUID**

- `uuid.v4` (`uuid`)

---

## Dynamic Mock API

After configuring and publishing a resource, Mokvio exposes it through a generated mock API endpoint.

A typical endpoint follows the project and resource structure:

```http
GET /api/v1/ecommerce/products
```

Example response:

```json
[
  {
    "id": "8a2f4b22-8c0e-4a4d-bf9c-4a9e6a9e1f22",
    "name": "Wireless Keyboard",
    "price": 2499.99,
    "stock": 42,
    "image_url": "https://example.com/image"
  }
]
```

Generated values are not permanent database records. They are created from the resource configuration when the mock endpoint is requested.

---

## Dashboard

The Mokvio dashboard is where you manage projects and mock APIs.

It includes:

- Project, resource, and field statistics
- API request information
- Recently updated projects
- Project resource distribution
- Project, resource, and field management
- Account settings

The dashboard is designed to make configuration easier than manually editing API schemas or database records.

---

## Technology Stack

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL/NeonDb
- JWT authentication

The backend follows a modular Django architecture with separate apps for major domain areas.

### Frontend

- React
- Vite
- JavaScript / JSX
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- shadcn/ui
- Lucide React

The frontend is organized around feature‑based modules.

### Database

- PostgreSQL/NeonDb

The database stores application and API configuration data:

- Users
- Projects
- Resources
- Fields
- Generator configuration

---

## Project Structure

```text
Mokvio
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
        ├── contexts
        ├── features
        ├── routes
        ├── service
        └── ...
```

- `server`: API and business logic
- `web`: Dashboard, documentation, forms, resource management UI, authentication flow, API‑related UI

---

## API Architecture

API concerns are separated into dedicated backend modules:

- Authentication
- Projects
- Resources
- Fields
- Generators
- Dashboard
- Shared infrastructure

Business logic is kept separate from views where appropriate to make the API layer easier to test and maintain as functionality grows.

---

## Generator Architecture

Generators are registered centrally through a generator registry:

```text
Generator Registry
  → Generator Definition
  → Supported Field Types
  → Generator Options
  → Runtime Value Generation
```

Each generator defines:

- A unique generator key
- Supported field types
- Configurable options
- Runtime generation behavior

The frontend discovers generator information from the backend, so the backend remains the source of truth for what the API can actually generate.

---

## API Request Behavior

The current mock API is intentionally limited compared to a real backend. At the moment, the main generated API behavior is GET‑based.

Example:

```http
GET /api/v1/ecommerce/products
```

The response is generated from the configured fields and generators.

Mokvio is currently best suited for:

- Frontend development
- UI prototyping
- API integration testing
- Demonstrations
- Early application development
- Mobile application prototyping

It is not intended to replace a production backend.

---

## Self‑Hosted Development

Mokvio can be run locally without Docker.

### Requirements

- Python
- Node.js
- npm
- PostgreSQL
- Git

### Local Architecture

```text
Browser
  → React + Vite
  → Django API
  → PostgreSQL
```

Docker support is not currently part of the project. This is a current limitation, not a design claim. Docker support may be added later as deployment and self‑hosting workflows evolve.

---

## Hosted Usage

The hosted version allows you to use Mokvio without setting up the local development environment.

- **Hosted application:** <https://mokvio.netlify.app/>

Workflow:

1. Create account
2. Create project
3. Create resource
4. Configure fields
5. Publish resource and project
6. Use generated API

### Hosted Version Limitations

The hosted deployment is primarily for trying and using the current project. Because Mokvio is still actively developed:

- Availability depends on current hosting infrastructure
- Response times may vary
- The service may be updated while development continues
- Features in the repository may not always match the hosted deployment
- Breaking changes may occur between early releases

The hosted service should not be treated as a guaranteed production API platform. There are currently no enterprise‑level availability guarantees or SLAs.

If you need complete control over the environment, self‑hosting is the better option.

---

## Using Mokvio With Frontend Applications

Mokvio is HTTP‑based, so you don’t need a special SDK.

You can use:

- Fetch
- Axios
- React, Vue, Angular
- React Native, Flutter
- Mobile HTTP clients
- Postman, Insomnia
- Any standard HTTP client

Example:

```js
const response = await fetch("https://your-mokvio-url/api/ecommerce/products");
const products = await response.json();
```

The generated API is intended to be consumed like any other HTTP endpoint.

---

## What Mokvio Is Not

Mokvio is not intended to be:

- A replacement for Django
- A replacement for a production backend
- A production database
- A full BaaS platform
- A complete CRUD backend
- A production authentication provider
- A real‑time backend
- A permanent data‑storage system

Its purpose is narrower:

- Define API structure
- Generate realistic mock data
- Use it while building the application

That narrow scope is intentional.

---

## Current V1 Scope

### Included

- Authentication
- Projects
- Resources
- Fields
- Data generators
- Dynamic mock data
- GET mock APIs
- Dashboard
- Self‑hosted development
- Hosted usage

### Not Yet Included

Planned for future versions:

- POST, PUT, PATCH, DELETE
- Advanced CRUD behavior
- Pagination
- Filtering
- Sorting
- Resource relationships
- WebSocket mocking
- API templates
- AI‑generated responses
- Docker support


---

## Roadmap

Mokvio is being developed continuously.

### Full REST Method Support

Expand beyond GET endpoints with:

- POST
- PUT
- PATCH
- DELETE

This will allow Mokvio to simulate more complete CRUD workflows.

### Pagination

Support for:

- Offset pagination
- Configurable page sizes

### Filtering and Sorting

Allow applications to test common API query behavior such as:

- `?search=`
- `?sort=`
- `?ordering=`
- `?filter=`

### Resource Relationships

Support relationships between resources such as:

- User → Orders → Products

### Authentication and Authorization

Future mock APIs may support:

- API keys
- JWT authentication
- Protected mock endpoints
- Role‑based access control

### Real‑time WebSocket Support

Create mock WebSocket endpoints for:

- Live updates
- Chat applications
- Streaming data
- Real‑time dashboards

### API Templates

Pre‑built API configurations for common applications such as:

- E‑commerce
- Blog
- User management
- Dashboard

### AI‑Generated Responses

A possible future feature: describe the data you need and automatically generate more complex mock response structures.

### Docker Support

Docker support may be added to make self‑hosting and deployment easier.

---

## Documentation

The project documentation covers:

- **Getting Started**
  - Introduction
  - Installation
  - Quick Start
- **Build Your Mock API**
  - Projects & Resources
  - Fields
  - Data Generators
- **Use Your API**
  - Connecting Mokvio APIs
- **API Reference**
  - API Reference
  - Generators
- **Roadmap**
  - What’s Coming

Documentation is developed alongside the application and may change as the API evolves.

---

## Open Source

Mokvio is an open‑source project.

Goal: build a practical mock API platform that developers can use while working on:

- Frontend applications
- Prototypes
- Mobile applications
- Development environments
- API integration work
- Demonstrations

Contributions, issues, feature discussions, bug reports, and feedback are welcome.

---

## Contributing

If you want to contribute:

- Start by looking at the existing architecture and documentation before making large changes.
- For larger features, open an issue or discussion first so the implementation direction can be agreed on before significant work is done.

Bug reports are especially useful when they include:

- What you were trying to do
- What you expected to happen
- What actually happened
- Steps to reproduce the issue
- Relevant browser or server information

Please do not include passwords, API keys, JWTs, cookies, or other secrets in issues or bug reports.

---

## Feedback

Feedback is welcome.

If you find a bug, have a feature request, find something confusing, or simply have an idea for improving Mokvio, please open an issue in the repository.

The hosted application may also provide feedback functionality as the project evolves.

---

## Releases

Mokvio uses versioned releases as the project develops.

- The V1 release represents the first focused version of the platform.
- It does not mean that the API surface or architecture is considered final.
- Future releases may introduce new API methods, configuration options, generator types, and deployment capabilities.

Check the repository releases for the latest version and changes:  
<https://github.com/aflah-pp/Mokvio/releases>

---

## Status

Mokvio is actively developed.

- The V1 platform is usable.
- The project is not positioned as a finished enterprise product.
- APIs, UI behavior, documentation, and features may evolve between releases.

Current development focus:

- Strengthening the V1 platform
- Improving testing
- Improving documentation
- Expanding mock API behavior
- Improving developer experience
- Building a stronger foundation for future versions

---

## Built for Developers

Mokvio exists for a simple reason:

- Don’t wait for the backend.
- Build the frontend.
- Mock the API.
- Ship faster.
