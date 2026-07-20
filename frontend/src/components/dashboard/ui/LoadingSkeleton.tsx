import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({ className = "w-full h-12" }: LoadingSkeletonProps) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      className={`bg-slate-200 rounded-xl ${className}`}
    />
  );
}
