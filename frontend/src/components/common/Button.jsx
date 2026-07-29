import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 focus:ring-teal-500 shadow-sm hover:shadow-teal-600/25 hover:shadow-md",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-400",
  outline:
    "border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus:ring-teal-500",
  "outline-teal":
    "border border-teal-200 text-teal-700 bg-teal-50/50 hover:bg-teal-100 hover:border-teal-300 focus:ring-teal-500",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm",
  "danger-outline":
    "border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 focus:ring-red-400",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus:ring-slate-400",
  "ghost-teal":
    "text-teal-700 hover:bg-teal-50 active:bg-teal-100 focus:ring-teal-400",
  gradient:
    "bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-sm hover:shadow-teal-600/25 hover:shadow-md",
  amber:
    "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 focus:ring-amber-400 shadow-sm",
  white:
    "bg-white text-slate-800 hover:bg-slate-50 active:bg-slate-100 focus:ring-slate-300 shadow-sm border border-slate-200",
};

const sizes = {
  xs: "px-2.5 py-1 text-xs rounded-lg font-medium gap-1",
  sm: "px-3.5 py-1.5 text-xs rounded-xl font-semibold gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl font-semibold gap-2",
  lg: "px-6 py-3 text-base rounded-2xl font-semibold gap-2",
  xl: "px-8 py-4 text-lg rounded-2xl font-bold gap-2.5",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      fullWidth = false,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        whileTap={!isDisabled ? { scale: 0.97 } : undefined}
        whileHover={!isDisabled ? { scale: 1.01 } : undefined}
        transition={{ duration: 0.1 }}
        className={`
          inline-flex items-center justify-center cursor-pointer transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-55 disabled:cursor-not-allowed disabled:pointer-events-none
          ${variants[variant] || variants.primary}
          ${sizes[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
