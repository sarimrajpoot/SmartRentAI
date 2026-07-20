import { Calendar, MapPin, Search, CarFront } from "lucide-react";

export default function SearchBar() {
  return (
    <section className="relative -mt-14 z-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">

          <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-6">

            {/* Pickup Location */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Pick-up Location
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3">
                <MapPin className="text-blue-600 mr-3" size={20} />

                <select className="w-full outline-none bg-transparent">
                  <option>Islamabad</option>
                  <option>Rawalpindi</option>
                  <option>Lahore</option>
                  <option>Karachi</option>
                  <option>Peshawar</option>
                </select>
              </div>
            </div>

            {/* Pickup Date */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Pick-up Date
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3">
                <Calendar className="text-blue-600 mr-3" size={20} />

                <input
                  type="date"
                  className="w-full outline-none"
                />
              </div>
            </div>

            {/* Return Date */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Return Date
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3">
                <Calendar className="text-blue-600 mr-3" size={20} />

                <input
                  type="date"
                  className="w-full outline-none"
                />
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Vehicle Type
              </label>

              <div className="flex items-center border rounded-xl px-4 py-3">
                <CarFront className="text-blue-600 mr-3" size={20} />

                <select className="w-full outline-none bg-transparent">
                  <option>All Vehicles</option>
                  <option>Economy</option>
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>Luxury</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white rounded-xl py-4 font-semibold flex justify-center items-center gap-2">
                <Search size={20} />
                Search
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}