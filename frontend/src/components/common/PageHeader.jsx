import { motion } from "framer-motion";

const PageHeader = ({
  title,
  subtitle,
  children,
  badge,
  className = "",
}) => {
  return (
    <motion.div
      className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 ${className}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-1">
        {badge && (
          <div className="mb-2">{badge}</div>
        )}
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 leading-relaxed">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </motion.div>
  );
};

export default PageHeader;
