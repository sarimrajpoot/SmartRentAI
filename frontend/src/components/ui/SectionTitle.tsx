interface Props {
  badge: string;
  title: string;
  subtitle: string;
}

export default function SectionTitle({
  badge,
  title,
  subtitle,
}: Props) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-20">
      <span className="uppercase tracking-widest text-blue-600 font-semibold">
        {badge}
      </span>

      <h2 className="mt-4 text-5xl font-bold">
        {title}
      </h2>

      <p className="mt-6 text-lg text-slate-600">
        {subtitle}
      </p>
    </div>
  );
}