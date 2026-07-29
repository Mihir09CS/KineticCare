import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const colorMap = {
  teal: {
    bg: "bg-teal-50",
    icon: "text-teal-600",
    value: "text-teal-700",
    border: "border-l-teal-500",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    value: "text-emerald-700",
    border: "border-l-emerald-500",
  },
  sky: {
    bg: "bg-sky-50",
    icon: "text-sky-600",
    value: "text-sky-700",
    border: "border-l-sky-500",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    value: "text-amber-700",
    border: "border-l-amber-500",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    value: "text-red-700",
    border: "border-l-red-500",
  },
  indigo: {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    value: "text-indigo-700",
    border: "border-l-indigo-500",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
    value: "text-violet-700",
    border: "border-l-violet-500",
  },
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  color = "teal",
  trend,
  trendLabel,
  suffix = "",
  index = 0,
  accentBorder = false,
}) => {
  const colors = colorMap[color] || colorMap.teal;

  const trendIcon =
    trend === "up" ? TrendingUp :
    trend === "down" ? TrendingDown :
    Minus;

  const TrendIcon = trendIcon;

  const trendColor =
    trend === "up" ? "text-emerald-600" :
    trend === "down" ? "text-red-500" :
    "text-slate-400";

  return (
    <motion.div
      className={`
        bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm
        hover:shadow-md hover:border-slate-300 transition-all duration-200
        ${accentBorder ? `border-l-4 ${colors.border}` : ""}
      `}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-3xl font-black text-slate-800">
            {value}
            {suffix && <span className="text-lg font-semibold text-slate-400 ml-1">{suffix}</span>}
          </p>
          {trendLabel && (
            <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{trendLabel}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-2xl ${colors.bg} ${colors.icon} flex items-center justify-center shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
