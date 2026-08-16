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
import Installation from "@/features/docs/pages/getting-started/installation";
import Introduction from "@/features/docs/pages/getting-started/introduction";
import ProjectStructure from "@/features/docs/pages/getting-started/project-structure";
import QuickStart from "@/features/docs/pages/getting-started/quick-start";
import GettingStarted from "@/features/docs/pages/GettingStarted";
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
import ProtectedRoute from "@/routes/ProtectedRoute";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnNavigate />
      <Routes>
        {/* Documentation Routes */}
        <Route path="/docs" element={<Navigate to="/docs/getting-started" replace />} />
        <Route path="/docs/getting-started" element={<GettingStarted />} />
        <Route path="/docs/getting-started/introduction" element={<Introduction />} />
        <Route path="/docs/getting-started/installation" element={<Installation />} />
        <Route path="/docs/getting-started/quick-start" element={<QuickStart />} />
        <Route path="/docs/getting-started/project-structure" element={<ProjectStructure />} />
        <Route path="/docs/roadmap" element={<Roadmap />} />
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
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
        </Route>

        {/* Policy and other pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/about/creator" element={<CreatorPage />} />
        <Route path="/policy" element={<PrivacyPolicyPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
      <ContinueReading />
      <ScrollToTop />
    </BrowserRouter>
  );
}

export default App;
