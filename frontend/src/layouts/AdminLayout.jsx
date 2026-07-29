import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  LayoutDashboard,
  Stethoscope,
  CalendarRange,
  ClipboardList,
  Shield,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const adminNavItems = [
  { path: "/admin/dashboard", label: "Admin Overview", icon: LayoutDashboard, end: true },
  { path: "/admin/services", label: "Services", icon: Stethoscope },
  { path: "/admin/slots", label: "Slots", icon: CalendarRange },
  { path: "/admin/bookings", label: "Bookings", icon: ClipboardList },
];

const AdminLayout = () => {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  const SidebarContent = () => (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
      {/* Admin Profile Section */}
      <div className="p-5 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-b border-amber-500/20">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Admin Panel</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-xs text-amber-400 font-medium">Administrator</p>
          </div>
        </div>
      </div>

      {/* Nav Label */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Management</p>
      </div>

      {/* Nav Items */}
      <nav className="px-3 pb-4 space-y-0.5">
        {adminNavItems.map((item) => {
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
                    ? "bg-amber-500 text-white shadow-sm shadow-amber-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-amber-500"}`} />
                  <span className="flex-1">{item.label}</span>
                  {!isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile: Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-amber-400 shadow-sm hover:bg-slate-800 transition-colors"
          >
            <Shield className="w-4 h-4" />
            Admin Menu
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-slate-900/70 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div
                className="fixed left-0 top-0 bottom-0 w-72 bg-slate-950 z-50 md:hidden p-4 shadow-2xl overflow-y-auto"
                initial={{ x: -288 }}
                animate={{ x: 0 }}
                exit={{ x: -288 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-amber-400">Admin Panel</span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400"
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
              key="admin-content"
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

export default AdminLayout;
