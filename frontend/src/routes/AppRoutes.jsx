import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";

import ResumeUploadPage from "../pages/ResumeUploadPage";
import AIAnalysisPage from "../pages/AIAnalysisPage";
import SkillRecommendationPage from "../pages/SkillRecommendationPage";
import JobRecommendationPage from "../pages/JobRecommendationPage";
import ResumeBuilderPage from "../pages/ResumeBuilderPage";
import ProfilePage from "../pages/ProfilePage";
import AIInterviewPage from "../pages/AIInterviewPage";
import AIChatbotPage from "../pages/AIChatbotPage";
import AdminPanel from "../pages/AdminPanel";
import ResumeImprovementPage from "../pages/ResumeImprovementPage";

import PortfolioGeneratorPage from "../pages/PortfolioGeneratorPage";

import PortfolioPreviewPage from "../pages/PortfolioPreviewPage";

import PortfolioTemplatesPage from "../pages/PortfolioTemplatesPage";
const PrivateRoute = ({ children }) => {

  const { isAuthenticated } =
    useAuth();

  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />;
};

export default function AppRouter() {

  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
  path="/login"
  element={
    isAuthenticated
      ? <Navigate to="/dashboard" />
      : <Login />
  }
/>

      <Route path="/signup" element={<Signup />} />
     <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
<Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <ResumeUploadPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/analysis"
        element={
          <PrivateRoute>
            <AIAnalysisPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/skills"
        element={
          <PrivateRoute>
            <SkillRecommendationPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/jobs"
        element={
          <PrivateRoute>
            <JobRecommendationPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/builder"
        element={
          <PrivateRoute>
            <ResumeBuilderPage />
          </PrivateRoute>
        }
      />

     

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      

      <Route
        path="/interview"
        element={
          <PrivateRoute>
            <AIInterviewPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/chatbot"
        element={
          <PrivateRoute>
            <AIChatbotPage />
          </PrivateRoute>
        }
      />
      <Route
  path="/resume-improvement"
  element={
    <PrivateRoute>
      <ResumeImprovementPage />
    </PrivateRoute>
  }
/>

<Route
  path="/portfolio-generator"
  element={
    <PrivateRoute>
      <PortfolioGeneratorPage />
    </PrivateRoute>
  }
/>

<Route
  path="/portfolio-preview"
  element={
    <PrivateRoute>
      <PortfolioPreviewPage />
    </PrivateRoute>
  }
/>

<Route
  path="/portfolio-templates"
  element={
    <PrivateRoute>
      <PortfolioTemplatesPage />
    </PrivateRoute>
  }
/>

      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}