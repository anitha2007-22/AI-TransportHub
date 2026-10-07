/**
 * App.jsx — root router with protected routes and role guards
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import PlannerPage from "./pages/PlannerPage";
import TrafficPage from "./pages/TrafficPage";
import CarbonPage from "./pages/CarbonPage";
import VoicePage from "./pages/VoicePage";
import ReportsPage from "./pages/ReportsPage";
import NotificationsPage from "./pages/NotificationsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminTransportPage from "./pages/AdminTransportPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import PlaceholderPage from "./pages/PlaceholderPage";

// Guards: redirect to /login if not authenticated
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500">Loading TransportHub…</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Redirect logged-in users away from auth pages
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />

      {/* App routes — protected */}
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="planner" element={<PlannerPage />} />
        <Route path="traffic" element={<TrafficPage />} />
        <Route path="carbon" element={<CarbonPage />} />
        <Route path="voice" element={<VoicePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="admin/users" element={<AdminUsersPage />} />
        <Route path="admin/transport" element={<AdminTransportPage />} />
        <Route path="admin/settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: "12px", fontSize: "14px" } }} />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
