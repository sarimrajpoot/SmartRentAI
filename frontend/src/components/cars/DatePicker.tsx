interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  error?: string;
}

export default function DatePicker({ label, value, onChange, min, error }: DatePickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-zinc-900 border ${error ? 'border-red-500' : 'border-zinc-800 focus:border-blue-500'} text-zinc-100 text-sm rounded-xl px-4 py-3 outline-none transition-colors w-full focus:ring-1 focus:ring-blue-500/50`}
        style={{ colorScheme: "dark" }}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
