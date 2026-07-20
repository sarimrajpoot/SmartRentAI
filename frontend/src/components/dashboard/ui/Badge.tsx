import type { ReactNode } from "react";

type BadgeVariant = "blue" | "green" | "red" | "yellow" | "purple" | "slate";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-200/50",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
  red: "bg-red-50 text-red-700 border-red-200/50",
  yellow: "bg-amber-50 text-amber-700 border-amber-200/50",
  purple: "bg-purple-50 text-purple-700 border-purple-200/50",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
};

const dotStyles: Record<BadgeVariant, string> = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  red: "bg-red-500",
  yellow: "bg-amber-500",
  purple: "bg-purple-500",
  slate: "bg-slate-500",
};

export default function Badge({ children, variant = "slate", className = "", dot = false }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotStyles[variant]}`} />
      )}
      {children}
    </span>
  );
}
