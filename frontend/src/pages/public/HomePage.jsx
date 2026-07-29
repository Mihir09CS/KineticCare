import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HeartPulse,
  Calendar,
  ShieldCheck,
  Activity,
  ArrowRight,
  Star,
  Users,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
} from "lucide-react";
import Button from "../../components/common/Button.jsx";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const features = [
  {
    icon: Calendar,
    title: "Easy Scheduling",
    desc: "Simple, senior-friendly slot selection with instant email confirmation.",
    color: "teal",
  },
  {
    icon: ShieldCheck,
    title: "Qualified Specialists",
    desc: "Certified professionals specializing in active senior health.",
    color: "emerald",
  },
  {
    icon: Activity,
    title: "Holistic Wellness",
    desc: "From mobility training to meditation, nutrition, and more.",
    color: "cyan",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Browse Services",
    desc: "Explore our curated catalog of senior wellness programs.",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "Pick a Slot",
    desc: "Choose a date and time that fits your schedule perfectly.",
    icon: Clock,
  },
  {
    step: "03",
    title: "Book & Relax",
    desc: "Confirm your booking and receive instant email details.",
    icon: CheckCircle2,
  },
];

const testimonials = [
  {
    quote: "Booking hydrotherapy sessions on KineticCare is so simple. I receive confirmations instantly by email!",
    author: "Robert",
    age: 68,
    rating: 5,
    initials: "R",
  },
  {
    quote: "The senior yoga and meditation sessions helped me regain energy. The instructors are extremely patient.",
    author: "Margaret",
    age: 72,
    rating: 5,
    initials: "M",
  },
  {
    quote: "I love how easy the platform is. My physiotherapy appointments are always smooth and well-organized.",
    author: "James",
    age: 65,
    rating: 5,
    initials: "J",
  },
];

const HomePage = () => {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-teal-50/40 to-cyan-50/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-teal-100/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-100/20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              {/* Badge */}
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-700 uppercase tracking-widest"
              >
                <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                Senior Wellness & Longevity
              </motion.div>

              {/* Heading */}
              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight"
              >
                Smart Wellness
                <span className="block gradient-text">for Active Seniors</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-lg text-slate-500 leading-relaxed max-w-xl"
              >
                Browse premium health services, select convenient slots, and manage your wellness journey — all in one place.
              </motion.p>

              {/* CTAs */}
              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link to="/services">
                  <Button size="lg" variant="gradient" className="shadow-lg shadow-teal-600/20">
                    Explore Services
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline">
                    Learn About Us
                  </Button>
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap items-center gap-6 pt-2"
              >
                {[
                  { icon: Users, value: "500+", label: "Active Members" },
                  { icon: Star, value: "4.9★", label: "Average Rating" },
                  { icon: CheckCircle2, value: "98%", label: "Satisfaction Rate" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-bold text-slate-700">{value}</span>
                    <span className="text-sm text-slate-400">{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Visual Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              {/* Main card */}
              <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-transparent pointer-events-none" />
                <div className="relative space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center">
                      <HeartPulse className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">KineticCare</p>
                      <p className="text-xs text-teal-600 font-semibold">Wellness Platform</p>
                    </div>
                  </div>

                  {/* Session card */}
                  <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
                    <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Next Session</p>
                    <p className="font-bold text-slate-900">Senior Gentle Yoga</p>
                    <p className="text-sm text-slate-500 mt-1">Tomorrow · 9:00 AM – 10:00 AM</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-emerald-700">Confirmed</span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Sessions", value: "12" },
                      { label: "This Month", value: "4" },
                      { label: "Streak", value: "3wk" },
                    ].map(({ label, value }) => (
                      <div key={label} className="text-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <p className="text-xl font-black text-slate-800">{value}</p>
                        <p className="text-xs text-slate-400 font-medium">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Services preview */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Popular Services</p>
                    {["Physiotherapy & Mobility", "Hydrotherapy Sessions", "Senior Yoga"].map((s) => (
                      <div key={s} className="flex items-center gap-2.5 py-2 border-b border-slate-50 last:border-0">
                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                        <span className="text-sm font-medium text-slate-600">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -top-4 -right-4 bg-emerald-500 text-white rounded-2xl px-4 py-2 shadow-lg text-sm font-bold"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Instant Booking
                </div>
              </motion.div>

              {/* Floating badge 2 */}
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-lg text-sm font-bold text-slate-700"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  4.9 Rating
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-teal-600 font-bold text-sm uppercase tracking-widest mb-3">Why KineticCare</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
                Designed for Every Senior
              </h2>
              <p className="text-slate-500 leading-relaxed">
                Our platform is built with accessibility and clarity at its core, making wellness booking effortless.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              const bgColors = { teal: "bg-teal-50", emerald: "bg-emerald-50", cyan: "bg-cyan-50" };
              const iconColors = { teal: "text-teal-600", emerald: "text-emerald-600", cyan: "text-cyan-600" };
              return (
                <motion.div
                  key={idx}
                  className="relative p-8 rounded-3xl border border-slate-200/80 bg-white hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className={`w-14 h-14 rounded-2xl ${bgColors[feat.color]} ${iconColors[feat.color]} flex items-center justify-center mb-5`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-3xl bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-teal-600 font-bold text-sm uppercase tracking-widest mb-3">Process</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
                How It Works
              </h2>
              <p className="text-slate-500 leading-relaxed">
                Three simple steps to your next wellness session.
              </p>
            </motion.div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connecting line (desktop) */}
            <div className="absolute top-12 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200 hidden md:block pointer-events-none" />

            {howItWorks.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  className="relative text-center"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                >
                  {/* Step number circle */}
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="w-24 h-24 rounded-full bg-white border-2 border-teal-200 shadow-lg flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center border-2 border-white">
                      {idx + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-teal-400 font-bold text-sm uppercase tracking-widest mb-3">Stories</p>
              <h2 className="text-4xl font-black text-white tracking-tight mb-4">
                Trusted by Seniors Everywhere
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Real stories from real members who transformed their wellbeing with KineticCare.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-7 backdrop-blur-sm hover:border-teal-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-5 text-sm">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.author}</p>
                    <p className="text-xs text-slate-400">Age {t.age}, KineticCare Member</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="relative bg-gradient-to-br from-teal-600 to-cyan-600 rounded-3xl p-12 text-center overflow-hidden"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/5 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-white/5 blur-2xl" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/90 text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Start Today
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Ready to Feel Better?
              </h2>
              <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Join hundreds of seniors who have transformed their health and wellness with KineticCare.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/services">
                  <Button variant="white" size="xl">
                    Browse Services
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="xl" className="bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-2xl font-bold text-lg px-8 py-4 gap-2.5">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
