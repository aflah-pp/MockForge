import DocLayout from "@/features/docs/components/layout/doc-layout";
import MarkdownRenderer from "@/features/docs/components/markdown/md-rendorer";
import DocsPagination from "@/features/docs/components/navigation/doc-pagination";

const content = `
# Installation

Getting started with MockForge depends on what you want to do.

If you only want to **use MockForge**, you can create an account and start from the dashboard.

If you want to **develop MockForge locally**, follow the setup below.

## Requirements

For local development, you will need:

- Python
- Node.js
- PostgreSQL
- Git

MockForge uses:

- Django and Django REST Framework for the backend
- React and Vite for the frontend
- PostgreSQL for the database

## Clone the repository

Clone the MockForge repository:

\`\`\`bash
git clone <repository-url>
cd MockForge
\`\`\`

The repository contains separate applications for the backend and frontend.

## Backend setup

Move into the backend directory:

\`\`\`bash
cd server
\`\`\`

Create and activate a Python virtual environment:

\`\`\`bash
python -m venv venv
\`\`\`

Activate the virtual environment according to your operating system.

Install the backend dependencies:

\`\`\`bash
pip install -r requirements.txt
\`\`\`

Configure your environment variables before starting Django.

At minimum, the backend requires configuration for:

- Django secret key
- PostgreSQL database
- JWT configuration
- CORS configuration

Run the database migrations:

\`\`\`bash
python manage.py migrate
\`\`\`

Start the Django development server:

\`\`\`bash
python manage.py runserver
\`\`\`

The backend will be available at:

\`\`\`text
http://127.0.0.1:8000
\`\`\`

## Frontend setup

Open another terminal and move into the frontend directory:

\`\`\`bash
cd web
\`\`\`

Install the frontend dependencies:

\`\`\`bash
npm install
\`\`\`

Start the Vite development server:

\`\`\`bash
npm run dev
\`\`\`

The frontend will be available at the URL shown by Vite.

## Database

MockForge uses PostgreSQL for local development.

Create a PostgreSQL database and configure its connection details in the backend environment.

The Django application uses this database to store:

- Users
- Projects
- Resources
- Fields

Generated mock data is not stored as individual records in V1. Mock responses are generated dynamically from the resource and field definitions.

## Environment variables

Do not commit secrets or local environment files to Git.

Your local environment should contain the values required by the backend, such as:

\`\`\`text
SECRET_KEY
DATABASE_URL
CORS_ALLOWED_ORIGINS
\`\`\`

Use your project's environment configuration to provide these values.

## Verify the installation

Once both applications are running:

1. Open the MockForge frontend.
2. Create an account.
3. Log in to the dashboard.
4. Create a project.
5. Create a resource.
6. Add fields.
7. Generate your mock API.
8. Open the generated GET endpoint.

If the API returns JSON data, your local MockForge installation is working correctly.

## Using MockForge

You do not need to install an npm package or CLI to use the V1 platform.

The V1 workflow is dashboard-based:

\`\`\`text
Login
  ↓
Create Project
  ↓
Create Resource
  ↓
Add Fields
  ↓
Choose Generators
  ↓
Get Mock API URL
\`\`\`

CLI tooling and package-based usage are not part of V1.

## Next step

Continue with **Quick Start** to create your first mock API.
`;

function Installation() {
  return (
    <DocLayout>
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <MarkdownRenderer>{content}</MarkdownRenderer>
        <DocsPagination />
      </div>
    </DocLayout>
  );
}

export default Installation;
