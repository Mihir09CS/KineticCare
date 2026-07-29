import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  User,
  KeyRound,
  ChevronRight,
  HeartPulse,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { path: "/my-bookings", label: "Booking History", icon: Calendar },
  { path: "/my-bookings/upcoming", label: "Upcoming", icon: Clock },
  { path: "/profile", label: "Profile Settings", icon: User },
  { path: "/change-password", label: "Change Password", icon: KeyRound },
];

const DashboardLayout = () => {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const SidebarContent = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* User Profile Section */}
      <div className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 border-b border-teal-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-teal-600 font-medium">Member</p>
          </div>
        </div>
      </div>

      {/* Nav Label */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navigation</p>
      </div>

      {/* Nav Items */}
      <nav className="px-3 pb-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group ${
                  isActive
                    ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-teal-600"}`} />
                  <span className="flex-1">{item.label}</span>
                  {!isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: Browse Services */}
      <div className="px-4 pb-4 pt-2 border-t border-slate-100">
        <Link
          to="/services"
          className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-teal-700 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors"
        >
          <HeartPulse className="w-4 h-4" />
          Browse Services
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile: Toggle Sidebar Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Menu className="w-4 h-4" />
            Navigation Menu
          </button>
        </div>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div
                className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 md:hidden p-4 shadow-2xl overflow-y-auto"
                initial={{ x: -288 }}
                animate={{ x: 0 }}
                exit={{ x: -288 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-slate-900">Dashboard</span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <SidebarContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              key="dashboard-content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
