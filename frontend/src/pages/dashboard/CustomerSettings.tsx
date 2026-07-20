import { useState, useEffect } from "react";
import { 
  User as UserIcon, 
  KeyRound, 
  Bell, 
  Sliders, 
  EyeOff, 
  CreditCard, 
  Trash2, 
  Plus, 
  Loader2, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  Upload,
  Moon,
  Sun,
  Globe,
  DollarSign,
  Compass
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { 
  updateProfile, 
  uploadProfilePicture, 
  changePassword, 
  getActiveSessions, 
  logoutAllDevices, 
  deleteAccount,
  type ActiveSession
} from "../../services/auth";
import { getImageUrl } from "../../utils/image";

type TabType = "profile" | "security" | "notifications" | "preferences" | "privacy" | "payment";

export default function CustomerSettings() {
  const { user, setUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // States
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    cnic: "",
    driving_license: ""
  });
  
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    aiAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  // Client preferences
  const [preferences, setPreferences] = useState({
    darkMode: true,
    language: "en",
    currency: "PKR",
    distanceUnits: "km"
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load Initial Data
  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || "",
        phone: user.phone || "",
        address: user.address || "",
        cnic: user.cnic || "",
        driving_license: user.driving_license || ""
      });
    }

    // Load active sessions
    getActiveSessions().then(setSessions).catch(console.error);

    // Load preferences from localStorage
    const savedPrefs = localStorage.getItem("user_preferences");
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        console.error(e);
      }
    }

    // Load notifications from localStorage
    const savedNotifs = localStorage.getItem("user_notifications");
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs));
      } catch (e) {
        console.error(e);
      }
    }
  }, [user]);

  // Toast Handler
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  // 1. Profile Handlers
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.full_name.trim()) {
      showToast("Full name is required", "error");
      return;
    }
    setLoading(true);
    try {
      const updatedUser = await updateProfile(profileForm);
      setUser(updatedUser);
      showToast("Profile updated successfully", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const updatedUser = await uploadProfilePicture(file);
      setUser(updatedUser);
      showToast("Profile picture updated", "success");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to upload image", "error");
    } finally {
      setLoading(false);
    }
  };

  // 2. Security Handlers
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (passwordForm.new_password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
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
      showToast(err.response?.data?.detail || "Failed to change password", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllDevices();
      showToast("Logged out of all other sessions", "success");
      // Keep only current session
      setSessions(prev => prev.filter(s => s.is_current));
    } catch (err) {
      showToast("Failed to logout all devices", "error");
    }
  };

  // 3. Notification Handlers
  const handleNotificationChange = (key: keyof typeof notifications) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    localStorage.setItem("user_notifications", JSON.stringify(next));
    showToast("Notification preferences saved", "success");
  };

  // 4. Preferences Handlers
  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    localStorage.setItem("user_preferences", JSON.stringify(next));
    
    // Toggle dark mode class on body for live preview
    if (key === "darkMode") {
      if (value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    showToast("Preferences updated", "success");
  };

  // 5. Privacy Handlers
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      logout();
    } catch (err) {
      showToast("Failed to delete account", "error");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account profile, preferences, security, and payments.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-3 flex flex-col gap-1">
            <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<UserIcon size={18} />} label="Profile" />
            <TabButton active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={<KeyRound size={18} />} label="Security" />
            <TabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} icon={<Bell size={18} />} label="Notifications" />
            <TabButton active={activeTab === "preferences"} onClick={() => setActiveTab("preferences")} icon={<Sliders size={18} />} label="Preferences" />
            <TabButton active={activeTab === "payment"} onClick={() => setActiveTab("payment")} icon={<CreditCard size={18} />} label="Payments" />
            <TabButton active={activeTab === "privacy"} onClick={() => setActiveTab("privacy")} icon={<EyeOff size={18} />} label="Privacy & Data" />
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white">Profile Information</h2>
                <p className="text-sm text-zinc-400 mt-1">Update your general details and account metadata.</p>
              </div>

              {/* Profile Pic Upload */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-zinc-800">
                <div className="relative group w-24 h-24 rounded-full overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                  <img 
                    src={getImageUrl(user?.profile_picture)} 
                    alt={user?.full_name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";
                    }}
                  />
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer transition-opacity">
                    <Upload size={16} className="mb-1" />
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleProfilePictureUpload} />
                  </label>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="font-bold text-white text-lg">{user?.full_name}</h4>
                  <p className="text-sm text-zinc-400 font-mono">{user?.email}</p>
                  <p className="text-xs text-zinc-500">Allowed formats: JPEG, PNG, WebP. Max 5MB.</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-300">Full Name</label>
                    <input 
                      type="text" 
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-300">Email Address (Read-only)</label>
                    <input 
                      type="email" 
                      value={user?.email || ""}
                      readOnly
                      disabled
                      className="w-full bg-zinc-950/50 border border-zinc-800/50 rounded-xl px-4 py-3 text-zinc-500 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-300">Phone Number</label>
                    <input 
                      type="text" 
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-300">CNIC / ID Number</label>
                    <input 
                      type="text" 
                      value={profileForm.cnic}
                      onChange={(e) => setProfileForm({ ...profileForm, cnic: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-300">Driving License Number</label>
                    <input 
                      type="text" 
                      value={profileForm.driving_license}
                      onChange={(e) => setProfileForm({ ...profileForm, driving_license: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-zinc-300">Physical Address</label>
                    <input 
                      type="text" 
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-zinc-950 rounded-xl font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Save Profile Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-10">
              <div>
                <h2 className="text-xl font-bold text-white">Security & Login</h2>
                <p className="text-sm text-zinc-400 mt-1">Manage password options, 2FA settings, and session status.</p>
              </div>

              {/* Password Change Form */}
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <h3 className="font-bold text-white text-base">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-300">Current Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-300">New Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-300">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-zinc-950 rounded-xl font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Update Password
                  </button>
                </div>
              </form>

              {/* 2-Factor Authentication Placeholder */}
              <div className="pt-6 border-t border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">Two-Factor Authentication (2FA)</h3>
                    <p className="text-sm text-zinc-400 mt-1">Add an extra layer of protection to your account settings.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={tfaEnabled} 
                      onChange={(e) => {
                        setTfaEnabled(e.target.checked);
                        showToast(`2FA placeholder set to ${e.target.checked ? "enabled" : "disabled"}.`, "success");
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="pt-6 border-t border-zinc-800 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-white text-base">Active Logged-in Sessions</h3>
                    <p className="text-sm text-zinc-400 mt-1">Devices currently authenticated to your account.</p>
                  </div>
                  <button
                    onClick={handleLogoutAll}
                    className="px-4 py-2 border border-zinc-800 hover:bg-zinc-950 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                  >
                    Log Out of All Other Devices
                  </button>
                </div>

                <div className="space-y-3">
                  {sessions.map(s => (
                    <div key={s.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          {s.device}
                          {s.is_current && <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Current Device</span>}
                        </p>
                        <p className="text-xs text-zinc-400">{s.ip} &middot; {s.location}</p>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">Active</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white">Notification Settings</h2>
                <p className="text-sm text-zinc-400 mt-1">Control how you receive updates and alerts.</p>
              </div>

              <div className="space-y-6">
                <NotificationToggle 
                  checked={notifications.bookingUpdates}
                  onChange={() => handleNotificationChange("bookingUpdates")}
                  title="Booking Updates"
                  description="Receive instant alerts regarding approval, status updates, or changes in booking schedules."
                />
                <NotificationToggle 
                  checked={notifications.aiAlerts}
                  onChange={() => handleNotificationChange("aiAlerts")}
                  title="AI Vehicle Alerts"
                  description="Receive notifications for vehicle AI alerts, speed violations, and driver safety concerns."
                />
                <NotificationToggle 
                  checked={notifications.emailNotifications}
                  onChange={() => handleNotificationChange("emailNotifications")}
                  title="Email Notifications"
                  description="Get invoices, booking receipts, and promotional marketing emails."
                />
                <NotificationToggle 
                  checked={notifications.smsNotifications}
                  onChange={() => handleNotificationChange("smsNotifications")}
                  title="SMS Notifications"
                  description="Get important updates pushed directly to your phone via SMS."
                />
                <NotificationToggle 
                  checked={notifications.pushNotifications}
                  onChange={() => handleNotificationChange("pushNotifications")}
                  title="Push Notifications"
                  description="Allow web push notifications in the browser for live trip updates."
                />
              </div>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === "preferences" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white">System Preferences</h2>
                <p className="text-sm text-zinc-400 mt-1">Customize the user experience and theme options.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      {preferences.darkMode ? <Moon size={16} className="text-blue-400" /> : <Sun size={16} className="text-yellow-400" />}
                      Interface Mode
                    </h4>
                    <p className="text-xs text-zinc-400">Toggle dark / light appearance.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={preferences.darkMode} 
                      onChange={(e) => handlePreferenceChange("darkMode", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Globe size={16} className="text-blue-400" />
                      Display Language
                    </h4>
                    <p className="text-xs text-zinc-400">Preferred UI language.</p>
                  </div>
                  <select 
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange("language", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="en">English (US)</option>
                    <option value="ur">Urdu (اردو)</option>
                    <option value="ar">Arabic (العربية)</option>
                  </select>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <DollarSign size={16} className="text-blue-400" />
                      Currency
                    </h4>
                    <p className="text-xs text-zinc-400">Rents and damage estimates currency.</p>
                  </div>
                  <select 
                    value={preferences.currency}
                    onChange={(e) => handlePreferenceChange("currency", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="PKR">PKR (Rs)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Compass size={16} className="text-blue-400" />
                      Distance Metrics
                    </h4>
                    <p className="text-xs text-zinc-400">Trip telemetry distance unit.</p>
                  </div>
                  <select 
                    value={preferences.distanceUnits}
                    onChange={(e) => handlePreferenceChange("distanceUnits", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="km">Kilometers (km)</option>
                    <option value="mi">Miles (mi)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY TAB */}
          {activeTab === "privacy" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white">Privacy & Account Ownership</h2>
                <p className="text-sm text-zinc-400 mt-1">Request personal data exports or manage profile removal.</p>
              </div>

              {/* Data Export Card */}
              <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
                <h4 className="font-bold text-white text-base">Request Data Export</h4>
                <p className="text-sm text-zinc-400">Download a complete backup report of your personal profile data, trip bookings, and telemetry history.</p>
                <button 
                  onClick={() => showToast("Your data backup request is queued. An email will follow.", "success")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white rounded-xl text-sm font-semibold border border-zinc-800 transition-colors"
                >
                  <Download size={16} /> Request Backup Archive
                </button>
              </div>

              {/* Delete Account Card */}
              <div className="p-6 bg-red-950/10 border border-red-900/30 rounded-2xl space-y-4">
                <h4 className="font-bold text-red-400 text-base">Deactivate Profile Account</h4>
                <p className="text-sm text-zinc-400">Permanently delete your profile data, verification details, and active listings. This operation is non-reversible.</p>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  <Trash2 size={16} /> Deactivate Account
                </button>
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === "payment" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white">Payment Management</h2>
                <p className="text-sm text-zinc-400 mt-1">Manage saved cards and view transaction history.</p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-base">Saved Cards</h3>
                  <button 
                    onClick={() => showToast("Adding payment methods is placeholder for beta.", "success")}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold text-xs"
                  >
                    <Plus size={14} /> Add Card
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">Visa &bull;&bull;&bull;&bull; 4242</p>
                      <p className="text-xs text-zinc-400">Expires 12/28</p>
                    </div>
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold px-2 py-0.5 rounded uppercase">Primary</span>
                  </div>
                  <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">Mastercard &bull;&bull;&bull;&bull; 8899</p>
                      <p className="text-xs text-zinc-400">Expires 08/26</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History Placeholder */}
              <div className="pt-6 border-t border-zinc-800 space-y-4">
                <h3 className="font-bold text-white text-base">Payment Logs</h3>
                <div className="overflow-x-auto rounded-xl border border-zinc-800">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-xs uppercase font-bold">
                        <th className="p-4">Tx ID</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-zinc-300">
                      <tr>
                        <td className="p-4 font-mono text-xs">TXN-48201</td>
                        <td className="p-4">2026-07-15</td>
                        <td className="p-4 font-bold">Rs 28,000</td>
                        <td className="p-4"><span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2.5 py-1 rounded-full">Paid</span></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-xs">TXN-90184</td>
                        <td className="p-4">2026-07-02</td>
                        <td className="p-4 font-bold">Rs 14,500</td>
                        <td className="p-4"><span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2.5 py-1 rounded-full">Paid</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-red-500">
              <ShieldCheck size={28} />
              <h3 className="text-xl font-bold text-white">Delete Profile Account</h3>
            </div>
            <p className="text-zinc-400 text-sm">Are you absolutely sure you want to deactivate your account? All history, profile credentials, and verification files will be lost forever.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 bg-zinc-800 text-zinc-300 rounded-xl font-medium hover:bg-zinc-700 transition-colors"
              >
                Keep Account
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-750 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl font-medium text-sm border flex items-center gap-2 animate-in fade-in slide-in-from-top-4 ${
          toast.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {toast.message}
        </div>
      )}

    </div>
  );
}

// Sidebar Tab Button Helper
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
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl w-full text-left font-bold text-sm transition-all ${
        active 
          ? "bg-white text-zinc-950 shadow-lg" 
          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950/50"
      }`}
    >
      <span className={active ? "text-zinc-950" : "text-zinc-500"}>{icon}</span>
      {label}
    </button>
  );
}

// Notification Toggle Row Helper
interface NotificationToggleProps {
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
}

function NotificationToggle({ checked, onChange, title, description }: NotificationToggleProps) {
  return (
    <div className="flex items-start justify-between gap-6 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
      <div className="space-y-1 flex-1">
        <h4 className="font-bold text-white text-sm">{title}</h4>
        <p className="text-xs text-zinc-400">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer mt-0.5">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-zinc-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}
