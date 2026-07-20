interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`rounded-3xl bg-white shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}