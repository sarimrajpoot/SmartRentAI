import { CheckCircle2, Clock, MapPin, Flag } from "lucide-react";
import type { BookingStatus } from "../../../../types/booking";
import { motion } from "framer-motion";

interface BookingTimelineProps {
  status: BookingStatus;
}

export default function BookingTimeline({ status }: BookingTimelineProps) {
  // Determine current step index based on status
  // 0 = Pending, 1 = Confirmed, 2 = Active, 3 = Completed
  let currentStepIndex = 0;
  if (status === "CONFIRMED") currentStepIndex = 1;
  if (status === "ACTIVE") currentStepIndex = 2;
  if (status === "COMPLETED") currentStepIndex = 3;
  if (status === "CANCELLED" || status === "REJECTED") currentStepIndex = -1; // special case

  const steps = [
    { label: "Request Sent", icon: <Clock size={20} /> },
    { label: "Confirmed", icon: <CheckCircle2 size={20} /> },
    { label: "In Progress", icon: <MapPin size={20} /> },
    { label: "Completed", icon: <Flag size={20} /> },
  ];

  if (currentStepIndex === -1) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
          <Clock size={32} />
        </div>
        <h3 className="text-xl font-bold text-red-400 mb-2">Booking {status === "REJECTED" ? "Rejected" : "Cancelled"}</h3>
        <p className="text-sm text-red-400/80 max-w-sm">
          This booking has been {status.toLowerCase()}. If you have questions, please contact the host or support.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background Line */}
      <div className="absolute top-6 left-6 right-6 h-1 bg-zinc-800 -z-10 rounded-full" />
      
      {/* Active Line Progress */}
      <div className="absolute top-6 left-6 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-1000 ease-in-out" 
           style={{ width: `calc(${currentStepIndex * 33.33}% - 16px)` }} />
           
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <motion.div 
                initial={false}
                animate={{ 
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isActive ? "#2563EB" : "#27272a", // blue-600 or zinc-800
                  color: isActive ? "#FFFFFF" : "#71717a", // white or zinc-500
                  borderColor: isActive ? "#2563EB" : "#3f3f46" // blue-600 or zinc-700
                }}
                className="w-12 h-12 rounded-full border-4 flex items-center justify-center mb-3 shadow-lg"
              >
                {step.icon}
              </motion.div>
              <span className={`text-sm font-bold ${isActive ? "text-white" : "text-zinc-500"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
