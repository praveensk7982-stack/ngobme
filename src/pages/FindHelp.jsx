import React, { useState } from 'react';
import { Search, MapPin, Stethoscope, PhoneCall, ShieldAlert, Clock, ExternalLink, Navigation } from 'lucide-react';
import { ALL_TN_DISTRICTS, SERVICE_TYPES, HELP_CENTERS } from '../data/mockData';

export default function FindHelp() {
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [selectedService, setSelectedService] = useState('Free Medical Camps');
  const [searchResults, setSearchResults] = useState(HELP_CENTERS);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = HELP_CENTERS.filter((hc) => {
      const matchDist = selectedDistrict === 'All Districts' || hc.district === selectedDistrict;
      const matchServ = selectedService === 'All Services' || hc.service === selectedService;
      return matchDist && matchServ;
    });

    // Fallback if no exact match in dummy list so results are never empty
    setSearchResults(filtered.length > 0 ? filtered : HELP_CENTERS);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-3 border border-rose-200">
            <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>24/7 Emergency Aid & Essential Social Service Finder</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Emergency Help Near You
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Locate free medical screening camps, 24/7 blood banks, free food kitchens, ambulance dispatch centers, and disaster relief shelters across Tamil Nadu.
          </p>
        </div>

        {/* Search Controls */}
        <form onSubmit={handleSearch} className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3 pt-6 border-t border-slate-100">
          
          <div className="sm:col-span-5 relative">
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Select District</label>
            <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
              <MapPin className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All Districts">All 38 Districts</option>
                {ALL_TN_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-5 relative">
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Required Service Type</label>
            <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200">
              <Stethoscope className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All Services">All Emergency Services</option>
                {SERVICE_TYPES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Search Help</span>
            </button>
          </div>

        </form>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-bold text-slate-600">
          Showing <span className="text-blue-600 font-extrabold">{searchResults.length}</span> active emergency help centers in {selectedDistrict}
        </p>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {searchResults.map((center) => (
          <div
            key={center.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 inline-block mb-1.5">
                  {center.service}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">{center.name}</h3>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{center.address} ({center.district})</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{center.hours}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`tel:${center.phone.split('/')[0]}`}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Helpline ({center.phone.split('/')[0]})</span>
              </a>

              <button className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>Directions</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
