import { InputProps } from "@/types";

export function Input({
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
}: InputProps) {
  const baseClasses =
    "w-full px-3 py-2 border rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";
  const normalClasses =
    "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500";
  const errorClasses = "border-red-300 focus:ring-red-500 focus:border-red-500";
  const disabledClasses = "bg-gray-50 cursor-not-allowed";

  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseClasses} ${error ? errorClasses : normalClasses} ${
          disabled ? disabledClasses : ""
        }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? "error-message" : undefined}
      />
      {error && (
        <p
          id="error-message"
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
