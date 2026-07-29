import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { forgotPasswordSchema } from "../../validations/authValidation.js";
import { authService } from "../../services/authService.js";
import { handleApiError } from "../../utils/errorHandler.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { HeartPulse, Mail, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authService.forgotPassword(data);
      setSubmitted(true);
      toast.success("Reset link sent if account exists!");
    } catch (err) {
      handleApiError(err, "Failed to process password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-50 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 justify-center mb-6">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <HeartPulse className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">KineticCare</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="text-center space-y-4 py-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Check Your Email</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  If an account exists with that email address, we've sent instructions to reset your password. Check your inbox and spam folder.
                </p>
                <Link to="/login" className="inline-block pt-2">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-slate-900">Forgot Password</h1>
                    <p className="text-sm text-slate-500">We'll send you a reset link.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    icon={Mail}
                    error={errors.email?.message}
                    required
                    {...register("email")}
                  />

                  <Button
                    type="submit"
                    variant="gradient"
                    fullWidth
                    isLoading={loading}
                    size="lg"
                  >
                    Send Reset Link
                  </Button>

                  <div className="text-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
