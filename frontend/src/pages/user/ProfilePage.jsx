import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { updateProfileSchema } from "../../validations/authValidation.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { authService } from "../../services/authService.js";
import { handleApiError } from "../../utils/errorHandler.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { User, Mail, ShieldCheck, Pencil, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name || "" },
  });

  useEffect(() => {
    if (user?.name) {
      setValue("name", user.name);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const updated = await authService.updateProfile(data);
      updateUser(updated);
      toast.success("Profile updated successfully!");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      handleApiError(err, "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your personal information and account details."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Avatar */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-teal-500/20">
              {initials}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <Pencil className="w-4 h-4 text-teal-600" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>

          <div className="mt-3">
            <Badge variant={user?.role === "ADMIN" ? "warning" : "teal"} size="md">
              {user?.role === "ADMIN" ? "⚡ Administrator" : "✦ Member"}
            </Badge>
          </div>

          {/* Account Status */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Account Status</span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Verified Email</span>
              <ShieldCheck className="w-4 h-4 text-teal-600" />
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-7 shadow-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-teal-600" />
            Personal Information
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
            <Input
              label="Full Name"
              type="text"
              icon={User}
              error={errors.name?.message}
              required
              {...register("name")}
            />

            {/* Email (read-only) */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-sm text-slate-600 flex-1">{user?.email}</span>
                <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
              </div>
              <p className="text-xs text-slate-400">Email address cannot be changed for security.</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                variant={saved ? "outline" : "primary"}
                isLoading={loading}
                disabled={!isDirty || loading}
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Saved!
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              {isDirty && !saved && (
                <p className="text-xs text-slate-400">You have unsaved changes.</p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
