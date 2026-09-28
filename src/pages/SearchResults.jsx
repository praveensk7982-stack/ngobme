import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Search, Building2, Calendar, Tag, ArrowRight, MapPin, Users, X, Filter } from 'lucide-react';
import { FEATURED_NGOS, UPCOMING_EVENTS, VOLUNTEER_OPPORTUNITIES, CATEGORIES } from '../data/mockData';
import { getVolunteerOpenings } from '../lib/volunteerOpenings';
import { matchDistrict } from '../utils/districtUtils';

export default function SearchResults({ onSelectNGO: propOnSelectNGO }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const onSelectNGO = propOnSelectNGO || outletContext.onSelectNGO;
  const setParentDistrict = outletContext.setSelectedDistrict;

  const districtParam = searchParams.get('district') || 'All Districts';
  const queryParam = searchParams.get('q') || searchParams.get('search') || '';

  const [activeTabFilter, setActiveTabFilter] = useState('all');
  const [dynamicVolunteerOpenings, setDynamicVolunteerOpenings] = useState([]);

  // Fetch dynamic volunteer openings from Supabase/LocalStorage
  useEffect(() => {
    let isMounted = true;
    getVolunteerOpenings().then((data) => {
      if (isMounted && data && data.length > 0) {
        setDynamicVolunteerOpenings(data);
      }
    }).catch((err) => {
      console.warn('SearchResults volunteer fetch fallback:', err);
    });
    return () => { isMounted = false; };
  }, []);

  // Sync parent district state with URL parameter for seamless navigation
  useEffect(() => {
    if (setParentDistrict && districtParam) {
      setParentDistrict(districtParam);
    }
  }, [districtParam, setParentDistrict]);

  const normQ = queryParam.toLowerCase().trim();

  // 1. Filter NGOs
  const filteredNGOs = FEATURED_NGOS.filter((ngo) => {
    const matchesDistrict = matchDistrict(ngo.district, districtParam);
    const matchesText = !normQ ||
      ngo.name.toLowerCase().includes(normQ) ||
      ngo.category.toLowerCase().includes(normQ) ||
      ngo.description.toLowerCase().includes(normQ) ||
      ngo.district.toLowerCase().includes(normQ);
    return matchesDistrict && matchesText;
  });

  // 2. Filter Camps & Events
  const filteredCamps = UPCOMING_EVENTS.filter((camp) => {
    const matchesDistrict = matchDistrict(camp.district, districtParam);
    const matchesText = !normQ ||
      camp.title.toLowerCase().includes(normQ) ||
      camp.category.toLowerCase().includes(normQ) ||
      camp.org.toLowerCase().includes(normQ) ||
      camp.location.toLowerCase().includes(normQ) ||
      camp.description.toLowerCase().includes(normQ) ||
      camp.district.toLowerCase().includes(normQ);
    return matchesDistrict && matchesText;
  });

  // 3. Filter Volunteer Openings (combining dynamic + mock)
  const rawVolunteers = dynamicVolunteerOpenings.length > 0
    ? dynamicVolunteerOpenings
    : VOLUNTEER_OPPORTUNITIES;

  const filteredVolunteers = rawVolunteers.filter((vol) => {
    const statusOk = vol.status ? vol.status === 'active' : true;
    const matchesDistrict = matchDistrict(vol.district, districtParam);
    const volNgo = vol.ngo_name || vol.ngo || '';
    const volCat = vol.category_tag || vol.category || '';
    const matchesText = !normQ ||
      vol.title.toLowerCase().includes(normQ) ||
      volNgo.toLowerCase().includes(normQ) ||
      volCat.toLowerCase().includes(normQ) ||
      (vol.description && vol.description.toLowerCase().includes(normQ)) ||
      vol.district.toLowerCase().includes(normQ);
    return statusOk && matchesDistrict && matchesText;
  });

  // 4. Filter Categories
  const filteredCategories = CATEGORIES.filter((cat) => {
    return !normQ || cat.name.toLowerCase().includes(normQ);
  });

  // Convert to formatted items
  const ngoItems = filteredNGOs.map(ngo => ({
    id: ngo.id,
    type: 'ngo',
    title: ngo.name,
    subtext: `${ngo.category} • ${ngo.district}`,
    district: ngo.district,
    description: ngo.description,
    raw: ngo
  }));

  const campItems = filteredCamps.map(camp => ({
    id: camp.id,
    type: 'camp',
    title: camp.title,
    subtext: `Organized by ${camp.org} • ${camp.date}`,
    district: camp.district,
    description: camp.description,
    raw: camp
  }));

  const volItems = filteredVolunteers.map(vol => ({
    id: vol.id,
    type: 'volunteer',
    title: vol.title,
    subtext: `${vol.ngo_name || vol.ngo} • ${vol.time_commitment || vol.commitment || 'Flexible'}`,
    district: vol.district,
    description: vol.description || `Volunteer opening in ${vol.district}`,
    raw: vol
  }));

  const catItems = filteredCategories.map(cat => ({
    id: cat.id,
    type: 'category',
    title: cat.name,
    subtext: `${cat.count} active non-profits`,
    district: 'All Districts',
    description: `Explore all ${cat.name} non-profits across Tamil Nadu`,
    raw: cat
  }));

  const allItems = [...ngoItems, ...campItems, ...volItems, ...catItems];

  const displayedItems = activeTabFilter === 'all'
    ? allItems
    : allItems.filter(item => item.type === activeTabFilter);

  // Filter chip actions
  const handleRemoveDistrict = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('district');
    setSearchParams(next);
  };

  const handleRemoveQuery = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    next.delete('search');
    setSearchParams(next);
  };

  const handleClearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasDistrictFilter = districtParam && districtParam !== 'All Districts';
  const hasQueryFilter = Boolean(normQ);

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>Search Results Center</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Search Results {queryParam ? <>for <span className="text-blue-600">"{queryParam}"</span></> : null}
            {hasDistrictFilter ? <> in <span className="text-emerald-700">{districtParam}</span></> : null}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600">
            Found <span className="font-bold text-slate-900">{allItems.length}</span> matching items 
            ({filteredNGOs.length} NGOs, {filteredCamps.length} Camps & Events, {filteredVolunteers.length} Volunteer Openings).
          </p>
        </div>

        {/* Filter Chips Row (Requirement 4) */}
        {(hasDistrictFilter || hasQueryFilter) && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Active Filters:
            </span>

            {hasDistrictFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>District: {districtParam}</span>
                <button
                  onClick={handleRemoveDistrict}
                  className="p-0.5 rounded-full hover:bg-emerald-200/80 text-emerald-700 transition cursor-pointer"
                  title="Remove district filter"
                  aria-label="Remove district filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {hasQueryFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold shadow-2xs">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Search: {queryParam}</span>
                <button
                  onClick={handleRemoveQuery}
                  className="p-0.5 rounded-full hover:bg-blue-200/80 text-blue-700 transition cursor-pointer"
                  title="Remove search query filter"
                  aria-label="Remove search query filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            <button
              onClick={handleClearAllFilters}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 hover:underline ml-1 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Section Filter Tabs */}
        <div className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-2">View Section:</span>
          
          {[
            { id: 'all', label: `All Matches (${allItems.length})` },
            { id: 'ngo', label: `NGOs (${filteredNGOs.length})` },
            { id: 'camp', label: `Camps & Events (${filteredCamps.length})` },
            { id: 'volunteer', label: `Volunteer Openings (${filteredVolunteers.length})` },
            { id: 'category', label: `Categories (${filteredCategories.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTabFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Results or Friendly Empty State (Requirement 5) */}
      {displayedItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center shadow-xs">
            <MapPin className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-900">
              No results found {hasDistrictFilter ? `in ${districtParam}` : ''} {hasQueryFilter ? `for "${queryParam}"` : ''}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {hasDistrictFilter
                ? `Try searching All 38 Districts or selecting another district in Tamil Nadu.`
                : `Try using broader search terms or checking spellings.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {hasDistrictFilter && (
              <button
                onClick={handleRemoveDistrict}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
              >
                Search All 38 Districts
              </button>
            )}

            {hasQueryFilter && (
              <button
                onClick={handleRemoveQuery}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition cursor-pointer active:scale-95"
              >
                Clear Search Keyword
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Type Badge Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 border ${
                    item.type === 'ngo' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    item.type === 'camp' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    item.type === 'volunteer' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {item.type === 'ngo' && <Building2 className="w-3 h-3 text-blue-600 shrink-0" />}
                    {item.type === 'camp' && <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />}
                    {item.type === 'volunteer' && <Users className="w-3 h-3 text-purple-600 shrink-0" />}
                    {item.type === 'category' && <Tag className="w-3 h-3 text-amber-600 shrink-0" />}
                    <span>
                      {item.type === 'ngo' ? 'Registered NGO' :
                       item.type === 'camp' ? 'Upcoming Camp' :
                       item.type === 'volunteer' ? 'Volunteer Drive' : 'Category'}
                    </span>
                  </span>

                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {item.district}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug mb-1">
                  {item.title}
                </h3>

                {/* Subtext */}
                <p className="text-xs font-semibold text-slate-500 mb-3">{item.subtext}</p>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (item.type === 'ngo') {
                      if (onSelectNGO && item.raw) {
                        onSelectNGO(item.raw);
                      } else {
                        navigate(`/ngo-directory?q=${encodeURIComponent(item.title)}`);
                      }
                    } else if (item.type === 'camp') {
                      navigate(`/camps-events?id=${item.id}`);
                    } else if (item.type === 'volunteer') {
                      navigate(`/volunteer`);
                    } else {
                      navigate(`/ngo-directory?category=${encodeURIComponent(item.title)}`);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs border border-slate-200 hover:border-blue-600 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
