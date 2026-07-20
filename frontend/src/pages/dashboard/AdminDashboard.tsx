import { motion } from "framer-motion";
import { Users, Building2, CarFront, Activity, ShieldAlert, BadgeCheck, Clock, Download } from "lucide-react";
import PageHeader from "../../components/dashboard/ui/PageHeader";
import StatCard from "../../components/dashboard/ui/StatCard";
import DashboardCard from "../../components/dashboard/ui/DashboardCard";
import Badge from "../../components/dashboard/ui/Badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function AdminDashboard() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader 
        title="Platform Oversight" 
        subtitle="Global statistics and system health for SmartRent AI."
        action={
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export Report
          </button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Users" value={12450} icon={<Users size={20} />} trend={4} color="blue" />
        <StatCard title="Active Showrooms" value={142} icon={<Building2 size={20} />} trend={2} color="purple" />
        <StatCard title="Vehicles on Platform" value={3400} icon={<CarFront size={20} />} trend={8} color="orange" />
        <StatCard title="System Health" value={99.9} suffix="%" icon={<Activity size={20} />} color="green" trendLabel="uptime" trend={0.1} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Pending Showroom Verifications" noPadding>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Company Name</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Submitted</th>
                    <th className="px-6 py-4">Risk Score</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">Elite Motors {i}</div>
                        <div className="text-xs text-slate-500">Contact: +92 300 000000{i}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">Lahore, PK</td>
                      <td className="px-6 py-4 text-slate-600">2 hrs ago</td>
                      <td className="px-6 py-4">
                        <Badge variant={i === 1 ? "green" : i === 2 ? "yellow" : "red"}>
                          {i === 1 ? "Low Risk (12)" : i === 2 ? "Medium (45)" : "High Risk (89)"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md font-medium hover:bg-blue-100 transition-colors">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>

          <div className="grid sm:grid-cols-2 gap-6">
            <DashboardCard title="AI Driver Monitoring">
              <div className="flex items-center justify-center p-8">
                {/* Placeholder for chart */}
                <div className="relative w-48 h-48 rounded-full border-8 border-slate-100 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent border-r-transparent rotate-45" />
                  <div className="text-center">
                    <span className="text-3xl font-bold text-slate-900">24K</span>
                    <p className="text-xs text-slate-500">Scans Today</p>
                  </div>
                </div>
              </div>
            </DashboardCard>
            <DashboardCard title="Platform Revenue">
               <div className="flex items-center justify-center h-full text-slate-400">
                 [Revenue Chart Placeholder]
               </div>
            </DashboardCard>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <DashboardCard title="Latest Activity">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <BadgeCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">New user identity verified</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock size={12}/> 2 mins ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Building2 size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Showroom 'AutoHub' approved</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock size={12}/> 15 mins ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Fraud attempt blocked</p>
                  <p className="text-xs text-slate-500 mt-1">AI flagged mismatched ID.</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock size={12}/> 1 hour ago</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-slate-50 text-sm text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
              View Activity Log
            </button>
          </DashboardCard>
        </div>
      </div>
    </motion.div>
  );
}
