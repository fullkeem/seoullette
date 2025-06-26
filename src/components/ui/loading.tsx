interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function Loading({ size = "md", text }: LoadingProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`${sizes[size]} border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
}
