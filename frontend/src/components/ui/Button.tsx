import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const styles = clsx(
    "rounded-xl px-6 py-3 font-semibold transition-all duration-300 active:scale-95",

    {
      "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl":
        variant === "primary",

      "bg-white text-slate-900 hover:bg-slate-100 shadow":
        variant === "secondary",

      "border border-blue-600 text-blue-600 hover:bg-blue-50":
        variant === "outline",
    },

    className
  );

  return (
    <button
      className={styles}
      {...props}
    >
      {children}
    </button>
  );
}