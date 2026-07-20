import { Search, MapPin, SlidersHorizontal } from "lucide-react";

export default function SearchFilters() {
  return (
    <div className="w-full max-w-4xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row gap-2 shadow-2xl">
      <div className="flex-1 flex items-center px-4 py-2 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
        <MapPin size={18} className="text-zinc-500 mr-3" />
        <input 
          type="text" 
          placeholder="Where to?" 
          className="w-full bg-transparent text-white focus:outline-none placeholder:text-zinc-600 text-sm"
        />
      </div>
      <div className="hidden md:flex flex-1 items-center px-4 py-2 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
        <SlidersHorizontal size={18} className="text-zinc-500 mr-3" />
        <select className="w-full bg-transparent text-zinc-300 focus:outline-none text-sm appearance-none cursor-pointer">
          <option value="" className="bg-zinc-900">Any Vehicle Type</option>
          <option value="suv" className="bg-zinc-900">SUV</option>
          <option value="sedan" className="bg-zinc-900">Sedan</option>
          <option value="luxury" className="bg-zinc-900">Luxury</option>
        </select>
      </div>
      <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl px-6 py-3 flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.2)]">
        <Search size={18} />
        <span className="sm:hidden md:inline">Search Cars</span>
      </button>
    </div>
  );
}
