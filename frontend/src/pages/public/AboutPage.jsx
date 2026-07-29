import { motion } from "framer-motion";
import { HeartPulse, CheckCircle, Users, Award, Heart, Zap } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Compassionate Care",
    desc: "We place the safety, comfort, and physical ease of active seniors at the heart of our operations.",
  },
  {
    icon: Zap,
    title: "Modern Accessibility",
    desc: "Clear visual guidelines, high contrast, simple navigation, and automated scheduling reminders.",
  },
  {
    icon: Award,
    title: "Clinical Excellence",
    desc: "We partner only with certified therapists, medical guides, and expert wellness practitioners.",
  },
];

const stats = [
  { value: "500+", label: "Active Members" },
  { value: "50+", label: "Wellness Programs" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "5 yrs", label: "Of Excellence" },
];

const team = [
  { initials: "DR", name: "Dr. Rebecca Chen", role: "Head of Physiotherapy", color: "teal" },
  { initials: "JS", name: "James Sullivan", role: "Senior Yoga Instructor", color: "emerald" },
  { initials: "ML", name: "Maria Lopes", role: "Occupational Therapist", color: "cyan" },
];

const AboutPage = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/20 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-teal-100/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-700 uppercase tracking-widest">
              <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
              Our Mission
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Dedicated to{" "}
              <span className="gradient-text">Healthy, Active</span>
              <br />Senior Living
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              KineticCare is a state-of-the-art health scheduling and program management platform created
              specifically to enable wellness longevity. By streamlining the appointment loop, we empower
              seniors to lead independent, pain-free lives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }, idx) => (
              <motion.div
                key={label}
                className="text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <p className="text-4xl font-black text-teal-600 mb-1">{value}</p>
                <p className="text-sm font-semibold text-slate-500">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-teal-600 font-bold text-sm uppercase tracking-widest mb-3">Our Values</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
                What We Stand For
              </h2>
              <p className="text-slate-500 leading-relaxed">
                Our platform is built on three pillars that guide every feature, every session, and every interaction.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-500 shrink-0" />
                  {title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-teal-600 font-bold text-sm uppercase tracking-widest mb-3">The Team</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
                Meet Our Specialists
              </h2>
              <p className="text-slate-500 leading-relaxed">
                Certified professionals who are passionate about senior health and longevity.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {team.map(({ initials, name, role, color }, idx) => {
              const bgMap = { teal: "from-teal-400 to-teal-600", emerald: "from-emerald-400 to-emerald-600", cyan: "from-cyan-400 to-cyan-600" };
              return (
                <motion.div
                  key={name}
                  className="text-center"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${bgMap[color]} text-white flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-lg`}>
                    {initials}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{name}</h3>
                  <p className="text-sm text-teal-600 font-semibold mt-1">{role}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Users className="w-12 h-12 text-teal-400 mx-auto mb-6" />
            <blockquote className="text-2xl sm:text-3xl font-bold text-white leading-relaxed mb-6">
              "Every senior deserves access to world-class wellness services — on their terms, at their pace."
            </blockquote>
            <p className="text-teal-400 font-bold text-sm uppercase tracking-widest">
              — KineticCare Leadership Team
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
