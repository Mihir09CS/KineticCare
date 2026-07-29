import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import Button from "./Button.jsx";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  const iconColors = {
    danger: "bg-red-50 text-red-600",
    warning: "bg-amber-50 text-amber-600",
    info: "bg-teal-50 text-teal-600",
  };

  const icons = {
    danger: Trash2,
    warning: AlertTriangle,
    info: AlertTriangle,
  };

  const Icon = icons[variant] || AlertTriangle;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 text-center"
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl ${iconColors[variant] || iconColors.danger} flex items-center justify-center mx-auto mb-4`}>
              <Icon className="w-7 h-7" strokeWidth={1.5} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">{description}</p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
              <Button
                variant={variant === "danger" ? "danger" : "primary"}
                fullWidth
                onClick={onConfirm}
                isLoading={isLoading}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
