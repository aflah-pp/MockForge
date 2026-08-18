# MockForge Web

Frontend application for the MockForge dashboard and documentation.

This is a React + Vite app that lets you create projects, resources, and fields, configure data generators, and work with generated mock API endpoints. It does not re‑document every feature; see the root [README](../README.md) for the full product overview.

---

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

---

## Requirements

- Node.js 20+
- npm 10+
- MockForge backend running locally

Check versions:

```bash
node --version
npm --version
```

---

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

The app is organized around features instead of one giant component tree.

---

## Installation

From the repository root:

```bash
cd web
npm install
```

---

## Environment Configuration

Create a local environment file (for example `.env` or `.env.local`, depending on your setup) and configure the backend API URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Do not commit environment files with private configuration.

---

## Development

Start the Vite dev server:

```bash
npm run dev
```

Vite will show a local URL, typically:

```text
http://localhost:5173
```

Open that in your browser. The frontend talks to the Django REST API via Axios, so make sure the backend is running before testing authenticated flows or API calls.

---

## Main Application Areas

- **Authentication**  
  Registration, login, token refresh, logout, account & password management. Auth state is managed in the app’s auth store.

- **Dashboard**  
  Shows real data from the backend: project counts, published projects, resource info, recent activity, etc.

- **Projects**  
  Create, view, update, publish, unpublish, and delete projects (top‑level containers for mock APIs).

- **Resources**  
  Define API entities like `Product`, `User`, `Order`, `Company` inside a project.

- **Fields**  
  Configure field name, type, generator, and generator options for each resource.

- **Documentation**  
  The app also hosts the MockForge docs (Introduction, Quick Start, Projects & Resources, Fields, Generators, API usage, API reference, Roadmap).

---

## Production Build

Create a production build:

```bash
npm run build
```

Output goes to:

```text
dist/
```

Preview the production build locally:

```bash
npm run preview
```

Vite will show a local preview URL.

---

## Linting

Run ESLint:

```bash
npm run lint
```

The project should pass linting before merging changes.

---

## Testing & Manual Checks

Frontend testing is currently manual + CI‑assisted. Before committing frontend changes, verify:

- App builds successfully
- ESLint passes
- Authentication flows work (login, logout, refresh)
- Dashboard data loads correctly
- Project CRUD works
- Resource CRUD works
- Field creation and generator selection work
- Generated mock API endpoint can be opened and returns JSON
- Documentation routes work
- Light/dark themes work
- Responsive layouts work on mobile and desktop

---

## Development Workflow

Typical local workflow:

1. Start PostgreSQL  
2. Start Django backend  
3. Start Vite frontend (`npm run dev`)  
4. Log in  
5. Create a project  
6. Create a resource  
7. Add fields and configure generators  
8. Publish the resource  
9. Test the mock API from the UI or an external client  

---

## Production Deployment

After building:

```bash
npm install
npm run build
```

Deploy the `dist/` directory to your static hosting provider. In production, the frontend must point to the deployed MockForge API via environment configuration (e.g. `VITE_API_BASE_URL` set to the production API base).

Important:

- Do not hardcode API URLs, secrets, JWTs, DB credentials, or private tokens in the code.
- Use environment variables for environment‑specific configuration.

---

## Contributing

Before opening a pull request for the frontend:

- Install dependencies and run the dev server.
- Verify the affected feature manually.
- Run ESLint.
- Run the production build.
- Test the related API integration.
- Check responsive behavior on different screen sizes.
- Review the changed files before committing.

MockForge is actively developed, so frontend structure and behavior may evolve as new platform features are added.