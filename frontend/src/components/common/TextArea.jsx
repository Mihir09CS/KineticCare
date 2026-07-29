import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

const TextArea = forwardRef(
  ({ label, error, hint, rows = 4, className = "", required = false, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            className={`
              w-full px-4 py-2.5 bg-white border rounded-xl text-slate-900 text-sm
              placeholder:text-slate-400 resize-y min-h-[80px]
              transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
              ${
                error
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/30"
                  : "border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:ring-teal-100"
              }
            `}
            {...props}
          />
          {error && (
            <div className="absolute right-3 top-3">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
