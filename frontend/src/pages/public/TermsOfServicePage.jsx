import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  Calendar,
  AlertOctagon,
  Shield,
  Copyright,
  AlertCircle,
  Ban,
  Mail,
  ArrowLeft,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader.jsx";

const TermsOfServicePage = () => {
  const effectiveDate = "July 29, 2026";

  const sections = [
    {
      id: "acceptance",
      icon: CheckCircle2,
      title: "1. Acceptance of Terms",
      content: `By accessing, registering, or utilizing the KineticCare senior wellness platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue using our services immediately.`,
    },
    {
      id: "user-responsibilities",
      icon: Shield,
      title: "2. User Responsibilities & Account Security",
      content: `Users are responsible for maintaining accurate account credentials and ensuring the confidentiality of their passwords:`,
      bullets: [
        "You must provide accurate, current, and complete information during registration.",
        "You are solely responsible for all activities occurring under your account.",
        "You agree to notify us immediately of any unauthorized use or security breach.",
        "Account sharing or unauthorized credential distribution is strictly prohibited.",
      ],
    },
    {
      id: "appointment-policy",
      icon: Calendar,
      title: "3. Appointment Booking Policy",
      content: `Appointments booked on KineticCare are subject to real-time slot availability. A booking is considered confirmed only after an automated confirmation is issued to your account and email. Booking slots are allocated on a first-come, first-served basis according to capacity limits set by administration.`,
    },
    {
      id: "cancellation-policy",
      icon: Ban,
      title: "4. Cancellation & Rescheduling Policy",
      content: `Users may cancel upcoming appointments through their User Dashboard up until the scheduled start time. Upon cancellation:`,
      bullets: [
        "Slot capacity is immediately restored for other active seniors.",
        "Cancelled appointments are recorded under your Booking History for administrative tracking.",
        "Repeated non-attendance without prior cancellation may lead to temporary booking restrictions.",
      ],
    },
    {
      id: "platform-usage",
      icon: FileText,
      title: "5. Platform Usage & Conduct",
      content: `You agree to use KineticCare solely for lawful purposes in accordance with these Terms. You must not introduce malicious software, attempt unauthorized backend access, overload scheduling queues, or interfere with other users' access to wellness services.`,
    },
    {
      id: "intellectual-property",
      icon: Copyright,
      title: "6. Intellectual Property",
      content: `All content, branding, design system assets, visual interfaces, code base, logos, and features of KineticCare are the exclusive intellectual property of the platform developer (Mihir Parida). Unauthorized copying, distribution, or reverse engineering is strictly prohibited.`,
    },
    {
      id: "limitation-of-liability",
      icon: AlertOctagon,
      title: "7. Limitation of Liability",
      content: `KineticCare and its developers shall not be liable for any indirect, incidental, special, or consequential damages resulting from platform downtime, appointment cancellations by instructors, system error, or inability to access services.`,
    },
    {
      id: "termination",
      icon: Ban,
      title: "8. Account Termination",
      content: `We reserve the right to suspend or terminate user accounts or restrict access to services immediately, without prior notice, if a user violates these Terms of Service or engages in fraudulent activity.`,
    },
    {
      id: "contact",
      icon: Mail,
      title: "9. Contact & Inquiries",
      content: `If you have questions regarding these Terms of Service, please reach out to:`,
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
          title="Terms of Service"
          subtitle="Please read these terms carefully before using the KineticCare platform."
          badge={
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              <FileText className="w-3.5 h-3.5" />
              Legal Terms & Governance
            </div>
          }
        >
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            Effective Date: {effectiveDate}
          </div>
        </PageHeader>

        {/* Document Sections */}
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

                {sec.id === "contact" && (
                  <div className="mt-4 bg-teal-50/70 border border-teal-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Mihir Parida</p>
                      <p className="text-xs text-slate-500">Developer & Platform Administrator</p>
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

export default TermsOfServicePage;
