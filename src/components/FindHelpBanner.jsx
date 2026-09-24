import React, { useState } from 'react';
import { Search, MapPin, Stethoscope, PhoneCall, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ALL_TN_DISTRICTS, SERVICE_TYPES } from '../data/mockData';

export default function FindHelpBanner({ onSearchHelp }) {
  const [district, setDistrict] = useState('Chennai');
  const [service, setService] = useState('Free Medical Camps');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSearchHelp) {
      onSearchHelp({ district, service });
    }
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-800/40">
      
      {/* Background Subtle Gopuram Overlay */}
      <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none hidden md:block w-72">
        <svg className="w-full h-full fill-current text-white" viewBox="0 0 100 100">
          <polygon points="50,10 40,30 60,30" />
          <polygon points="35,32 25,60 75,60 65,32" />
          <rect x="15" y="62" width="70" height="35" rx="3" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Left Title & Overview */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30 text-xs font-bold mb-3">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>24/7 Citizen Emergency & Aid Lookup</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Find Help & Social Services Near You
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Instantly locate nearby emergency medical care, free food distribution centers, blood banks, shelter homes, and disaster relief services across Tamil Nadu.
            </p>
          </div>

          {/* Form Container */}
          <form 
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-2xl border border-white/20 text-slate-900 flex-1 max-w-lg space-y-3"
          >
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              Locate Local Services
            </h3>

            {/* District Dropdown */}
            <div className="relative">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Select District</label>
              <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-blue-500">
                <MapPin className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {ALL_TN_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Type Dropdown */}
            <div className="relative">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Required Service Type</label>
              <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-blue-500">
                <Stethoscope className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {SERVICE_TYPES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Search Available Help</span>
            </button>

            {submitted && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Found 14 active services in {district} for {service}!</span>
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}
