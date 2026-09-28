import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Search, Mic, MicOff, ShieldCheck, Sparkles, AlertCircle, Building2, Calendar, Users, ArrowRight } from 'lucide-react';
import { ALL_TN_DISTRICTS, FEATURED_NGOS, UPCOMING_EVENTS, VOLUNTEER_OPPORTUNITIES } from '../data/mockData';
import { getVolunteerOpenings } from '../lib/volunteerOpenings';
import { matchDistrict } from '../utils/districtUtils';
import { useVoiceSearch } from '../utils/useVoiceSearch';

export default function HeroBanner({ selectedDistrict: propDistrict, setSelectedDistrict: propSetDistrict }) {
  const { t } = useTranslation();
  const [district, setDistrict] = useState(propDistrict || 'All Districts');
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dynamicVolunteerOpenings, setDynamicVolunteerOpenings] = useState([]);

  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Load dynamic volunteer openings on mount
  useEffect(() => {
    let isMounted = true;
    getVolunteerOpenings().then(data => {
      if (isMounted && data && data.length > 0) {
        setDynamicVolunteerOpenings(data);
      }
    }).catch(err => {
      console.warn('HeroBanner volunteer fetch fallback:', err);
    });
    return () => { isMounted = false; };
  }, []);

  // Keep internal district state in sync with parent prop
  useEffect(() => {
    if (propDistrict) {
      setDistrict(propDistrict);
    }
  }, [propDistrict]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Filtered dropdown data based strictly on selected district and search text
  const normQ = searchText.toLowerCase().trim();

  const filteredNGOs = FEATURED_NGOS.filter((ngo) => {
    const matchesDist = matchDistrict(ngo.district, district);
    const matchesText = !normQ || 
      ngo.name.toLowerCase().includes(normQ) ||
      ngo.category.toLowerCase().includes(normQ) ||
      ngo.description.toLowerCase().includes(normQ);
    return matchesDist && matchesText;
  }).slice(0, 5);

  const filteredCamps = UPCOMING_EVENTS.filter((camp) => {
    const matchesDist = matchDistrict(camp.district, district);
    const matchesText = !normQ || 
      camp.title.toLowerCase().includes(normQ) ||
      camp.category.toLowerCase().includes(normQ) ||
      camp.org.toLowerCase().includes(normQ) ||
      camp.location.toLowerCase().includes(normQ);
    return matchesDist && matchesText;
  }).slice(0, 3);

  const rawVolunteers = dynamicVolunteerOpenings.length > 0
    ? dynamicVolunteerOpenings
    : VOLUNTEER_OPPORTUNITIES;

  const filteredVolunteers = rawVolunteers.filter((vol) => {
    const statusOk = vol.status ? vol.status === 'active' : true;
    const matchesDist = matchDistrict(vol.district, district);
    const volNgo = vol.ngo_name || vol.ngo || '';
    const volCat = vol.category_tag || vol.category || '';
    const matchesText = !normQ || 
      vol.title.toLowerCase().includes(normQ) ||
      volNgo.toLowerCase().includes(normQ) ||
      volCat.toLowerCase().includes(normQ);
    return statusOk && matchesDist && matchesText;
  }).slice(0, 3);

  // Flattened items list for keyboard up/down navigation
  const flattenedSuggestions = [
    ...filteredNGOs.map(item => ({ ...item, suggestionType: 'ngo', keyId: `ngo-${item.id}` })),
    ...filteredCamps.map(item => ({ ...item, suggestionType: 'camp', keyId: `camp-${item.id}` })),
    ...filteredVolunteers.map(item => ({ ...item, suggestionType: 'volunteer', keyId: `vol-${item.id}` }))
  ];

  const totalCount = flattenedSuggestions.length;
  const isDistrictSelected = district && district !== 'All Districts';
  const shouldShowDropdown = isOpen && (isDistrictSelected || normQ || isFocused);

  // Voice search hook
  const { isListening, speechError: voiceError, toggleVoiceSearch } = useVoiceSearch((transcript) => {
    setSearchText(transcript);
    setIsOpen(true);
    const searchParams = new URLSearchParams();
    if (district && district !== 'All Districts') {
      searchParams.set('district', district);
    }
    if (transcript.trim()) {
      searchParams.set('q', transcript.trim());
    }
    const queryStr = searchParams.toString();
    navigate(`/search${queryStr ? `?${queryStr}` : ''}`);
  });

  const handleVoiceSearch = () => {
    toggleVoiceSearch();
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setDistrict(val);
    setIsOpen(true);
    setHighlightedIndex(-1);
    if (propSetDistrict) {
      propSetDistrict(val);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleSelectSuggestion = (item) => {
    setIsOpen(false);
    setSearchText('');
    if (item.suggestionType === 'ngo') {
      navigate(`/ngo-directory?q=${encodeURIComponent(item.name)}`);
    } else if (item.suggestionType === 'camp') {
      navigate(`/camps-events?id=${item.id}`);
    } else if (item.suggestionType === 'volunteer') {
      navigate('/volunteer');
    }
  };

  const handleDistrictSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    
    if (propSetDistrict) {
      propSetDistrict(district);
    }

    const searchParams = new URLSearchParams();
    if (district && district !== 'All Districts') {
      searchParams.set('district', district);
    }
    if (searchText.trim()) {
      searchParams.set('q', searchText.trim());
    }

    const queryStr = searchParams.toString();
    navigate(`/search${queryStr ? `?${queryStr}` : ''}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      if (flattenedSuggestions.length > 0) {
        setHighlightedIndex(prev => (prev + 1) % flattenedSuggestions.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      if (flattenedSuggestions.length > 0) {
        setHighlightedIndex(prev => (prev - 1 + flattenedSuggestions.length) % flattenedSuggestions.length);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && flattenedSuggestions[highlightedIndex]) {
        e.preventDefault();
        handleSelectSuggestion(flattenedSuggestions[highlightedIndex]);
      } else {
        handleDistrictSearchSubmit(e);
      }
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0f1e3d] via-[#16284e] to-[#1e3461] text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-blue-900/40">
      
      {/* Background Graphic Patterns & Gopuram Motif */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

      {/* Gopuram Watermark Background */}
      <div className="absolute right-4 bottom-0 opacity-10 pointer-events-none hidden md:block">
        <svg className="w-72 h-72 text-amber-300 fill-current" viewBox="0 0 100 100">
          <path d="M 50 5 L 42 20 L 58 20 Z" />
          <path d="M 38 22 L 30 40 L 70 40 L 62 22 Z" />
          <path d="M 28 42 L 18 65 L 82 65 L 72 42 Z" />
          <rect x="12" y="67" width="76" height="30" rx="2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl">
        
        {/* Handwritten caption top-right */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Statewide Social Impact Platform</span>
          </div>

          <div className="hidden sm:block text-right">
            <span className="font-handwriting text-amber-300 text-lg sm:text-xl font-bold tracking-wide transform -rotate-1 inline-block drop-shadow">
              {t('common.tagline')}
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight mb-3">
          {t('home.heroTitle')}
        </h1>

        {/* Subtext */}
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal mb-6 max-w-2xl">
          {t('home.heroSubtitle')}
        </p>

        {/* Search Form Container */}
        <div ref={containerRef} className="relative w-full">
          <form 
            onSubmit={handleDistrictSearchSubmit}
            className="bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-2 relative"
          >
            {/* District Select Dropdown */}
            <div className="flex items-center gap-2 px-3 w-full sm:w-auto text-slate-700">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
              <span className="text-xs font-bold whitespace-nowrap hidden md:inline">District:</span>
              
              <select
                value={district}
                onChange={handleDistrictChange}
                className="w-full sm:w-48 py-2 bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All Districts">All 38 Districts</option>
                {ALL_TN_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <div className="h-6 w-px bg-slate-300 hidden sm:block" />

            {/* Free-text input with Microphone button */}
            <div className="flex-1 w-full relative flex items-center">
              <input
                type="text"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setIsOpen(true);
                  setHighlightedIndex(-1);
                }}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                placeholder="Search by district, city, or service (e.g., Chennai, Eye Camp)..."
                className="w-full pl-3 pr-10 py-2 text-xs sm:text-sm text-slate-900 focus:text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none font-semibold"
              />

              {/* Microphone Voice Search Button */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                aria-label={isListening ? "Listening for voice search input" : "Search by voice"}
                title={isListening ? "Listening... Speak now" : "Click to speak search query"}
                className={`absolute right-2 p-1.5 rounded-full transition-all ${
                  isListening 
                    ? 'bg-rose-100 text-rose-600 animate-pulse ring-2 ring-rose-500' 
                    : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                }`}
              >
                {isListening ? (
                  <div className="relative flex items-center justify-center">
                    <MicOff className="w-4 h-4 text-rose-600" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  </div>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Search District Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{t('home.searchNgo')}</span>
            </button>
          </form>

          {/* District Live Suggestions Dropdown (Requirements 1 - 7) */}
          {shouldShowDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 max-h-96 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-150 box-border text-slate-800">
              
              {/* Empty State for District (Requirement 5) */}
              {totalCount === 0 && isDistrictSelected ? (
                <div className="px-5 py-6 text-center space-y-3">
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    No NGOs or camps in <span className="text-blue-600 font-extrabold">{district}</span> yet. Try All 38 Districts
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDistrict('All Districts');
                      setIsOpen(true);
                      if (propSetDistrict) propSetDistrict('All Districts');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition cursor-pointer active:scale-95"
                  >
                    View All 38 Districts
                  </button>
                </div>
              ) : totalCount === 0 ? (
                <div className="px-5 py-4 text-center text-xs font-semibold text-slate-500">
                  No matching entries found for <span className="text-slate-800 font-bold">"{searchText}"</span>
                </div>
              ) : (
                <div className="space-y-3">
                  
                  {/* Section 1: NGOs in District */}
                  {filteredNGOs.length > 0 && (
                    <div>
                      <div className="px-4 py-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50/70 border-y border-blue-100">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>NGOs in {isDistrictSelected ? district : 'Tamil Nadu'} ({filteredNGOs.length})</span>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {filteredNGOs.map((ngo) => {
                          const indexInFlat = flattenedSuggestions.findIndex(s => s.keyId === `ngo-${ngo.id}`);
                          const isHighlighted = indexInFlat === highlightedIndex;

                          return (
                            <div
                              key={`ngo-${ngo.id}`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion({ ...ngo, suggestionType: 'ngo' });
                              }}
                              onClick={() => handleSelectSuggestion({ ...ngo, suggestionType: 'ngo' })}
                              className={`px-4 py-2.5 transition cursor-pointer flex items-center gap-3 group w-full text-left ${
                                isHighlighted ? 'bg-blue-100/80' : 'hover:bg-blue-50/80'
                              }`}
                            >
                              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform font-bold text-xs">
                                <Building2 className="w-4 h-4 shrink-0" />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug whitespace-normal break-words">{ngo.name}</p>
                                <p className="text-[10px] sm:text-xs font-medium text-slate-500 truncate mt-0.5">{ngo.category} • {ngo.district}</p>
                              </div>
                              <span className="text-[10px] sm:text-xs font-bold text-blue-600 shrink-0 opacity-0 group-hover:opacity-100 transition hidden sm:block ml-auto">View →</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Section 2: Camps & Events in District */}
                  {filteredCamps.length > 0 && (
                    <div>
                      <div className="px-4 py-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50/70 border-y border-emerald-100">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Camps & Events in {isDistrictSelected ? district : 'Tamil Nadu'} ({filteredCamps.length})</span>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {filteredCamps.map((camp) => {
                          const indexInFlat = flattenedSuggestions.findIndex(s => s.keyId === `camp-${camp.id}`);
                          const isHighlighted = indexInFlat === highlightedIndex;

                          return (
                            <div
                              key={`camp-${camp.id}`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion({ ...camp, suggestionType: 'camp' });
                              }}
                              onClick={() => handleSelectSuggestion({ ...camp, suggestionType: 'camp' })}
                              className={`px-4 py-2.5 transition cursor-pointer flex items-center gap-3 group w-full text-left ${
                                isHighlighted ? 'bg-emerald-100/80' : 'hover:bg-emerald-50/80'
                              }`}
                            >
                              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform font-bold text-xs">
                                <Calendar className="w-4 h-4 shrink-0" />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition leading-snug whitespace-normal break-words">{camp.title}</p>
                                <p className="text-[10px] sm:text-xs font-medium text-slate-500 truncate mt-0.5">{camp.org} • {camp.date.split('•')[0]}</p>
                              </div>
                              <span className="text-[10px] sm:text-xs font-bold text-emerald-600 shrink-0 opacity-0 group-hover:opacity-100 transition hidden sm:block ml-auto">View Details →</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Section 3: Volunteer Openings in District */}
                  {filteredVolunteers.length > 0 && (
                    <div>
                      <div className="px-4 py-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50/70 border-y border-purple-100">
                        <Users className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>Volunteer Openings in {isDistrictSelected ? district : 'Tamil Nadu'} ({filteredVolunteers.length})</span>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {filteredVolunteers.map((vol) => {
                          const indexInFlat = flattenedSuggestions.findIndex(s => s.keyId === `vol-${vol.id}`);
                          const isHighlighted = indexInFlat === highlightedIndex;

                          return (
                            <div
                              key={`vol-${vol.id}`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion({ ...vol, suggestionType: 'volunteer' });
                              }}
                              onClick={() => handleSelectSuggestion({ ...vol, suggestionType: 'volunteer' })}
                              className={`px-4 py-2.5 transition cursor-pointer flex items-center gap-3 group w-full text-left ${
                                isHighlighted ? 'bg-purple-100/80' : 'hover:bg-purple-50/80'
                              }`}
                            >
                              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform font-bold text-xs">
                                <Users className="w-4 h-4 shrink-0" />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-600 transition leading-snug whitespace-normal break-words">{vol.title}</p>
                                <p className="text-[10px] sm:text-xs font-medium text-slate-500 truncate mt-0.5">{vol.ngo_name || vol.ngo} • {vol.time_commitment || vol.commitment || 'Flexible'}</p>
                              </div>
                              <span className="text-[10px] sm:text-xs font-bold text-purple-600 shrink-0 opacity-0 group-hover:opacity-100 transition hidden sm:block ml-auto">Apply →</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Bottom Link to Search Page (Requirement 4) */}
                  <div className="p-2 border-t border-slate-100 bg-slate-50/90 rounded-b-2xl">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        const searchParams = new URLSearchParams();
                        if (district && district !== 'All Districts') searchParams.set('district', district);
                        if (searchText.trim()) searchParams.set('q', searchText.trim());
                        navigate(`/search?${searchParams.toString()}`);
                      }}
                      className="w-full py-2 px-3 text-center text-blue-600 hover:text-blue-800 transition font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-100/50 rounded-xl"
                    >
                      <span>View all results in {isDistrictSelected ? district : 'Tamil Nadu'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}
        </div>

        {/* Voice Search Fallback Error Toast */}
        {voiceError && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/90 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{voiceError}</span>
          </div>
        )}

        {/* Quick Stats Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-blue-200">
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Government Registered NGOs
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Updates Across 38 TN Districts
          </div>
        </div>

      </div>
    </div>
  );
}
