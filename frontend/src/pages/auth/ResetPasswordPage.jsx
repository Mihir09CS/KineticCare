import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../validations/authValidation.js";
import { authService } from "../../services/authService.js";
import { handleApiError } from "../../utils/errorHandler.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Card from "../../components/common/Card.jsx";
import { HeartPulse, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authService.resetPassword(token, data);
      toast.success("Password reset successful! Please sign in with your new password.");
      navigate("/login");
    } catch (err) {
      handleApiError(err, "Token is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 space-y-3">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <HeartPulse className="w-7 h-7" />
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Set New Password
          </h1>
          <p className="text-sm text-slate-500">
            Please enter your new password below.
          </p>
        </div>

        <Card className="shadow-xl border-slate-200/80">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              helperText="Min 8 characters"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
              className="mt-6 py-3 text-base shadow-sm"
            >
              Reset Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
