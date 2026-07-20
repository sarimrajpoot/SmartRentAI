import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

import AnimatedNumber from "/Volumes/Macbook OS - Data/SmartRentAI/frontend/src/components/ui/AnimatedNumber.tsx";

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: "blue" | "green" | "purple" | "orange" | "slate";
}

const colorStyles = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    ring: "ring-blue-100",
  },
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    ring: "ring-emerald-100",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    ring: "ring-purple-100",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    ring: "ring-orange-100",
  },
  slate: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    ring: "ring-slate-100",
  },
};

export default function StatCard({
  title,
  value,
  prefix = "",
  suffix = "",
  icon,
  trend,
  trendLabel = "vs last month",
  color = "blue",
}: StatCardProps) {
  const style = colorStyles[color];

  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        hover:border-slate-300
        hover:shadow-xl
      "
    >
      {/* Background Glow */}
      <div
        className={`
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          opacity-20
          blur-3xl
          transition-opacity
          group-hover:opacity-40
          ${style.bg}
        `}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>
        </div>

        <motion.div
          whileHover={{
            rotate: 8,
            scale: 1.1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
          }}
          className={`
            relative
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            ring-1
            ${style.bg}
            ${style.text}
            ${style.ring}
          `}
        >
          {icon}
        </motion.div>
      </div>

      {/* Value */}
      <div className="relative">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
          <AnimatedNumber
            value={value}
            prefix={prefix}
            suffix={suffix}
          />
        </h2>
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="relative mt-5 flex items-center gap-2">
          <div
            className={`
              flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold

              ${
                trend > 0
                  ? "bg-emerald-100 text-emerald-700"
                  : trend < 0
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-600"
              }
            `}
          >
            {trend > 0 ? (
              <TrendingUp size={14} />
            ) : trend < 0 ? (
              <TrendingDown size={14} />
            ) : (
              <Minus size={14} />
            )}

            {Math.abs(trend)}%
          </div>

          <span className="text-xs text-slate-400">
            {trendLabel}
          </span>
        </div>
      )}
    </motion.div>
  );
}