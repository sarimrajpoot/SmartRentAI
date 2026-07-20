interface BookingSummaryProps {
  dailyPrice: number;
  days: number;
  withDriver: boolean;
  withInsurance: boolean;
}

export default function BookingSummary({ dailyPrice, days, withDriver, withInsurance }: BookingSummaryProps) {
  const driverCost = withDriver ? 2000 * days : 0;
  const insuranceCost = withInsurance ? 1500 * days : 0;
  const rentalCost = dailyPrice * days;
  const subtotal = rentalCost + driverCost + insuranceCost;
  const tax = subtotal * 0.16; // 16% tax
  const total = subtotal + tax;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-4">
      <h3 className="text-lg font-bold text-white mb-2">Price Breakdown</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-zinc-300">
          <span>Rs {dailyPrice.toLocaleString()} x {days} days</span>
          <span>Rs {rentalCost.toLocaleString()}</span>
        </div>
        
        {withDriver && (
          <div className="flex justify-between text-zinc-300">
            <span>Chauffeur Service</span>
            <span>Rs {driverCost.toLocaleString()}</span>
          </div>
        )}
        
        {withInsurance && (
          <div className="flex justify-between text-zinc-300">
            <span>Premium Insurance</span>
            <span>Rs {insuranceCost.toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex justify-between text-zinc-300">
          <span>Taxes & Fees (16%)</span>
          <span>Rs {tax.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="pt-4 border-t border-zinc-800 flex justify-between items-end">
        <div>
          <span className="block text-sm text-zinc-400 font-medium">Total Price</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">Rs {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
