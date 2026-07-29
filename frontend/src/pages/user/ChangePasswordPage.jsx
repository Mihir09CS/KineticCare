import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { changePasswordSchema } from "../../validations/authValidation.js";
import { authService } from "../../services/authService.js";
import { handleApiError } from "../../utils/errorHandler.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

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

const ChangePasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [watchedNew, setWatchedNew] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const newPassword = watch("newPassword", "");
  useEffect(() => {
    setWatchedNew(newPassword);
  }, [newPassword]);

  const strength = getPasswordStrength(watchedNew);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authService.changePassword(data);
      toast.success("Password updated successfully!");
      reset();
      setWatchedNew("");
    } catch (err) {
      handleApiError(err, "Failed to change password. Ensure your current password is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Change Password"
        subtitle="Keep your account secure by updating your password regularly."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tips Card */}
        <motion.div
          className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm h-fit"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Security Tips</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-500">
            {[
              "Use at least 8 characters",
              "Include uppercase and lowercase letters",
              "Add numbers and special characters (!@#$...)",
              "Avoid using personal information",
              "Never reuse old passwords",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Form */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-7 shadow-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-600" />
            Update Password
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              icon={Lock}
              error={errors.currentPassword?.message}
              required
              {...register("currentPassword")}
            />

            <div className="space-y-2">
              <Input
                label="New Password"
                type="password"
                placeholder="Create a new password"
                icon={Lock}
                error={errors.newPassword?.message}
                required
                {...register("newPassword")}
              />

              {watchedNew && (
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
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
                      Strength: {strength.label}
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            <Button type="submit" variant="primary" isLoading={loading}>
              Update Password
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
