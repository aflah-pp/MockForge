import DocLayout from "@/features/docs/components/layout/doc-layout";
import MarkdownRenderer from "@/features/docs/components/markdown/md-rendorer";
import DocsPagination from "@/features/docs/components/navigation/doc-pagination";

const content = `
# Installation

There are currently two ways to use Mokvio:

1. **Hosted Mokvio**
2. **Self-hosted Mokvio**

Choose the option that works for you.

## Hosted Mokvio

If you are using the hosted version of Mokvio, you don't need to install anything.

You don't need:

- Python
- Node.js
- PostgreSQL
- Django
- React

Just create an account and open the dashboard.

From there you can:

\`\`\`text
Create Project
      ↓
Create Resource
      ↓
Add Fields
      ↓
Choose Generators
      ↓
Publish
      ↓
Use Your Mock API
\`\`\`

This is the easiest way to use Mokvio.

## Self-host Mokvio

If you want to run Mokvio on your own machine, you can clone the project and run the frontend and backend yourself.

### Requirements

You need:

- Git
- Python 3.12+
- Node.js 20+
- npm
- PostgreSQL

You don't need to know Django or React to use Mokvio.

Those are the technologies used to build the platform.

## 1. Clone Mokvio

Clone the repository:

\`\`\`bash
git clone <repository-url>
cd Mokvio
\`\`\`

The project has two main parts:

\`\`\`text
Mokvio
├── server
└── web
\`\`\`

The \`server\` directory contains the backend.

The \`web\` directory contains the frontend.

## 2. Set up the backend

Open a terminal and go to the server:

\`\`\`bash
cd server
\`\`\`

Create a Python virtual environment:

\`\`\`bash
python -m venv .venv
\`\`\`

Activate it.

### macOS / Linux

\`\`\`bash
source .venv/bin/activate
\`\`\`

### Windows

\`\`\`powershell
.venv\\\\Scripts\\\\activate
\`\`\`

## 3. Install backend packages

Install the required packages:

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## 4. Configure the backend

Mokvio uses environment variables for its configuration.

Set up your local environment according to the project's environment configuration.

Your backend will need values such as:

\`\`\`text
SECRET_KEY
DATABASE_URL
CORS_ALLOWED_ORIGINS
\`\`\`

For PostgreSQL, your database URL will look similar to:

\`\`\`text
DATABASE_URL=postgresql://username:password@localhost:5432/mockvio
\`\`\`

Use your own PostgreSQL username, password, host, port, and database name.

Do not commit your environment file or secrets to Git.

## 5. Create the PostgreSQL database

Create a PostgreSQL database for Mokvio.

For example:

\`\`\`text
mockvio
\`\`\`

Then point \`DATABASE_URL\` to that database.

Mokvio stores things such as:

- Users
- Projects
- Resources
- Fields
- Generator configuration

Mock data itself is generated when the API is requested.

## 6. Run the database migrations

From the \`server\` directory:

\`\`\`bash
python manage.py migrate
\`\`\`

This creates the required database tables.

## 7. Start the backend

Run:

\`\`\`bash
python manage.py runserver
\`\`\`

The backend will normally be available at:

\`\`\`text
http://127.0.0.1:8000
\`\`\`

Keep this terminal running.

## 8. Start the frontend

Open another terminal.

From the Mokvio project directory:

\`\`\`bash
cd web
\`\`\`

Install the frontend packages:

\`\`\`bash
npm install
\`\`\`

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Vite will show the frontend address in your terminal.

It will normally look similar to:

\`\`\`text
http://localhost:5173
\`\`\`

Open that address in your browser.

## 9. Check that everything works

Once the frontend and backend are running:

1. Open Mokvio.
2. Create an account.
3. Sign in.
4. Create a project.
5. Create a resource.
6. Add some fields.
7. Choose generators.
8. Publish the resource.
9. Open the generated API URL.

If the endpoint returns JSON data, your Mokvio installation is working.

## Hosted vs Self-hosted

### Hosted

Use the hosted version if you want the easiest setup.

You only need:

\`\`\`text
Browser
   ↓
Mokvio
\`\`\`

You don't have to manage the server or database yourself.

### Self-hosted

Use self-hosting if you want to run Mokvio on your own machine or infrastructure.

The setup is:

\`\`\`text
Browser
   ↓
Mokvio Frontend
   ↓
Mokvio Backend
   ↓
PostgreSQL
\`\`\`

You are responsible for running and maintaining these services.

## Docker

Docker support is **not available yet** in the current version of Mokvio.

The current self-hosted setup runs directly using:

- Python
- Node.js
- PostgreSQL

Docker support can be added in a future release.

## Do I need to install anything in my React project?

No.

You don't need a Mokvio npm package.

Once you have a mock API URL, you can use it like any other API.

For example:

- Fetch
- Axios
- React Query
- Any HTTP client

## Next step

If Mokvio is running, continue with **Quick Start**.

You will create your first mock API in a few minutes.
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
