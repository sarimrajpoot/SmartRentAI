import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { 
  ArrowLeft, 
  Calendar, 
  ShieldAlert, 
  Mail, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  DollarSign,
  Car,
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { getShowroomCustomerDetail, type ShowroomCustomerDetail } from "../../services/dashboard";

export default function ShowroomCustomerDetails() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  
  const [detail, setDetail] = useState<ShowroomCustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"bookings" | "safety" | "damage">("bookings");

  useEffect(() => {
    async function loadDetail() {
      if (!customerId) return;
      try {
        setLoading(true);
        const data = await getShowroomCustomerDetail(customerId);
        setDetail(data);
      } catch (err: any) {
        setError("Failed to load customer details.");
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <AlertCircle size={40} className="text-red-500" />
        <h2 className="text-xl font-bold text-slate-900">Unable to load details</h2>
        <p className="text-slate-500">{error || "We couldn't locate this customer profile."}</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Safety grade conversion: 100 - risk_score. (E.g. risk score 15 => safety score 85)
  const safetyScore = Math.max(0, 100 - detail.risk_score);
  const safetyGrade = safetyScore >= 90 ? "A" : safetyScore >= 75 ? "B" : safetyScore >= 60 ? "C" : "D";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors shrink-0"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Profile</h1>
            <p className="text-slate-500 mt-1 font-mono text-sm">Customer ID: {detail.id.split('-')[0].toUpperCase()}</p>
          </div>
        </div>
        <button
          onClick={() => alert(`Contacting ${detail.full_name} via placeholder message gateway...`)}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm text-sm"
        >
          Contact Customer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: General Profile Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-slate-150">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                {detail.profile_picture ? (
                  <img src={detail.profile_picture} alt={detail.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-blue-600 bg-blue-50 text-2xl uppercase">
                    {detail.full_name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl">{detail.full_name}</h3>
                <p className="text-xs text-slate-400">Created: {detail.created_at ? new Date(detail.created_at).toLocaleDateString() : "—"}</p>
              </div>

              {detail.is_verified ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 size={12} /> Verified Member
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-red-500 font-semibold text-xs bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                  <XCircle size={12} /> Unverified Account
                </span>
              )}
            </div>

            {/* Personal Details */}
            <div className="space-y-4 text-sm">
              <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider text-slate-400">Personal Information</h4>
              <div className="flex items-center gap-3 text-slate-700">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">{detail.email}</span>
              </div>
              {detail.phone && (
                <div className="flex items-center gap-3 text-slate-700">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  <span>{detail.phone}</span>
                </div>
              )}
              {detail.cnic && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-slate-500">CNIC / ID</span>
                  <span className="font-medium text-slate-800">{detail.cnic}</span>
                </div>
              )}
              {detail.driving_license && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-slate-500">Driving License</span>
                  <span className="font-medium text-slate-800">{detail.driving_license}</span>
                </div>
              )}
            </div>

            {/* Safety Score / Risk Assessment */}
            <div className="pt-6 border-t border-slate-150 space-y-3">
              <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider text-slate-400">Safety & Risk Assessment</h4>
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs text-slate-500">AI Safety Score</span>
                  <p className="text-2xl font-bold text-slate-900">{safetyScore.toFixed(0)} <span className="text-xs text-slate-400 font-medium">/ 100</span></p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border ${
                  safetyGrade === "A" 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                    : safetyGrade === "B" 
                      ? "bg-blue-50 border-blue-100 text-blue-600"
                      : "bg-amber-50 border-amber-100 text-amber-600"
                }`}>
                  {safetyGrade}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Tabbed bookings, safety logs, and spending */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <DollarSign size={20} className="text-blue-500 mb-2" />
              <span className="block text-slate-500 text-xs font-semibold mb-0.5">Total Spending</span>
              <span className="text-lg font-bold text-slate-900">Rs {detail.total_spending.toLocaleString()}</span>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <Car size={20} className="text-emerald-500 mb-2" />
              <span className="block text-slate-500 text-xs font-semibold mb-0.5">Favorite Vehicle</span>
              <span className="text-sm font-bold text-slate-900 truncate block mt-0.5">{detail.favorite_car || "None"}</span>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <ShieldAlert size={20} className="text-amber-500 mb-2" />
              <span className="block text-slate-500 text-xs font-semibold mb-0.5">Safety Incidents</span>
              <span className="text-lg font-bold text-slate-900">{detail.safety_events.length}</span>
            </div>
          </div>

          {/* Details Tabs card */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[520px]">
            {/* Tabs Selector */}
            <div className="flex border-b border-slate-100 bg-slate-50 px-4">
              <button 
                onClick={() => setActiveTab("bookings")}
                className={`py-4 px-4 font-bold text-sm border-b-2 transition-all ${activeTab === "bookings" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              >
                Booking History ({detail.total_bookings})
              </button>
              <button 
                onClick={() => setActiveTab("safety")}
                className={`py-4 px-4 font-bold text-sm border-b-2 transition-all ${activeTab === "safety" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              >
                AI Safety Alerts ({detail.safety_events.length})
              </button>
              <button 
                onClick={() => setActiveTab("damage")}
                className={`py-4 px-4 font-bold text-sm border-b-2 transition-all ${activeTab === "damage" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              >
                Damage Reports ({detail.total_damage_reports})
              </button>
            </div>

            {/* Tab content area */}
            <div className="flex-1 p-6 overflow-y-auto">
              
              {/* BOOKINGS TAB */}
              {activeTab === "bookings" && (
                <div className="space-y-4">
                  {detail.bookings.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <Calendar size={32} className="mx-auto text-slate-350" />
                      <p className="text-sm font-medium">No bookings logged for this customer.</p>
                    </div>
                  ) : (
                    detail.bookings.map(b => (
                      <div key={b.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center hover:border-slate-350 transition-colors">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-950">{b.car_brand} {b.car_model}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-bold text-slate-900">Rs {b.total_price.toLocaleString()}</p>
                          <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            b.status === "ACTIVE" 
                              ? "bg-emerald-50 text-emerald-600" 
                              : b.status === "COMPLETED"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-zinc-100 text-zinc-500"
                          }`}>{b.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* SAFETY ALERTS TAB */}
              {activeTab === "safety" && (
                <div className="space-y-4">
                  {detail.safety_events.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <Sparkles size={32} className="mx-auto text-slate-350" />
                      <p className="text-sm font-medium">Customer has a perfect safety log with zero events.</p>
                    </div>
                  ) : (
                    detail.safety_events.map(e => (
                      <div key={e.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center">
                          <h5 className="font-bold text-slate-950 flex items-center gap-2">
                            <AlertTriangle size={14} className="text-amber-500" />
                            {e.title}
                          </h5>
                          <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            e.severity === "HIGH" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
                          }`}>{e.severity} Severity</span>
                        </div>
                        <p className="text-xs text-slate-600">{e.description}</p>
                        <span className="text-[10px] text-slate-400 block font-mono">{new Date(e.created_at).toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* DAMAGE TAB */}
              {activeTab === "damage" && (
                <div className="space-y-4 text-center py-12">
                  {detail.total_damage_reports === 0 ? (
                    <div className="text-slate-400 space-y-2">
                      <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
                      <p className="text-sm font-medium">No vehicle damage history recorded.</p>
                    </div>
                  ) : (
                    <div className="text-slate-500 space-y-2">
                      <AlertTriangle size={32} className="mx-auto text-red-500" />
                      <p className="text-sm font-bold text-slate-900">{detail.total_damage_reports} damage logs detected.</p>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">Please cross-reference these issues with specific completed booking receipts.</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
