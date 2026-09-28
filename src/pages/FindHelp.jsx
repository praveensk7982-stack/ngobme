import React, { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { Search, MapPin, Stethoscope, PhoneCall, ShieldAlert, Clock, Navigation, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { ALL_TN_DISTRICTS, SERVICE_TYPES, HELP_CENTERS } from '../data/mockData';
import { matchDistrict } from '../utils/districtUtils';

export default function FindHelp() {
  const [searchParams, setSearchParams] = useSearchParams();
  const outletContext = useOutletContext() || {};
  const setParentDistrict = outletContext.setSelectedDistrict;

  // Read URL query parameters on load/refresh
  const initialDistrict = searchParams.get('district') || 'Chennai';
  const initialService = searchParams.get('type') || searchParams.get('service') || 'All Services';

  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedService, setSelectedService] = useState(initialService);
  const [showNearby, setShowNearby] = useState(false);

  // Sync state when URL params change (e.g., browser Back/Forward or direct link)
  useEffect(() => {
    const dParam = searchParams.get('district');
    const sParam = searchParams.get('type') || searchParams.get('service');

    if (dParam) {
      setSelectedDistrict(dParam);
      if (setParentDistrict) setParentDistrict(dParam);
    }
    if (sParam) {
      setSelectedService(sParam);
    }
  }, [searchParams, setParentDistrict]);

  // Handle Search Submission and update URL query params
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowNearby(false);

    const params = new URLSearchParams();
    if (selectedDistrict && selectedDistrict !== 'All Districts') {
      params.set('district', selectedDistrict);
    }
    if (selectedService && selectedService !== 'All Services') {
      params.set('type', selectedService);
    }
    setSearchParams(params);

    if (setParentDistrict) {
      setParentDistrict(selectedDistrict);
    }
  };

  // Strict filtering logic (Requirement 1 & 2)
  const normDist = (selectedDistrict || '').toLowerCase().trim();
  const normServ = (selectedService || '').toLowerCase().trim();

  const filteredResults = HELP_CENTERS.filter((center) => {
    // District Match
    const matchesDistrict = normDist === 'all districts' || matchDistrict(center.district, selectedDistrict);

    // Service Type Match
    const centerServNorm = (center.service || '').toLowerCase().trim();
    const matchesService = normServ === 'all services' || 
                           normServ === 'all service types' ||
                           centerServNorm === normServ ||
                           centerServNorm.includes(normServ) ||
                           normServ.includes(centerServNorm);

    return matchesDistrict && matchesService;
  });

  // Centers in other/nearby districts for optional section (Requirement 5)
  const nearbyCenters = HELP_CENTERS.filter((center) => {
    const isOtherDistrict = !matchDistrict(center.district, selectedDistrict);
    const centerServNorm = (center.service || '').toLowerCase().trim();
    const matchesService = normServ === 'all services' || 
                           normServ === 'all service types' ||
                           centerServNorm === normServ;
    return isOtherDistrict && matchesService;
  });

  // Heading Count Logic (Requirement 3)
  const count = filteredResults.length;
  const isAllDistricts = selectedDistrict === 'All Districts';
  const districtLabel = isAllDistricts ? 'across Tamil Nadu' : `in ${selectedDistrict}`;
  const centerPluralText = count === 1 ? 'active emergency help center' : 'active emergency help centers';

  // Action to reset service type filter
  const handleShowAllServicesInDistrict = () => {
    setSelectedService('All Services');
    const params = new URLSearchParams();
    if (selectedDistrict && selectedDistrict !== 'All Districts') {
      params.set('district', selectedDistrict);
    }
    setSearchParams(params);
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      
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
        <form onSubmit={handleSearchSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3 pt-6 border-t border-slate-100">
          
          {/* District Selector */}
          <div className="sm:col-span-5 relative">
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Select District</label>
            <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-blue-600 focus-within:bg-white transition">
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

          {/* Required Service Type Selector */}
          <div className="sm:col-span-5 relative">
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Required Service Type</label>
            <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-blue-600 focus-within:bg-white transition">
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

          {/* Submit Search Button */}
          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search Help</span>
            </button>
          </div>

        </form>
      </div>

      {/* Results Count Header */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-bold text-slate-600">
          Showing <span className="text-blue-600 font-extrabold">{count}</span> {centerPluralText} {districtLabel}
        </p>
      </div>

      {/* Main Filtered Cards List OR Empty State */}
      {count === 0 ? (
        <div className="space-y-6">
          {/* Strict Empty State Box (Requirement 4) */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 mx-auto flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                No help centers found in {selectedDistrict} {selectedService !== 'All Services' ? `for ${selectedService}` : ''} yet.
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You can expand your search to all emergency service types in {selectedDistrict} or call the state ambulance emergency hotline directly.
              </p>
            </div>

            {/* Required Empty State Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleShowAllServicesInDistrict}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Show all service types in {selectedDistrict}</span>
              </button>

              <a
                href="tel:108"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                <span>Call the 108 ambulance helpline</span>
              </a>
            </div>

            {/* Optional Nearby Districts Toggle Button (Requirement 5) */}
            {nearbyCenters.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowNearby(!showNearby)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition cursor-pointer"
                >
                  <span>{showNearby ? 'Hide nearby districts' : 'Show nearby districts'}</span>
                  {showNearby ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Optional Separated Nearby Districts Section (Requirement 5) */}
          {showNearby && nearbyCenters.length > 0 && (
            <div className="bg-slate-100/70 rounded-3xl p-6 border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Centers in nearby districts ({nearbyCenters.length})
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                  Separated Results
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyCenters.map((center) => (
                  <div
                    key={`nearby-${center.id}`}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 inline-block mb-1">
                          {center.service}
                        </span>
                        <h5 className="text-xs font-extrabold text-slate-900">{center.name}</h5>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                        {center.district}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium">
                      {center.address}
                    </p>

                    <a
                      href={`tel:${center.phone.split('/')[0]}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline pt-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{center.phone.split('/')[0]}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Render Strict Filtered Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredResults.map((center) => (
            <div
              key={center.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
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
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href={`tel:${center.phone.split('/')[0]}`}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Helpline ({center.phone.split('/')[0]})</span>
                </a>

                <button 
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(center.name + ' ' + center.address)}`, '_blank')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span>Directions</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
