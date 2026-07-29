import { Loader2 } from "lucide-react";

const Spinner = ({ size = "md", className = "", label = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 gap-3 ${className}`}>
      <Loader2 className={`animate-spin text-teal-600 ${sizeClasses[size] || sizeClasses.md}`} />
      {label && <p className="text-sm font-medium text-slate-500">{label}</p>}
    </div>
  );
};

export default Spinner;
