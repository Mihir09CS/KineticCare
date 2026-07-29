import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button.jsx";

const ErrorState = ({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  className = "",
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-5 mx-auto">
        <AlertTriangle className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-bold text-slate-700 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6">
        {description}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;
