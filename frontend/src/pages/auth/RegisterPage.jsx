import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { registerSchema } from "../../validations/authValidation.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { handleApiError } from "../../utils/errorHandler.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton.jsx";
import { HeartPulse, User, Mail, Lock, ArrowRight, Shield, Heart, Star } from "lucide-react";
import toast from "react-hot-toast";

// Password strength helper
const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { level: score, label: "Weak", color: "bg-red-400" };
  if (score === 3) return { level: score, label: "Fair", color: "bg-amber-400" };
  if (score === 4) return { level: score, label: "Strong", color: "bg-teal-400" };
  return { level: score, label: "Very Strong", color: "bg-emerald-500" };
};

const RegisterPage = () => {
  const { register: registerAccount, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [watchedPassword, setWatchedPassword] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  // Watch password for strength indicator
  const password = watch("password", "");
  useEffect(() => {
    setWatchedPassword(password);
  }, [password]);

  const strength = getPasswordStrength(watchedPassword);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await registerAccount(data);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      handleApiError(err, "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken) => {
    try {
      setLoading(true);
      const res = await googleLogin(idToken);
      toast.success("Account authenticated with Google!");
      const role = res?.user?.role;
      if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      handleApiError(err, "Google sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (errorMsg) => {
    toast.error(errorMsg || "Google authentication failed.");
  };


  return (
    <div className="min-h-screen flex">
      {/* Left: Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-cyan-400/5 blur-3xl" />
          <div className="absolute inset-0 dot-pattern opacity-5" />
        </div>

        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-teal-400" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">KineticCare</span>
          </Link>
        </div>

        <div className="relative space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white leading-tight">
              Join hundreds of active seniors
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Create your free account and start booking premium wellness sessions in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Shield, title: "Secure & Private", desc: "Your health data is protected" },
              { icon: Heart, title: "Personalized", desc: "Sessions tailored to your needs" },
              { icon: Star, title: "5-Star Instructors", desc: "Certified senior care specialists" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{title}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} KineticCare Platform. Free to join.
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 bg-white overflow-y-auto">
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
              Create your account
            </h1>
            <p className="text-slate-500 mt-2">
              Free to join. Start booking wellness sessions today.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
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

            <div className="space-y-2">
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                icon={Lock}
                error={errors.password?.message}
                required
                {...register("password")}
              />

              {/* Password Strength Meter */}
              {watchedPassword && (
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.level ? strength.color : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className={`text-xs font-semibold ${
                      strength.level <= 2 ? "text-red-500" :
                      strength.level === 3 ? "text-amber-600" : "text-emerald-600"
                    }`}>
                      Password strength: {strength.label}
                    </p>
                  )}
                </motion.div>
              )}

              <p className="text-xs text-slate-400">
                Min 8 characters with uppercase, lowercase, number & special char.
              </p>
            </div>

            <Button
              type="submit"
              variant="gradient"
              fullWidth
              isLoading={loading}
              size="lg"
              className="mt-2"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signup_with"
          />

          <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">

            By creating an account, you agree to our{" "}
            <span className="text-teal-600 cursor-pointer hover:underline">Terms of Service</span>{" "}
            and{" "}
            <span className="text-teal-600 cursor-pointer hover:underline">Privacy Policy</span>.
          </p>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
