import { ButtonProps } from "@/types";

export function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  loading = false,
  type = "button",
  className = "",
}: ButtonProps) {
  const baseClasses =
    "rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? "cursor-not-allowed" : ""
      } ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "로딩 중..." : children}
    </button>
  );
}
