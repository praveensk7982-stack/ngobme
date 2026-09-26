import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, User, Bell, Save, CheckCircle2, SlidersHorizontal, Globe } from 'lucide-react';
import { ALL_TN_DISTRICTS } from '../data/mockData';
import { supabase } from '../lib/supabaseClient';

export default function Settings() {
  const { t, i18n } = useTranslation();
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

  const [defaultSiteLanguage, setDefaultSiteLanguage] = useState('en');

  // Load default site language setting from Supabase
  useEffect(() => {
    async function loadSiteSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'default_language')
          .maybeSingle();

        if (!error && data && data.value) {
          setDefaultSiteLanguage(data.value);
        }
      } catch (err) {
        console.error('Failed to load default language from Supabase:', err);
      }
    }
    loadSiteSettings();
  }, []);

  const handleToggle = (key) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Save default site language to Supabase
    try {
      await supabase.from('site_settings').upsert({
        key: 'default_language',
        value: defaultSiteLanguage,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error updating site_settings in Supabase:', err);
    }

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
            <span>Account Preferences & System Controls</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('nav.settings')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your volunteer profile, contact details, district headquarters, default site language, and notification alerts.
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
        
        {/* Default Site Language Control Card (Admin / System Settings) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-5 h-5 text-teal-600" />
            Default Site Language (Admin Control)
          </h2>

          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Choose the default language presented to new, first-time visitors before browser auto-detection. Individual users can still select their preferred language anytime via the header language switcher.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <div className="w-full sm:w-64">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Default First-Time Visitor Language:
              </label>
              <select
                value={defaultSiteLanguage}
                onChange={(e) => setDefaultSiteLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:outline-none bg-slate-50 font-bold text-xs text-slate-800 cursor-pointer"
              >
                <option value="en">English (Default)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>

            <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold">
              <span>Saved in Supabase <code className="bg-teal-100 px-1 py-0.5 rounded font-mono">site_settings</code> table.</span>
            </div>
          </div>
        </div>

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
