import { motion } from "framer-motion";

export type BookingTab = "upcoming" | "active" | "completed" | "cancelled";

interface BookingTabsProps {
  activeTab: BookingTab;
  setActiveTab: (tab: BookingTab) => void;
}

const tabs: { id: BookingTab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "active", label: "Active Trips" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function BookingTabs({ activeTab, setActiveTab }: BookingTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === tab.id ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="booking-tab"
              className="absolute inset-0 bg-zinc-800 rounded-full border border-zinc-700"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
