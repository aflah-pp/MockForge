```
src/
├── app/
│   ├── App.jsx
│   ├── router.jsx
│   └── providers/
│       ├── AuthProvider.jsx
│       └── ThemeProvider.jsx
│
├── components/
│   └── ui/
│       ├── button.jsx
│       ├── dialog.jsx
│       ├── dropdown-menu.jsx
│       ├── input.jsx
│       ├── table.jsx
│       └── ...
│
├── features/
│   │
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── auth-api.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   └── schemas/
│   │       └── auth-schema.js
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── DashboardSidebar.jsx
│   │   │   ├── DashboardHeader.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Overview.jsx
│   │   └── components/
│   │       └── StatCard.jsx
│   │
│   ├── projects/
│   │   ├── components/
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectList.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── CreateProjectDialog.jsx
│   │   │   ├── EditProjectDialog.jsx
│   │   │   └── DeleteProjectDialog.jsx
│   │   ├── pages/
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   └── ProjectSettings.jsx
│   │   ├── services/
│   │   │   └── project-api.js
│   │   ├── hooks/
│   │   │   └── useProjects.js
│   │   └── schemas/
│   │       └── project-schema.js
│   │
│   ├── resources/
│   │   ├── components/
│   │   │   ├── ResourceList.jsx
│   │   │   ├── ResourceCard.jsx
│   │   │   ├── ResourceForm.jsx
│   │   │   ├── CreateResourceDialog.jsx
│   │   │   ├── EditResourceDialog.jsx
│   │   │   └── DeleteResourceDialog.jsx
│   │   ├── pages/
│   │   │   ├── Resources.jsx
│   │   │   └── ResourceDetails.jsx
│   │   ├── services/
│   │   │   └── resource-api.js
│   │   ├── hooks/
│   │   │   └── useResources.js
│   │   └── schemas/
│   │       └── resource-schema.js
│   │
│   ├── fields/
│   │   ├── components/
│   │   │   ├── FieldList.jsx
│   │   │   ├── FieldForm.jsx
│   │   │   ├── FieldRow.jsx
│   │   │   ├── CreateFieldDialog.jsx
│   │   │   ├── EditFieldDialog.jsx
│   │   │   └── DeleteFieldDialog.jsx
│   │   ├── pages/
│   │   │   └── Fields.jsx
│   │   ├── services/
│   │   │   └── field-api.js
│   │   ├── hooks/
│   │   │   └── useFields.js
│   │   └── schemas/
│   │       └── field-schema.js
│   │
│   ├── generators/
│   │   ├── components/
│   │   │   ├── GeneratorSelector.jsx
│   │   │   ├── GeneratorConfig.jsx
│   │   │   └── GeneratorPreview.jsx
│   │   ├── data/
│   │   │   └── generators.js
│   │   └── schemas/
│   │       └── generator-schema.js
│   │
│   ├── api/
│   │   ├── components/
│   │   │   ├── EndpointPreview.jsx
│   │   │   ├── ApiUrl.jsx
│   │   │   └── ApiResponsePreview.jsx
│   │   ├── pages/
│   │   │   └── ApiExplorer.jsx
│   │   └── services/
│   │       └── api.js
│   │
│   ├── api-keys/
│   │   ├── components/
│   │   │   ├── ApiKeyList.jsx
│   │   │   ├── CreateApiKeyDialog.jsx
│   │   │   └── RevokeApiKeyDialog.jsx
│   │   ├── pages/
│   │   │   └── ApiKeys.jsx
│   │   └── services/
│   │       └── api-key-api.js
│   │
│   ├── settings/
│   │   ├── components/
│   │   │   ├── ProfileSettings.jsx
│   │   │   ├── SecuritySettings.jsx
│   │   │   └── AccountSettings.jsx
│   │   └── pages/
│   │       └── Settings.jsx
│   │
│   └── docs/
│       ├── components/
│       │   ├── layout/
│       │   │   └── doc-layout.jsx
│       │   ├── markdown/
│       │   │   └── md-rendorer.jsx
│       │   ├── navigation/
│       │   │   └── doc-pagination.jsx
│       │   ├── app-sidebar.jsx
│       │   └── search-form.jsx
│       ├── data/
│       │   ├── index.js
│       │   └── v1.0.0.js
│       └── pages/
│           ├── getting-started/
│           │   ├── installation.jsx
│           │   ├── introduction.jsx
│           │   ├── project-structure.jsx
│           │   └── quick-start.jsx
│           ├── GettingStarted.jsx
│           └── RoadMap.jsx
│
├── lib/
│   ├── axios.js
│   ├── utils.js
│   └── constants.js
│
├── hooks/
│   └── use-debounce.js
│
└── assets/
    └── ...
```
