import { useState, useEffect } from "react";
import { 
  Building, 
  ShieldCheck, 
  Settings as SettingsIcon, 
  Bell, 
  KeyRound, 
  Users, 
  Sliders, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Eye, 
  Plus, 
  Trash2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { 
  updateProfile, 
  uploadProfilePicture, 
  changePassword, 
  getActiveSessions, 
  logoutAllDevices,
  type ActiveSession
} from "../../services/auth";
import { getImageUrl } from "../../utils/image";

type TabType = "profile" | "verification" | "fleet" | "notifications" | "security" | "staff" | "preferences";

export default function ShowroomSettings() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // States
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);

  // 1. Business Profile Form
  const [profileForm, setProfileForm] = useState({
    business_name: "",
    phone: "",
    address: "",
    description: "",
    city: "",
    website: "",
    working_hours: "09:00 AM - 06:00 PM"
  });

  const [coverImage, setCoverImage] = useState<string | null>(null);

  // 2. Fleet Preferences
  const [fleetPrefs, setFleetPrefs] = useState({
    defaultDuration: 3,
    availabilityDefault: true,
    autoApproval: false,
    maintenanceInterval: 5000
  });

  // 3. Notification Preferences
  const [notifications, setNotifications] = useState({
    newBookings: true,
    cancellations: true,
    driverAlerts: true,
    damageAlerts: true,
    trackingAlerts: false,
    email: true,
    sms: false,
    push: true
  });

  // 4. Security Form
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  
  const [tfaEnabled, setTfaEnabled] = useState(false);

  // 5. System Preferences
  const [systemPrefs, setSystemPrefs] = useState({
    darkMode: false,
    language: "en",
    timezone: "UTC+5"
  });

  // Load Data
  useEffect(() => {
    if (user) {
      setProfileForm({
        business_name: user.full_name || "",
        phone: user.phone || "",
        address: user.address || "",
        description: localStorage.getItem("showroom_desc") || "Verified premium vehicle showroom owner.",
        city: localStorage.getItem("showroom_city") || "Islamabad",
        website: localStorage.getItem("showroom_website") || "www.smartrentai.com",
        working_hours: localStorage.getItem("showroom_hours") || "09:00 AM - 06:00 PM"
      });
      setCoverImage(localStorage.getItem("showroom_cover"));
    }

    // Load active sessions
    getActiveSessions().then(setSessions).catch(console.error);

    // Fleet Preferences
    const savedFleet = localStorage.getItem("showroom_fleet_prefs");
    if (savedFleet) {
      try { setFleetPrefs(JSON.parse(savedFleet)); } catch (e) {}
    }

    // Notifications
    const savedNotifs = localStorage.getItem("showroom_notif_prefs");
    if (savedNotifs) {
      try { setNotifications(JSON.parse(savedNotifs)); } catch (e) {}
    }

    // System preferences
    const savedSys = localStorage.getItem("showroom_sys_prefs");
    if (savedSys) {
      try { setSystemPrefs(JSON.parse(savedSys)); } catch (e) {}
    }
  }, [user]);

  // Toast Auto-Dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  // Profile submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.business_name.trim()) {
      showToast("Business Name is required", "error");
      return;
    }
    setLoading(true);
    try {
      const updatedUser = await updateProfile({
        full_name: profileForm.business_name,
        phone: profileForm.phone,
        address: profileForm.address
      });
      setUser(updatedUser);
      
      localStorage.setItem("showroom_desc", profileForm.description);
      localStorage.setItem("showroom_city", profileForm.city);
      localStorage.setItem("showroom_website", profileForm.website);
      localStorage.setItem("showroom_hours", profileForm.working_hours);
      
      showToast("Business profile updated successfully", "success");
    } catch (err: any) {
      showToast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const updatedUser = await uploadProfilePicture(file);
      setUser(updatedUser);
      showToast("Business Logo updated", "success");
    } catch (err) {
      showToast("Failed to upload logo", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setCoverImage(base64);
      localStorage.setItem("showroom_cover", base64);
      showToast("Cover image updated", "success");
    };
    reader.readAsDataURL(file);
  };

  // Fleet submit
  const handleFleetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("showroom_fleet_prefs", JSON.stringify(fleetPrefs));
    showToast("Fleet preferences saved successfully", "success");
  };

  // Notification toggles
  const handleNotifToggle = (key: keyof typeof notifications) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    localStorage.setItem("showroom_notif_prefs", JSON.stringify(next));
    showToast("Notification preferences updated", "success");
  };

  // Password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showToast("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    try {
      await changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
      showToast("Password updated successfully", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllDevices();
      showToast("Logged out of all other sessions", "success");
      setSessions(prev => prev.filter(s => s.is_current));
    } catch (err) {
      showToast("Failed to logout all devices", "error");
    }
  };

  // Preferences save
  const handleSysPrefChange = (key: keyof typeof systemPrefs, value: any) => {
    const next = { ...systemPrefs, [key]: value };
    setSystemPrefs(next);
    localStorage.setItem("showroom_sys_prefs", JSON.stringify(next));
    showToast("System preferences updated", "success");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Showroom Settings</h1>
        <p className="text-slate-500 mt-1">Configure business metadata, verification files, fleet permissions, security rules, and staff management.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-3xl p-3 flex flex-col gap-1 shadow-sm">
            <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<Building size={16} />} label="Business Profile" />
            <TabButton active={activeTab === "verification"} onClick={() => setActiveTab("verification")} icon={<ShieldCheck size={16} />} label="Verification" />
            <TabButton active={activeTab === "fleet"} onClick={() => setActiveTab("fleet")} icon={<SettingsIcon size={16} />} label="Fleet Preferences" />
            <TabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} icon={<Bell size={16} />} label="Notifications" />
            <TabButton active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={<KeyRound size={16} />} label="Security" />
            <TabButton active={activeTab === "staff"} onClick={() => setActiveTab("staff")} icon={<Users size={16} />} label="Staff (Beta)" />
            <TabButton active={activeTab === "preferences"} onClick={() => setActiveTab("preferences")} icon={<Sliders size={16} />} label="Preferences" />
          </div>
        </div>

        {/* Settings Form Wrapper */}
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          
          {/* 1. BUSINESS PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Business Profile</h2>
                <p className="text-slate-500 text-sm mt-0.5">Customize your public showroom identity displayed to users.</p>
              </div>

              {/* Cover Image Uploader */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group flex items-center justify-center">
                {coverImage ? (
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-400 text-xs text-center space-y-1">
                    <Upload className="mx-auto" size={24} />
                    <span>Upload Cover Image</span>
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-opacity">
                  Change Cover Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                </label>
              </div>

              {/* Logo / Profile picture */}
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <div className="relative group w-20 h-20 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <img 
                    src={getImageUrl(user?.profile_picture)} 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80&w=150";
                    }}
                  />
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer transition-opacity">
                    <Upload size={14} className="mb-0.5" />
                    Change
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 text-base">{user?.full_name}</h4>
                  <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">Business Name</label>
                    <input 
                      type="text" 
                      value={profileForm.business_name}
                      onChange={(e) => setProfileForm({ ...profileForm, business_name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">Business Email (Read-only)</label>
                    <input 
                      type="email" 
                      value={user?.email || ""}
                      readOnly
                      disabled
                      className="w-full bg-slate-50/50 border border-slate-200/50 rounded-xl px-4 py-2.5 text-slate-400 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">Contact Phone</label>
                    <input 
                      type="text" 
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">Website URL</label>
                    <input 
                      type="text" 
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">City</label>
                    <input 
                      type="text" 
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">Working Hours</label>
                    <input 
                      type="text" 
                      value={profileForm.working_hours}
                      onChange={(e) => setProfileForm({ ...profileForm, working_hours: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block font-semibold text-slate-700">Showroom Address</label>
                    <input 
                      type="text" 
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block font-semibold text-slate-700">About Showroom / Description</label>
                    <textarea 
                      value={profileForm.description}
                      onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 text-sm"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Save Business Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. BUSINESS VERIFICATION TAB */}
          {activeTab === "verification" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Business Verification</h2>
                <p className="text-slate-500 text-sm mt-0.5">View your commercial registration files and approval logs.</p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verification Status</span>
                  <p className="font-bold text-slate-900 text-base">Commercial Partnership</p>
                </div>
                {user?.is_verified ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
                    <CheckCircle2 size={14} /> Approved & Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-amber-600 font-bold text-xs bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-100">
                    <AlertTriangle size={14} /> Verification Pending
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Submitted Legal Records</h3>
                <div className="space-y-3">
                  <VerificationFile label="SEC Commercial Incorporation Certificate" status="Approved" date="2026-06-25" />
                  <VerificationFile label="Municipal Trade Business License" status="Approved" date="2026-06-25" />
                  <VerificationFile label="Owner CNIC / Passport Identification copy" status="Approved" date="2026-06-24" />
                </div>
              </div>
            </div>
          )}

          {/* 3. FLEET PREFERENCES TAB */}
          {activeTab === "fleet" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Fleet Preferences</h2>
                <p className="text-slate-500 text-sm mt-0.5">Control default booking permissions, approvals, and reminders.</p>
              </div>

              <form onSubmit={handleFleetSubmit} className="space-y-6 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">Default Booking Duration (Days)</label>
                    <input 
                      type="number" 
                      value={fleetPrefs.defaultDuration}
                      onChange={(e) => setFleetPrefs({ ...fleetPrefs, defaultDuration: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">Maintenance Reminder Interval (km)</label>
                    <input 
                      type="number" 
                      value={fleetPrefs.maintenanceInterval}
                      onChange={(e) => setFleetPrefs({ ...fleetPrefs, maintenanceInterval: parseInt(e.target.value) || 1000 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">Default Availability Status</label>
                    <select
                      value={fleetPrefs.availabilityDefault ? "true" : "false"}
                      onChange={(e) => setFleetPrefs({ ...fleetPrefs, availabilityDefault: e.target.value === "true" })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="true">Make Cars Available by default</option>
                      <option value="false">Require manual availability activation</option>
                    </select>
                  </div>

                  <div className="space-y-2 flex flex-col justify-end pb-1.5">
                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div>
                        <span className="font-bold text-slate-800 text-xs block">Automatic Booking Approval</span>
                        <span className="text-[10px] text-slate-400">Instantly approve incoming bookings without manual verification.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={fleetPrefs.autoApproval} 
                          onChange={(e) => setFleetPrefs({ ...fleetPrefs, autoApproval: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors text-sm"
                  >
                    Save Fleet Preferences
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Notification Settings</h2>
                <p className="text-slate-500 text-sm mt-0.5">Control alert parameters across booking schedules and tracking channels.</p>
              </div>

              <div className="space-y-4">
                <NotificationRow checked={notifications.newBookings} onChange={() => handleNotifToggle("newBookings")} title="New Booking Requests" description="Alert when a client places a booking pending review." />
                <NotificationRow checked={notifications.cancellations} onChange={() => handleNotifToggle("cancellations")} title="Booking Cancellations" description="Alert when a booking request is cancelled or changed by clients." />
                <NotificationRow checked={notifications.driverAlerts} onChange={() => handleNotifToggle("driverAlerts")} title="AI Driver Alerts" description="Alert when driver alertness falls below safe levels." />
                <NotificationRow checked={notifications.damageAlerts} onChange={() => handleNotifToggle("damageAlerts")} title="AI Damage Alerts" description="Alert when new vehicle damages are detected post-rental." />
                <NotificationRow checked={notifications.trackingAlerts} onChange={() => handleNotifToggle("trackingAlerts")} title="Vehicle Tracking Alerts" description="Alert when GPS connections drop or speed limits are violated." />
                <NotificationRow checked={notifications.email} onChange={() => handleNotifToggle("email")} title="Email Logs" description="Deliver monthly invoices and receipts to your mailbox." />
                <NotificationRow checked={notifications.sms} onChange={() => handleNotifToggle("sms")} title="SMS Alerts" description="Deliver emergency driver notifications directly to your phone." />
                <NotificationRow checked={notifications.push} onChange={() => handleNotifToggle("push")} title="Browser Push Notifications" description="Allow dashboard alerts while the portal is running in the background." />
              </div>
            </div>
          )}

          {/* 5. SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Security & Credentials</h2>
                <p className="text-slate-500 text-sm mt-0.5">Update credentials and monitor active logged-in devices.</p>
              </div>

              {/* Password edit */}
              <form onSubmit={handlePasswordSubmit} className="space-y-6 text-sm">
                <h3 className="font-bold text-slate-900 text-sm">Update Showroom Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">Current Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">New Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 text-sm"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Update Credentials
                  </button>
                </div>
              </form>

              {/* 2-Factor placeholder */}
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-slate-500">Require an authenticator code alongside your login email.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={tfaEnabled}
                    onChange={(e) => {
                      setTfaEnabled(e.target.checked);
                      showToast(`2FA set to ${e.target.checked ? "enabled" : "disabled"}.`, "success");
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Sessions */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-sm">Active Sessions</h3>
                  <button 
                    onClick={handleLogoutAll}
                    className="text-xs font-semibold text-red-500 hover:text-red-600"
                  >
                    Force Logout Other Sessions
                  </button>
                </div>
                <div className="space-y-2">
                  {sessions.map(s => (
                    <div key={s.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          {s.device}
                          {s.is_current && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase">Current</span>}
                        </p>
                        <p className="text-[10px] text-slate-400">{s.ip} &bull; {s.location}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Online</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. STAFF TAB */}
          {activeTab === "staff" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Staff Management (Beta)</h2>
                <p className="text-slate-500 text-sm mt-0.5">Allocate managers and staff to review vehicle listings and process approvals.</p>
              </div>

              <div className="space-y-4">
                <StaffRow name={user?.full_name || "Owner"} email={user?.email || ""} role="Owner" />
                <StaffRow name="Ali Khan" email="ali.khan@showroom.com" role="Manager" />
                <StaffRow name="Sana Ahmed" email="sana.ahmed@showroom.com" role="Staff" />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => showToast("Staff invitations are limited to enterprise accounts.", "error")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl font-medium text-xs hover:bg-slate-800 transition-colors"
                >
                  <Plus size={14} /> Invite Staff Member
                </button>
              </div>
            </div>
          )}

          {/* 7. PREFERENCES TAB */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Portal Settings</h2>
                <p className="text-slate-500 text-sm mt-0.5">Adjust display timezone, language, and styling parameters.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700">Display Language</label>
                  <select 
                    value={systemPrefs.language}
                    onChange={(e) => handleSysPrefChange("language", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="en">English (US)</option>
                    <option value="ur">Urdu (اردو)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700">System Timezone</label>
                  <select 
                    value={systemPrefs.timezone}
                    onChange={(e) => handleSysPrefChange("timezone", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="UTC+5">PKT (UTC+5)</option>
                    <option value="UTC">Greenwich Mean (UTC)</option>
                  </select>
                </div>

                <div className="space-y-2 flex flex-col justify-end">
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-bold text-slate-800 text-xs">Dark Interface</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={systemPrefs.darkMode} 
                        onChange={(e) => handleSysPrefChange("darkMode", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl font-medium text-sm border flex items-center gap-2 animate-in fade-in slide-in-from-top-4 ${
          toast.type === "success" 
            ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
            : "bg-red-50 border-red-100 text-red-500"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}

// Tab button helper
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left font-bold text-sm transition-all ${
        active 
          ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

// Verification document file row helper
function VerificationFile({ label, status, date }: { label: string; status: string; date: string }) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="space-y-0.5">
        <p className="font-semibold text-slate-800 text-xs">{label}</p>
        <span className="text-[10px] text-slate-400 block font-mono">Uploaded: {date}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase">{status}</span>
        <button 
          onClick={() => alert("Viewing verification document...")}
          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-200/50 rounded-lg transition-colors"
        >
          <Eye size={14} />
        </button>
      </div>
    </div>
  );
}

// Notification toggle row helper
interface NotificationRowProps {
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
}

function NotificationRow({ checked, onChange, title, description }: NotificationRowProps) {
  return (
    <div className="flex items-start justify-between gap-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="space-y-0.5">
        <span className="font-bold text-slate-800 text-xs block">{title}</span>
        <span className="text-[10px] text-slate-400 block">{description}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer mt-0.5 shrink-0">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}

// Staff management row helper
function StaffRow({ name, email, role }: { name: string; email: string; role: "Owner" | "Manager" | "Staff" }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-600 text-xs">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-slate-900 text-xs">{name}</p>
          <p className="text-[10px] text-slate-400 font-mono">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
          role === "Owner" 
            ? "bg-blue-50 text-blue-600" 
            : role === "Manager" 
              ? "bg-purple-50 text-purple-600" 
              : "bg-slate-100 text-slate-500"
        }`}>{role}</span>
        {role !== "Owner" && (
          <button 
            onClick={() => alert("Deleting staff placeholders requires enterprise tier activation.")}
            className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
