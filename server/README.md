# MockForge Server

The backend application for MockForge.

MockForge Server provides the REST API, authentication, project management, resource management, field configuration, data generators, dashboard data, and dynamically generated mock API responses.

## Tech Stack

- Python
- Django
- Django REST Framework
- PostgreSQL
- JWT authentication
- Ruff
- Django test framework

## Requirements

Before running the backend, make sure you have:

- Python 3.12+
- PostgreSQL
- pip
- Git

Check your Python version:

```bash
python --version
```

## Project Structure

```text
server/
├── config/
├── dashboard/
├── generators/
├── projects/
├── resources/
├── users/
├── shared/
├── manage.py
├── requirements.txt
└── ...
```

The backend is divided into Django applications based on application responsibility.

## Core Applications

### Users

Handles:

- User registration
- Login
- JWT authentication
- Token refresh
- Logout
- Logout from all sessions
- User profile
- Password changes
- Email verification
- Account deactivation

### Projects

Handles project management.

Projects are the top-level containers for mock APIs.

### Resources

Resources represent API entities inside projects.

For example:

```text
Project
└── Product
```

### Generators

The generator system creates realistic values for configured resource fields.

Examples include:

```text
person.full_name
internet.email
commerce.price
random.integer
random.boolean
uuid.v4
```

Generators are registered through the generator registry and exposed through the generator API.

### Dashboard

The dashboard application provides aggregated information used by the frontend dashboard.

It calculates information from the user's active projects and resources rather than relying on hardcoded frontend values.

## Installation

From the MockForge root directory:

```bash
cd server
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it.

### macOS / Linux

```bash
source .venv/bin/activate
```

### Windows

```powershell
.venv\Scripts\activate
```

## Install Dependencies

Install the backend requirements:

```bash
pip install -r requirements.txt
```

## Environment Configuration

MockForge uses environment variables for application configuration.

Configure the required values for:

```text
SECRET_KEY
DATABASE_URL
CORS_ALLOWED_ORIGINS
```

JWT-related configuration should also be configured according to the project's settings.

Example PostgreSQL connection:

```text
DATABASE_URL=postgresql://username:password@localhost:5432/mockforge
```

Do not commit environment files or secrets.

## Database

MockForge uses PostgreSQL as its primary database.

The database stores application configuration and user data such as:

- Users
- Projects
- Resources
- Fields
- Generator configuration
- Audit information

Generated mock response values are produced dynamically.

MockForge does not need to permanently store thousands of generated records just to return mock responses.

## Migrations

Run database migrations:

```bash
python manage.py migrate
```

When developing models, create migrations when required:

```bash
python manage.py makemigrations
```

Then apply them:

```bash
python manage.py migrate
```

## Start the Development Server

Run:

```bash
python manage.py runserver
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

## API

The application API is versioned.

The main API namespace is:

```text
/api/v1/
```

Major API areas include:

```text
/api/v1/users/
/api/v1/projects/
/api/v1/generators/
```

Resource and mock API routes are provided by their respective applications.

## Generator API

Available generators can be retrieved through:

```text
GET /api/v1/generators/
```

The response describes:

- Generator key
- Supported field types
- Available configuration options

For example:

```text
person.full_name
```

supports:

```text
string
```

while:

```text
random.integer
```

supports:

```text
integer
```

This allows the frontend to determine which generators are compatible with a field.

## Mock API Generation

The main MockForge workflow is:

```text
Project
   ↓
Resource
   ↓
Fields
   ↓
Generator Configuration
   ↓
Publish
   ↓
Mock API Request
   ↓
Generated JSON
```

Mock responses are generated from the resource definition and field generator configuration.

## Authentication

MockForge uses JWT authentication.

The refresh token is handled through a secure HttpOnly cookie according to the backend authentication configuration.

The backend provides endpoints for authentication and session management.

Authentication must be tested carefully whenever changes are made to:

- Login
- Registration
- Token refresh
- Logout
- Password changes
- User deactivation

## Testing

The backend contains an automated test suite covering the application's core functionality.

Run the Django test suite:

```bash
python manage.py test
```

The CI pipeline also executes the backend test suite.

Before merging backend changes, verify:

```text
Tests
   ↓
Lint
   ↓
Application checks
   ↓
Review
```

## Linting

MockForge uses Ruff for Python linting and formatting.

Run Ruff:

```bash
ruff check .
```

If formatting is configured for the project, run:

```bash
ruff format .
```

Do not ignore lint errors without understanding why they occur.

## Django Checks

Run Django's application checks:

```bash
python manage.py check
```

This should pass before changes are committed.

## Development Workflow

A typical local workflow is:

```text
PostgreSQL
   ↓
Django
   ↓
REST API
   ↓
React Frontend
```

For a mock API feature:

```text
Create Project
      ↓
Create Resource
      ↓
Create Fields
      ↓
Configure Generators
      ↓
Publish Resource
      ↓
Request Mock Endpoint
      ↓
Generate Response
```

## Production Considerations

The Django development server is intended for local development only.

For production, deploy Django using an appropriate production WSGI/ASGI setup and configure:

- Production `SECRET_KEY`
- PostgreSQL
- Allowed hosts
- CORS
- Secure cookies
- JWT configuration
- HTTPS
- Static/media handling
- Environment-specific settings

Never expose development secrets in production.

## Docker

Docker is not currently part of the MockForge self-hosted setup.

The current setup runs directly using Python, Django, PostgreSQL, Node.js, and React.

Docker support may be added in the future as the deployment architecture evolves.

## Backend Quality Rules

Before committing backend changes:

1. Run Django checks.
2. Run the test suite.
3. Run Ruff.
4. Verify database migrations.
5. Test affected API endpoints.
6. Check authentication behavior when relevant.
7. Review the migration and changed files.
8. Confirm that no secrets or environment files are committed.

## Contributing

MockForge is actively developed.

When contributing backend changes:

- Keep business logic inside appropriate services.
- Keep views focused on HTTP concerns.
- Keep serializers responsible for validation and representation.
- Keep generator behavior inside the generator system.
- Avoid duplicating business rules.
- Add tests for new business behavior.
- Keep API behavior backwards-compatible where possible.

The goal is to keep the backend modular as MockForge grows into a larger API mocking platform.
