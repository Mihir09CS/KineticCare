import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { loginSchema } from "../../validations/authValidation.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { handleApiError } from "../../utils/errorHandler.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { HeartPulse, Mail, Lock, ArrowRight, CheckCircle2, Calendar, Activity } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await login(data);
      toast.success("Welcome back to KineticCare!");
      const role = res?.user?.role;
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      handleApiError(err, "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-cyan-700 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute inset-0 dot-pattern opacity-10" />
        </div>

        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">KineticCare</span>
          </Link>
        </div>

        <div className="relative space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white leading-tight">
              Your wellness journey continues here
            </h2>
            <p className="text-teal-100 text-lg leading-relaxed">
              Sign in to access your appointments, track your progress, and book new sessions.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: Calendar, text: "View & manage upcoming appointments" },
              { icon: Activity, text: "Track your wellness progress" },
              { icon: CheckCircle2, text: "Book new sessions in seconds" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-teal-50">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-teal-200">
          © {new Date().getFullYear()} KineticCare Platform
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 bg-white">
        <motion.div
          className="max-w-md w-full mx-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold text-slate-900">KineticCare</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 mt-2">
              Sign in to your account to continue your wellness journey.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              error={errors.email?.message}
              required
              {...register("email")}
            />

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              fullWidth
              isLoading={loading}
              size="lg"
              className="mt-2"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700 transition-colors">
                Create free account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
