import { Link } from "react-router-dom";
import {
  HeartPulse,
  Mail,
  MapPin,
  Globe,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// Lucide-style Feather SVG for GitHub
const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Lucide-style Feather SVG for LinkedIn
const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      {/* Top CTA Banner */}
      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Senior Wellness Simplified
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Ready to start your wellness journey?
              </h2>
              <p className="text-sm text-slate-400">
                Discover active senior classes, hydrotherapy, physiotherapy & personalized care.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/services"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-teal-500/20 hover:shadow-teal-500/30"
              >
                Explore Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* COLUMN 1 — BRAND */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Kinetic<span className="text-teal-400">Care</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              KineticCare is a smart senior wellness platform that helps users discover wellness services, book appointments, and manage their healthcare journey with ease.
            </p>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Platform Online
            </div>
          </div>

          {/* COLUMN 2 — QUICK LINKS */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-5 border-b border-slate-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "Wellness Services" },
                { to: "/about", label: "About Us" },
                { to: "/services", label: "Book Appointment" },
                { to: "/dashboard", label: "Dashboard" },
                { to: "/contact", label: "Contact" },
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/terms-of-service", label: "Terms of Service" },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="hover:text-teal-400 transition-colors inline-flex items-center gap-1.5 hover:translate-x-1 duration-200"
                  >
                    <span className="text-teal-500/60 font-mono text-xs">›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3 — SERVICES */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-5 border-b border-slate-800 pb-2">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              {[
                "Physiotherapy",
                "Yoga",
                "Meditation",
                "Nutrition",
                "Mental Wellness",
                "Occupational Therapy",
                "Hydrotherapy",
                "Balance & Mobility",
              ].map((serviceName) => (
                <li key={serviceName}>
                  <Link
                    to={`/services?category=${encodeURIComponent(serviceName)}`}
                    className="hover:text-teal-400 transition-colors inline-flex items-center gap-1.5 hover:translate-x-1 duration-200"
                  >
                    <span className="text-teal-500/60 font-mono text-xs">›</span>
                    {serviceName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4 — CONTACT */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-widest uppercase mb-5 border-b border-slate-800 pb-2">
              Contact & Creator
            </h4>

            <div className="space-y-3.5 text-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Developer</p>
                <p className="text-white font-semibold">Mihir Parida</p>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <a
                  href="mailto:mihirparidaw1@gmail.com"
                  className="hover:text-teal-400 transition-colors break-all"
                >
                  mihirparidaw1@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>India</span>
              </div>

              {/* Social Links */}
              <div className="pt-2 flex flex-col gap-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Social Links</p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/Mihir09CS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-300 transition-all duration-200 border border-slate-700"
                    title="GitHub Repository"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/mihir-parida-43b0aa295/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-300 transition-all duration-200 border border-slate-700"
                    title="LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>

                  <a
                    href="https://mihirparida.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-300 transition-all duration-200 border border-slate-700"
                    title="Portfolio Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-center sm:text-left space-y-0.5">
            <p>© 2026 KineticCare. All rights reserved.</p>
            <p className="text-slate-500">Designed & Developed by Mihir Parida.</p>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link to="/privacy-policy" className="hover:text-teal-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-teal-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-teal-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
