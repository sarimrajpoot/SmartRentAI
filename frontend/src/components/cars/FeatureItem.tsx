import type { ReactNode } from "react";

interface FeatureItemProps {
  icon: ReactNode;
  label: string;
}

export default function FeatureItem({ icon, label }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <div className="text-blue-500">
        {icon}
      </div>
      <span className="text-sm font-medium text-zinc-200">{label}</span>
    </div>
  );
}
