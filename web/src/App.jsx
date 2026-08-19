import ContinueReading from "@/components/continueReading";
import ScrollToTop from "@/components/scrollToTop";
import AccountPage from "@/features/accounts/AccountPage";
import AccountSettingsPage from "@/features/accounts/AccountSettings.jsx";
import ChangePasswordPage from "@/features/accounts/ChangePasswordpage";
import DangerSettingsPage from "@/features/accounts/DangerSettingsPage";
import VerifyEmailPage from "@/features/accounts/VerifyEmailPage";
import Login from "@/features/auth/Login";
import Register from "@/features/auth/Register";
import MainDashBoardPage from "@/features/dashboard/MainDashBoardPage";
import ProjectsList from "@/features/dashboard/ProjectsList";
import ConnectMokvio from "@/features/docs/pages/api/connect-mokvio";
import DataGenerators from "@/features/docs/pages/build-doc/data-generators";
import Fields from "@/features/docs/pages/build-doc/fields";
import ProjectsResources from "@/features/docs/pages/build-doc/projects-resources";
import Installation from "@/features/docs/pages/getting-started/installation";
import Introduction from "@/features/docs/pages/getting-started/introduction";
import QuickStart from "@/features/docs/pages/getting-started/quick-start";
import ApiReference from "@/features/docs/pages/references/api-reference";
import GeneratorsReference from "@/features/docs/pages/references/generator-reference";
import Roadmap from "@/features/docs/pages/RoadMap";
import ProjectDetailPage from "@/features/projects/ProjectDetail";
import ProjectFormPage from "@/features/projects/ProjectFormPage";
import FieldFormPage from "@/features/resources/FieldFormPage";
import ResourceDetailPage from "@/features/resources/ResourceDetailPage";
import ResourceFormPage from "@/features/resources/ResourceFormPage";
import ScrollToTopOnNavigate from "@/hooks/scrollToTopOnNav";
import CreatorPage from "@/pages/about/AboutCreatorPage";
import AboutPage from "@/pages/about/AboutPage";
import Home from "@/pages/home/Home";
import NotFound from "@/pages/Page404";
import PrivacyPolicyPage from "@/pages/policy/PrivacyPolicyPage";
import TermsPage from "@/pages/policy/Terms";
import SupportPage from "@/pages/support/SupportPage";
import UpcomingFeatures from "@/pages/UpComing";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicOnlyRoute from "@/routes/PublicOnlyRoute";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnNavigate />
      <Routes>
        {/* Documentation Routes */}
        <Route
          path="/docs"
          element={<Navigate to="/docs/getting-started/introduction" replace />}
        />
        <Route path="/docs/getting-started/introduction" element={<Introduction />} />
        <Route path="/docs/getting-started/installation" element={<Installation />} />
        <Route path="/docs/getting-started/quick-start" element={<QuickStart />} />
        <Route path="/docs/build/projects-resources" element={<ProjectsResources />} />
        <Route path="/docs/build/fields" element={<Fields />} />
        <Route path="/docs/build/data-generators" element={<DataGenerators />} />
        <Route path="/docs/api/connect-mokvio" element={<ConnectMokvio />} />
        <Route path="/docs/reference/api" element={<ApiReference />} />
        <Route path="/docs/reference/generators" element={<GeneratorsReference />} />
        <Route path="/docs/roadmap" element={<Roadmap />} />

        {/* Auth Routes */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        {/* ProtectedRoutes */}
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<MainDashBoardPage />} />
          <Route path="/project" element={<Navigate to="/project/list" replace />} />
          <Route path="/project/create" element={<ProjectFormPage />} />
          <Route path="/project/list" element={<ProjectsList />} />
          <Route path="/project/:slug" element={<ProjectDetailPage />} />
          <Route path="/project/:slug/edit" element={<ProjectFormPage />} />
          <Route path="/settings" element={<Navigate to="/settings/account" replace />} />
          <Route path="/settings/account" element={<AccountSettingsPage />} />
          <Route path="settings/account/password" element={<ChangePasswordPage />} />
          <Route path="settings/account/verify-email" element={<VerifyEmailPage />} />
          <Route path="/settings/danger" element={<DangerSettingsPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/project/:projectSlug/resources/create" element={<ResourceFormPage />} />
          <Route
            path="/project/:projectSlug/resources/:resourceSlug"
            element={<ResourceDetailPage />}
          />
          <Route
            path="/project/:projectSlug/resources/:resourceSlug/fields/create"
            element={<FieldFormPage />}
          />
          <Route
            path="/project/:projectSlug/resources/:resourceSlug/fields/:slug/edit"
            element={<FieldFormPage />}
          />
          {/* About and Support pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/creator" element={<CreatorPage />} />
          <Route path="/support" element={<SupportPage />} />
          {/* Upcoming  */}
          <Route path="/api/active" element={<UpcomingFeatures />} />
          <Route path="/resource/templates" element={<UpcomingFeatures />} />
        </Route>
        <Route path="/forgot-password" element={<UpcomingFeatures />} />

        {/* Policy */}

        <Route path="/policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ContinueReading />
      <ScrollToTop />
    </BrowserRouter>
  );
}

export default App;
