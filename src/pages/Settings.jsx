import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Save, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { ALL_TN_DISTRICTS } from '../data/mockData';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Dharshini Raj',
    email: 'dharshini@ngo-tn.org',
    phone: '+91 94440 88776',
    district: 'Chennai',
    role: 'Volunteer Lead'
  });

  const [toggles, setToggles] = useState({
    emailAlerts: true,
    smsBloodAlerts: true,
    weeklyDigest: false,
    volunteerMatches: true
  });

  const handleToggle = (key) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Account Preferences & Preferences Control</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your volunteer profile, contact details, district headquarters, and notification alerts.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-bold">Settings Saved Successfully!</p>
            <p className="text-[11px] text-emerald-700 font-medium">Your updated preferences are now active across Tamil Nadu NGO Connect.</p>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Profile Information Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-blue-600" />
            Profile & Contact Information
          </h2>

          <div className="flex items-center gap-4 py-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-md ring-4 ring-blue-50">
              D
            </div>
            <div>
              <button type="button" className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition">
                Change Profile Avatar
              </button>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold">JPG or PNG • Max 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="text-slate-700 block mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Home District</label>
              <select
                value={profile.district}
                onChange={(e) => setProfile({...profile, district: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-white cursor-pointer"
              >
                {ALL_TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Notification Toggles Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-blue-600" />
            Notification & Alert Preferences
          </h2>

          <div className="space-y-3 divide-y divide-slate-100">
            
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Email Camp Announcements</p>
                <p className="text-[11px] text-slate-500 font-medium">Receive weekly updates on upcoming medical and blood drives</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('emailAlerts')}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${toggles.emailAlerts ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'}`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">SMS Blood Emergency Alerts</p>
                <p className="text-[11px] text-slate-500 font-medium">Instant SMS for urgent blood requirements in your district</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('smsBloodAlerts')}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${toggles.smsBloodAlerts ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'}`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Volunteer Opportunity Matches</p>
                <p className="text-[11px] text-slate-500 font-medium">Auto-notify when a non-profit posts a volunteer role matching your skills</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('volunteerMatches')}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${toggles.volunteerMatches ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'}`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>

      </form>
    </div>
  );
}
