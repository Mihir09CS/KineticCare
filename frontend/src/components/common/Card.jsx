import { motion } from "framer-motion";
import { cn } from "../../utils/cn.js";

const variantStyles = {
  default: "bg-white border border-slate-200/80 shadow-sm",
  elevated: "bg-white border border-slate-200/60 shadow-lg shadow-slate-200/60",
  glass: "glass border-white/60 shadow-lg",
  flat: "bg-slate-50/80 border border-slate-200/50",
  outlined: "bg-transparent border-2 border-slate-200",
  dark: "bg-slate-900 border border-slate-800 text-white",
};

const Card = ({
  children,
  className = "",
  variant = "default",
  onClick,
  hoverable = false,
  animate = false,
  padding = "p-6",
  ...props
}) => {
  const baseClasses = `
    rounded-2xl transition-all duration-200
    ${variantStyles[variant] || variantStyles.default}
    ${hoverable || onClick ? "cursor-pointer hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5" : ""}
    ${padding}
    ${className}
  `;

  if (animate) {
    return (
      <motion.div
        onClick={onClick}
        className={baseClasses}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={hoverable ? { y: -2, boxShadow: "0 8px 24px -4px rgba(0,0,0,0.1)" } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
