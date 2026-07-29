import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleGuard from "./RoleGuard.jsx";
import { DashboardSkeleton } from "../components/common/Skeleton.jsx";

// ── Lazy-loaded Public Pages ──
const HomePage = lazy(() => import("../pages/public/HomePage.jsx"));
const AboutPage = lazy(() => import("../pages/public/AboutPage.jsx"));
const ServicesPage = lazy(() => import("../pages/public/ServicesPage.jsx"));
const ServiceDetailPage = lazy(() => import("../pages/public/ServiceDetailPage.jsx"));
const ContactPage = lazy(() => import("../pages/public/ContactPage.jsx"));
const PrivacyPolicyPage = lazy(() => import("../pages/public/PrivacyPolicyPage.jsx"));
const TermsOfServicePage = lazy(() => import("../pages/public/TermsOfServicePage.jsx"));

// ── Lazy-loaded Auth Pages ──
const LoginPage = lazy(() => import("../pages/auth/LoginPage.jsx"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage.jsx"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage.jsx"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage.jsx"));

// ── Lazy-loaded User Pages ──
const UserDashboardPage = lazy(() => import("../pages/user/UserDashboardPage.jsx"));
const MyBookingsPage = lazy(() => import("../pages/user/MyBookingsPage.jsx"));
const UpcomingBookingsPage = lazy(() => import("../pages/user/UpcomingBookingsPage.jsx"));
const ProfilePage = lazy(() => import("../pages/user/ProfilePage.jsx"));
const ChangePasswordPage = lazy(() => import("../pages/user/ChangePasswordPage.jsx"));

// ── Lazy-loaded Admin Pages ──
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage.jsx"));
const AdminServicesPage = lazy(() => import("../pages/admin/AdminServicesPage.jsx"));
const AdminSlotsPage = lazy(() => import("../pages/admin/AdminSlotsPage.jsx"));
const AdminBookingsPage = lazy(() => import("../pages/admin/AdminBookingsPage.jsx"));

// ── Error Pages ──
const NotFoundPage = lazy(() => import("../pages/errors/NotFoundPage.jsx"));
const UnauthorizedPage = lazy(() => import("../pages/errors/UnauthorizedPage.jsx"));

// ── Page Suspense Wrapper ──
const PageSuspense = ({ children }) => (
  <Suspense
    fallback={
      <div className="p-8">
        <DashboardSkeleton />
      </div>
    }
  >
    {children}
  </Suspense>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<PageSuspense><HomePage /></PageSuspense>} />
        <Route path="/about" element={<PageSuspense><AboutPage /></PageSuspense>} />
        <Route path="/services" element={<PageSuspense><ServicesPage /></PageSuspense>} />
        <Route path="/services/:id" element={<PageSuspense><ServiceDetailPage /></PageSuspense>} />
        <Route path="/contact" element={<PageSuspense><ContactPage /></PageSuspense>} />
        <Route path="/privacy-policy" element={<PageSuspense><PrivacyPolicyPage /></PageSuspense>} />
        <Route path="/terms-of-service" element={<PageSuspense><TermsOfServicePage /></PageSuspense>} />

        {/* Auth Pages */}
        <Route path="/login" element={<PageSuspense><LoginPage /></PageSuspense>} />
        <Route path="/register" element={<PageSuspense><RegisterPage /></PageSuspense>} />
        <Route path="/forgot-password" element={<PageSuspense><ForgotPasswordPage /></PageSuspense>} />
        <Route path="/reset-password/:token" element={<PageSuspense><ResetPasswordPage /></PageSuspense>} />

        {/* Error Pages */}
        <Route path="/unauthorized" element={<PageSuspense><UnauthorizedPage /></PageSuspense>} />
        <Route path="/404" element={<PageSuspense><NotFoundPage /></PageSuspense>} />
      </Route>

      {/* Protected User Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<PageSuspense><UserDashboardPage /></PageSuspense>} />
        <Route path="/my-bookings" element={<PageSuspense><MyBookingsPage /></PageSuspense>} />
        <Route path="/my-bookings/upcoming" element={<PageSuspense><UpcomingBookingsPage /></PageSuspense>} />
        <Route path="/profile" element={<PageSuspense><ProfilePage /></PageSuspense>} />
        <Route path="/change-password" element={<PageSuspense><ChangePasswordPage /></PageSuspense>} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <RoleGuard allowedRole="ADMIN">
              <AdminLayout />
            </RoleGuard>
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<PageSuspense><AdminDashboardPage /></PageSuspense>} />
        <Route path="/admin/services" element={<PageSuspense><AdminServicesPage /></PageSuspense>} />
        <Route path="/admin/slots" element={<PageSuspense><AdminSlotsPage /></PageSuspense>} />
        <Route path="/admin/bookings" element={<PageSuspense><AdminBookingsPage /></PageSuspense>} />
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
