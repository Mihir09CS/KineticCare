const variantMap = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
  danger: "bg-red-50 text-red-600 border-red-200 ring-red-100",
  info: "bg-sky-50 text-sky-700 border-sky-200 ring-sky-100",
  teal: "bg-teal-50 text-teal-700 border-teal-200 ring-teal-100",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-200 ring-cyan-100",
  neutral: "bg-slate-100 text-slate-600 border-slate-200 ring-slate-100",
  orange: "bg-orange-50 text-orange-700 border-orange-200 ring-orange-100",
  purple: "bg-purple-50 text-purple-700 border-purple-200 ring-purple-100",
  dark: "bg-slate-800 text-white border-slate-700",
};

const dotColorMap = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-sky-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  neutral: "bg-slate-400",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
  dark: "bg-slate-400",
};

const Badge = ({
  children,
  variant = "neutral",
  className = "",
  dot = false,
  pulse = false,
  size = "sm",
}) => {
  const sizeClasses = size === "md"
    ? "px-3 py-1 text-sm"
    : "px-2.5 py-0.5 text-xs";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold border
        ${sizeClasses}
        ${variantMap[variant] || variantMap.neutral}
        ${className}
      `}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColorMap[variant] || dotColorMap.neutral}`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColorMap[variant] || dotColorMap.neutral}`}
          />
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;
