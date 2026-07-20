import { motion } from "framer-motion";

export function CarCardSkeleton() {
  return (
    <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800/60 overflow-hidden h-full flex flex-col">
      <motion.div 
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="h-48 sm:h-56 bg-zinc-800 w-full"
      />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <motion.div 
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-6 w-32 bg-zinc-800 rounded-md"
            />
            <motion.div 
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-4 w-20 bg-zinc-800 rounded-md mt-2"
            />
          </div>
          <motion.div 
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-6 w-24 bg-zinc-800 rounded-md"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-zinc-800/50">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-12 bg-zinc-800 rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex flex-col md:flex-row gap-6">
      <motion.div 
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="w-full md:w-64 h-48 md:h-full rounded-2xl bg-zinc-800 shrink-0"
      />
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-6 w-48 bg-zinc-800 rounded-md mb-2" />
            <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-4 w-32 bg-zinc-800 rounded-md" />
          </div>
          <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-8 w-24 bg-zinc-800 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-16 bg-zinc-800 rounded-xl" />
          <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-16 bg-zinc-800 rounded-xl" />
        </div>
        <div className="mt-auto pt-4 flex gap-3 border-t border-zinc-800/60">
          <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-10 w-24 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function BookingTableRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl mb-3">
      <div className="flex items-center gap-4">
        <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-12 w-12 rounded-xl bg-zinc-800" />
        <div>
          <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-5 w-32 bg-zinc-800 rounded-md mb-2" />
          <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-4 w-48 bg-zinc-800 rounded-md" />
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-8 w-24 rounded-full bg-zinc-800" />
        <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-10 w-10 rounded-xl bg-zinc-800" />
      </div>
    </div>
  );
}
