import { useState, useEffect } from "react";
import {
  Sparkles,
  Brain,
  Settings,
  Fuel,
  Users,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/image";
import { getRecommendations } from "../../services/recommendations";
import type {
  RecommendationPreferences,
  RecommendationItem,
} from "../../services/recommendations";

export default function CustomerRecommendations() {
  const [preferences, setPreferences] = useState<RecommendationPreferences>({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    items: RecommendationItem[];
    total: number;
  }>({ items: [], total: 0 });

  const fetchRecommendations = async (prefs: RecommendationPreferences) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecommendations(prefs);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations({});
  }, []);

  const handleSearch = () => {
    fetchRecommendations(preferences);
    setIsExpanded(false);
  };

  const getBadgeColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 75) return "bg-blue-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-zinc-600";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      {/* Preferences Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl mb-8 overflow-hidden">
        <div
          className="p-6 flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Your Preferences</h2>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-zinc-400" />
          ) : (
            <ChevronDown className="w-6 h-6 text-zinc-400" />
          )}
        </div>

        {isExpanded && (
          <div className="p-6 border-t border-zinc-800">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <input
                type="number"
                placeholder="Min Rs"
                value={preferences.budget_min || ""}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    budget_min: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
              />
              <input
                type="number"
                placeholder="Max Rs"
                value={preferences.budget_max || ""}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    budget_max: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
              />
              <select
                value={preferences.seats || ""}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    seats: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-full appearance-none cursor-pointer"
              >
                <option value="">Any Seats</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="7">7</option>
              </select>
              <select
                value={preferences.fuel_type || ""}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    fuel_type: e.target.value || undefined,
                  })
                }
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-full appearance-none cursor-pointer"
              >
                <option value="">Any Fuel</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <select
                value={preferences.transmission || ""}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    transmission: e.target.value || undefined,
                  })
                }
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-full appearance-none cursor-pointer"
              >
                <option value="">Any Transmission</option>
                <option value="AUTOMATIC">AUTOMATIC</option>
                <option value="MANUAL">MANUAL</option>
              </select>
              <input
                type="text"
                placeholder="e.g. Islamabad"
                value={preferences.city || ""}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    city: e.target.value || undefined,
                  })
                }
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white rounded-xl font-bold px-6 py-3 flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Get Recommendations
            </button>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-400">
          {results.total} Vehicles Recommended
        </h3>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Error</h3>
          <p className="text-zinc-400 mb-6">{error}</p>
          <button
            onClick={() => fetchRecommendations(preferences)}
            className="bg-zinc-800 text-white rounded-xl px-6 py-3 font-bold hover:bg-zinc-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[450px] bg-zinc-900 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      ) : results.items.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <Brain className="w-16 h-16 text-zinc-500 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            No matches found
          </h3>
          <p className="text-zinc-400 mb-6">
            Try adjusting your preferences to see more recommendations.
          </p>
          <button
            onClick={() => {
              setPreferences({});
              fetchRecommendations({});
            }}
            className="bg-zinc-800 text-white rounded-xl px-6 py-3 font-bold hover:bg-zinc-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {results.items.map((item, idx) => {
            const { car, match_score, explanation } = item;
            return (
              <div
                key={idx}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden group">
                  <img
                    src={getImageUrl(car.images?.[0])}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <div
                      className={`${getBadgeColor(
                        match_score
                      )} text-white font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg`}
                    >
                      <Sparkles className="w-4 h-4" />
                      {match_score}% Match
                    </div>
                  </div>
                  {car.is_available && (
                    <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-emerald-400 text-sm font-semibold px-3 py-1 rounded-full">
                      Available
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {car.brand} {car.model} {car.variant}
                    </h3>
                    <p className="text-zinc-400 text-lg">
                      Rs {car.daily_price?.toLocaleString() || "0"} / day
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="flex flex-col items-center p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                      <Fuel className="w-5 h-5 text-zinc-400 mb-1" />
                      <span className="text-xs text-zinc-300 font-medium">
                        {car.fuel_type}
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                      <Settings className="w-5 h-5 text-zinc-400 mb-1" />
                      <span className="text-xs text-zinc-300 font-medium truncate w-full text-center">
                        {car.transmission}
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                      <Users className="w-5 h-5 text-zinc-400 mb-1" />
                      <span className="text-xs text-zinc-300 font-medium">
                        {car.seats} Seats
                      </span>
                    </div>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mb-6 flex-grow">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-zinc-300 italic leading-relaxed">
                        "{explanation}"
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/cars/${car.id}`}
                    className="block w-full text-center bg-white text-zinc-950 rounded-full font-bold py-3 hover:bg-zinc-200 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
