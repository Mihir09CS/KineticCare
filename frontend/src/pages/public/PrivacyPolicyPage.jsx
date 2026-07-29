import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Eye,
  Cookie,
  Server,
  UserCheck,
  Mail,
  AlertCircle,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader.jsx";

const PrivacyPolicyPage = () => {
  const lastUpdated = "July 29, 2026";

  const sections = [
    {
      id: "introduction",
      icon: ShieldCheck,
      title: "1. Introduction",
      content: `Welcome to KineticCare ("we," "our," or "us"). We are committed to protecting the privacy, security, and confidentiality of your personal information. This Privacy Policy explains how KineticCare collects, uses, discloses, and safeguards your information when you visit our web platform or use our appointment scheduling services for active senior wellness programs.`,
    },
    {
      id: "information-collected",
      icon: Eye,
      title: "2. Information We Collect",
      content: `We collect information necessary to provide seamless booking and personalized senior wellness management:`,
      bullets: [
        "Personal Identification: Name, email address, password hash, and basic profile information provided during registration.",
        "Appointment & Health Preferences: Booked services, slot schedules, and optional appointment notes communicated to wellness practitioners.",
        "Technical & Device Data: IP address, browser type, operating system, and log metadata collected automatically during platform navigation.",
      ],
    },
    {
      id: "how-we-use",
      icon: Server,
      title: "3. How We Use Your Information",
      content: `Your information is strictly utilized to operate and improve the KineticCare wellness experience:`,
      bullets: [
        "To process, confirm, and manage your wellness service appointments.",
        "To send automated booking notifications, appointment reminders, and account updates.",
        "To personalize user and administrator dashboards based on appointment history.",
        "To maintain system security, detect fraud, and ensure backend operational integrity.",
      ],
    },
    {
      id: "cookies",
      icon: Cookie,
      title: "4. Cookies & Session Storage",
      content: `KineticCare uses secure HttpOnly Cookies and session tokens to manage user authentication and session persistence. HttpOnly cookies cannot be accessed via client-side JavaScript, preventing Cross-Site Scripting (XSS) attacks. We do not use third-party tracking cookies or sell your browsing activity to advertising networks.`,
    },
    {
      id: "security",
      icon: Lock,
      title: "5. Data Security",
      content: `We implement industry-standard administrative, physical, and technical security measures to protect your personal data. Passwords are hashed using bcrypt before storage in database, and all network communications use TLS/HTTPS encryption. While we enforce rigorous protection protocols, no electronic transmission over the Internet can be guaranteed 100% secure.`,
    },
    {
      id: "third-party",
      icon: Server,
      title: "6. Third-Party Services",
      content: `KineticCare does not sell, trade, or rent your personal data to third parties. We may interface with trusted infrastructure partners (such as database hosting providers) solely to host and execute backend services under strict data privacy obligations.`,
    },
    {
      id: "user-rights",
      icon: UserCheck,
      title: "7. User Rights & Data Control",
      content: `Depending on your location, you hold the following rights regarding your personal information:`,
      bullets: [
        "Right of Access: View all active and past booking records directly via your User Dashboard.",
        "Right to Rectification: Update your profile name and credentials anytime in Profile Settings.",
        "Right to Erasure / Cancellation: Cancel pending appointments and request account deactivation.",
        "Right to Data Portability: Request a export copy of your stored booking data.",
      ],
    },
    {
      id: "contact-info",
      icon: Mail,
      title: "8. Contact Information",
      content: `If you have questions, concerns, or data inquiries regarding this Privacy Policy, please contact our privacy representative:`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Page Header */}
        <PageHeader
          title="Privacy Policy"
          subtitle="How we collect, use, and protect your personal information on KineticCare."
          badge={
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              Data Protection & Privacy
            </div>
          }
        >
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            Last Updated: {lastUpdated}
          </div>
        </PageHeader>

        {/* Document Body */}
        <div className="space-y-6">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.id}
                id={sec.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {sec.title}
                  </h2>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {sec.content}
                </p>

                {sec.bullets && (
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {sec.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {sec.id === "contact-info" && (
                  <div className="mt-4 bg-teal-50/70 border border-teal-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Mihir Parida</p>
                      <p className="text-xs text-slate-500">Lead Platform Developer & Administrator</p>
                    </div>
                    <a
                      href="mailto:mihirparidaw1@gmail.com"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      mihirparidaw1@gmail.com
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer Section */}
        <motion.div
          className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 text-amber-900 space-y-2 shadow-xs"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            Educational Portfolio Project Disclaimer
          </div>
          <p className="text-xs text-amber-800/90 leading-relaxed italic">
            Disclaimer: KineticCare is a portfolio project developed for educational and demonstration purposes. It is not intended to provide medical advice, diagnosis, treatment, or emergency healthcare services.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
