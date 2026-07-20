

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden relative">
      <div className="flex items-start justify-between">
        <div>
          <div className="w-24 h-4 bg-slate-100 rounded-lg animate-pulse mb-3" />
          <div className="w-32 h-8 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="w-12 h-12 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
      <div className="mt-6 flex items-center gap-2">
        <div className="w-16 h-4 bg-slate-100 rounded-lg animate-pulse" />
        <div className="w-20 h-4 bg-slate-100 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
