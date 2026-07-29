import { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      type = "text",
      className = "",
      icon: Icon,
      iconRight: IconRight,
      required = false,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const hasLeftPadding = Icon ? "pl-10" : "pl-4";
    const hasRightPadding = isPassword || IconRight || error ? "pr-10" : "pr-4";

    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-slate-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={`
              w-full ${hasLeftPadding} ${hasRightPadding} py-2.5
              bg-white border rounded-xl text-sm text-slate-900
              placeholder:text-slate-400 placeholder:font-normal
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

          {/* Right: Password Toggle / Error Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {error && !isPassword && (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            )}
            {isPassword && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
            {IconRight && !isPassword && (
              <IconRight className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        {/* Error or Hint */}
        {error ? (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
