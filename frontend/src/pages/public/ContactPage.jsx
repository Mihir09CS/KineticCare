import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Globe,
  Send,
  User,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Input from "../../components/common/Input.jsx";
import TextArea from "../../components/common/TextArea.jsx";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import toast from "react-hot-toast";

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

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
});

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Thank you! Your message has been received.");
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 6000);
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <PageHeader
          title="Get In Touch"
          subtitle="Have questions about KineticCare or want to connect with the developer? Send a message below."
          badge={
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              <Mail className="w-3.5 h-3.5" />
              Contact & Developer Details
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Developer Info Card (5 cols) */}
          <motion.div
            className="lg:col-span-5 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Main Developer Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-0 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
                    MP
                  </div>
                  <div>
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Platform Developer</span>
                    <h2 className="text-2xl font-extrabold text-slate-900">Mihir Parida</h2>
                    <p className="text-xs text-slate-500 font-medium">Senior Frontend & Web Architect</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed pt-2">
                  KineticCare was designed and built as a full-stack smart senior wellness platform. Feel free to reach out for inquiries, project discussions, or developer portfolios.
                </p>

                {/* Details List */}
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  {/* Email */}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400 font-medium">Email Address</p>
                      <a
                        href="mailto:mihirparidaw1@gmail.com"
                        className="font-semibold text-slate-800 hover:text-teal-600 transition-colors truncate block"
                      >
                        mihirparidaw1@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Location</p>
                      <p className="font-semibold text-slate-800">India</p>
                    </div>
                  </div>
                </div>

                {/* Social & Portfolio Links */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Developer Links
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <a
                      href="https://github.com/Mihir09CS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700 text-xs font-bold transition-all group"
                    >
                      <GithubIcon className="w-4 h-4 text-slate-600 group-hover:text-white shrink-0" />
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-slate-400 group-hover:text-white/70" />
                    </a>

                    <a
                      href="https://www.linkedin.com/in/mihir-parida-43b0aa295/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-sky-600 hover:text-white hover:border-sky-600 text-slate-700 text-xs font-bold transition-all group"
                    >
                      <LinkedinIcon className="w-4 h-4 text-slate-600 group-hover:text-white shrink-0" />
                      <span>LinkedIn</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-slate-400 group-hover:text-white/70" />
                    </a>

                    <a
                      href="https://mihirparida.netlify.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-600 hover:text-white hover:border-teal-600 text-slate-700 text-xs font-bold transition-all group"
                    >
                      <Globe className="w-4 h-4 text-slate-600 group-hover:text-white shrink-0" />
                      <span>Portfolio</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-slate-400 group-hover:text-white/70" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Note Box */}
            <div className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-3xl p-6 text-white space-y-2 shadow-md shadow-teal-600/10">
              <div className="flex items-center gap-2 font-bold text-sm text-teal-100">
                <Sparkles className="w-4 h-4" />
                Senior Wellness Platform
              </div>
              <p className="text-xs text-teal-100/90 leading-relaxed">
                KineticCare provides end-to-end appointment scheduling, capacity slot management, and role-based client & admin management.
              </p>
            </div>
          </motion.div>

          {/* RIGHT: Modern Contact Form (7 cols) */}
          <motion.div
            className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Send a Message
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Fill in the details below and we will get back to you promptly.
              </p>
            </div>

            {submitted && (
              <motion.div
                className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm font-semibold"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                Thank you! Your message has been received.
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Your Name"
                type="text"
                placeholder="e.g. John Smith"
                icon={User}
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                icon={Mail}
                error={errors.email?.message}
                required
                {...register("email")}
              />

              <TextArea
                label="Message"
                placeholder="Write your question, feedback, or inquiry here..."
                rows={5}
                error={errors.message?.message}
                required
                {...register("message")}
              />

              <Button
                type="submit"
                variant="gradient"
                fullWidth
                isLoading={loading}
                size="lg"
                className="mt-2 shadow-md shadow-teal-600/20"
              >
                Send Message
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
