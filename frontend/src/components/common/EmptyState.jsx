import { motion } from "framer-motion";
import Button from "./Button.jsx";

const EmptyState = ({
  icon: Icon,
  title = "Nothing here yet",
  description,
  action,
  actionLabel,
  actionVariant = "primary",
  className = "",
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-5 mx-auto">
          <Icon className="w-8 h-8" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-base font-bold text-slate-700 mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action && actionLabel && (
        <Button variant={actionVariant} size="sm" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
