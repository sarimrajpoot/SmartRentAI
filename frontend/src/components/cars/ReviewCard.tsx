import { Star } from "lucide-react";

interface ReviewCardProps {
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
}

export default function ReviewCard({ name, date, rating, comment, avatarUrl }: ReviewCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center font-bold text-zinc-400">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              name.charAt(0)
            )}
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">{name}</h4>
            <span className="text-xs text-zinc-500">{date}</span>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star 
              key={i} 
              size={14} 
              className={i <= rating ? "fill-blue-500 text-blue-500" : "text-zinc-700"} 
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed">
        "{comment}"
      </p>
    </div>
  );
}
