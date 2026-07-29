import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  HeartPulse,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  Menu,
  X,
  ChevronDown,
  Calendar,
  Settings,
} from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Detect scroll for elevated navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate("/login");
  };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Wellness Services" },
    { to: "/about", label: "About Us" },
  ];

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200/80"
          : "bg-white/80 backdrop-blur-md border-b border-slate-200/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-teal-600/20 group-hover:shadow-teal-600/30 group-hover:scale-105 transition-all duration-200">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">
              Kinetic<span className="text-teal-600">Care</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-150 ${
                  isActive(to)
                    ? "text-teal-700 bg-teal-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {label}
                {isActive(to) && (
                  <motion.div
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-teal-500 rounded-full"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right: Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 hover:border-slate-300"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    {initials}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 overflow-hidden"
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <DropdownLink
                          to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                          icon={LayoutDashboard}
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          Dashboard
                        </DropdownLink>

                        {!isAdmin && (
                          <DropdownLink
                            to="/my-bookings"
                            icon={Calendar}
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            My Bookings
                          </DropdownLink>
                        )}

                        <DropdownLink
                          to="/profile"
                          icon={Settings}
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          Profile Settings
                        </DropdownLink>

                        {isAdmin && (
                          <DropdownLink
                            to="/admin/dashboard"
                            icon={Shield}
                            onClick={() => setUserDropdownOpen(false)}
                            variant="amber"
                          >
                            Admin Panel
                          </DropdownLink>
                        )}
                      </div>

                      <div className="border-t border-slate-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm shadow-teal-600/20 transition-all hover:shadow-md hover:shadow-teal-600/25"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: Hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-slate-200 bg-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                    isActive(to)
                      ? "text-teal-700 bg-teal-50"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </Link>
              ))}

              <div className="border-t border-slate-100 pt-3 mt-3">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 px-4 py-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      Dashboard
                    </Link>
                    {!isAdmin && (
                      <Link
                        to="/my-bookings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        My Bookings
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Helper: Dropdown link item
const DropdownLink = ({ to, icon: Icon, children, onClick, variant = "default" }) => {
  const variantClasses =
    variant === "amber"
      ? "text-amber-700 hover:bg-amber-50"
      : "text-slate-700 hover:bg-slate-50";

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold transition-colors ${variantClasses}`}
    >
      <Icon className={`w-4 h-4 ${variant === "amber" ? "text-amber-600" : "text-teal-600"}`} />
      {children}
    </Link>
  );
};

export default Navbar;
