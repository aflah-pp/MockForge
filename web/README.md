# MockForge Web

The frontend application for MockForge.

MockForge Web is a React-based dashboard and documentation interface used to create projects, resources, fields, configure data generators, and interact with generated mock APIs.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- shadcn/ui
- React Router
- Axios
- React Hook Form
- Zod
- Lucide React

## Requirements

Before running the frontend, make sure you have:

- Node.js 20+
- npm 10+
- MockForge backend running locally

Check your versions:

```bash
node --version
npm --version
```

## Project Structure

```text
web/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── docs/
│   │   ├── projects/
│   │   └── resources/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── service/
│   │   ├── endpoints/
│   │   ├── axios/
│   │   └── store/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

The frontend is organized primarily around features rather than placing all application logic into one large component structure.

## Installation

From the MockForge root directory:

```bash
cd web
```

Install dependencies:

```bash
npm install
```

## Environment Configuration

Create the appropriate local environment file used by the frontend configuration.

The frontend needs the URL of the MockForge backend API.

For example:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Do not commit local environment files containing private configuration.

## Development

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

Usually:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

## Backend Connection

The frontend communicates with the Django REST API.

The local development flow is:

```text
Browser
   ↓
React + Vite
   ↓
Axios
   ↓
Django REST API
   ↓
PostgreSQL
```

Make sure the backend is running before testing authenticated features or API requests.

## Main Application Areas

### Authentication

The frontend provides:

- Registration
- Login
- Token refresh
- Logout
- Account management
- Password management

Authentication state is managed through the application's auth store.

### Dashboard

The dashboard provides real application data such as:

- Project counts
- Published projects
- Resource information
- Recent activity

Dashboard information is retrieved from the backend rather than being permanently represented by frontend mock data.

### Projects

Projects are the top-level containers for mock APIs.

The frontend allows users to:

- Create projects
- View projects
- Update projects
- Publish projects
- Unpublish projects
- Delete projects

### Resources

Resources represent API entities such as:

```text
Product
User
Order
Company
```

A project can contain multiple resources.

### Fields

Fields define the structure of a resource.

For example:

```text
Product
├── name
├── price
├── stock
└── image
```

The field interface allows users to configure:

- Field name
- Field type
- Generator
- Generator options

### Data Generators

MockForge provides configurable generators for producing realistic values.

Examples include:

```text
person.full_name
internet.email
commerce.price
random.integer
random.boolean
uuid.v4
```

The frontend retrieves generator information from the backend and presents compatible generators for each field type.

### Mock API

After configuring a resource, users can publish it and use the generated HTTP endpoint.

The frontend provides the generated endpoint so it can be copied and used in applications, Postman, Axios, Fetch, or other HTTP clients.

### Documentation

The project also contains the MockForge documentation interface.

Documentation covers:

- Introduction
- Installation
- Quick Start
- Projects and Resources
- Fields
- Data Generators
- Connecting MockForge APIs
- API Reference
- Roadmap

## Production Build

Create a production build:

```bash
npm run build
```

The generated production files are placed in:

```text
dist/
```

## Preview Production Build

To locally preview the production build:

```bash
npm run preview
```

Vite will provide a local preview URL.

## Linting

Run ESLint:

```bash
npm run lint
```

The project should pass linting before changes are merged.

## Testing

Frontend testing is part of the project's quality process.

Before committing frontend changes, verify:

- Application builds successfully
- ESLint passes
- Authentication flows work
- Dashboard data loads correctly
- Project CRUD works
- Resource CRUD works
- Field creation works
- Generator selection works
- Generated mock API can be opened
- Documentation routes work
- Light and dark themes work
- Responsive layouts work

## Development Workflow

A typical development workflow is:

```text
Start PostgreSQL
      ↓
Start Django backend
      ↓
Start Vite frontend
      ↓
Login
      ↓
Create Project
      ↓
Create Resource
      ↓
Add Fields
      ↓
Configure Generators
      ↓
Publish Resource
      ↓
Test Mock API
```

## Production Deployment

The frontend is a static Vite application after building.

The production deployment process is:

```bash
npm install
npm run build
```

Deploy the generated `dist/` directory using your chosen static hosting provider.

The production frontend must point to the deployed MockForge API through the appropriate environment configuration.

## Important

Do not hardcode:

- API URLs
- Secrets
- JWT values
- Database credentials
- Private tokens

Use environment variables for environment-specific configuration.

## Contributing

Before opening a pull request:

1. Install dependencies.
2. Run the development server.
3. Verify the affected feature.
4. Run ESLint.
5. Run the production build.
6. Test the affected API integration.
7. Check responsive behavior.
8. Review the changed files before committing.

MockForge is actively developed, so frontend behavior and structure may evolve as new platform features are introduced.
