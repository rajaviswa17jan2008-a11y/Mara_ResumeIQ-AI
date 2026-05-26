import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";

import ResumeUploadPage from "../pages/ResumeUploadPage";
import AIAnalysisPage from "../pages/AIAnalysisPage";
import SkillRecommendationPage from "../pages/SkillRecommendationPage";
import JobRecommendationPage from "../pages/JobRecommendationPage";
import ResumeBuilderPage from "../pages/ResumeBuilderPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import AIInterviewPage from "../pages/AIInterviewPage";
import AIChatbotPage from "../pages/AIChatbotPage";
import AdminPanel from "../pages/AdminPanel";

const PrivateRoute = ({ children }) => {
  return children;
};

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

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
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
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