import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Building2, Calendar, Tag, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { getCombinedSearchData } from '../data/mockData';

export default function SearchResults({ onSelectNGO }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [activeTabFilter, setActiveTabFilter] = useState('all');

  const allData = getCombinedSearchData();
  const trimmedQuery = query.toLowerCase().trim();

  // Search logic: matches title, category, district, or description
  const matchingResults = trimmedQuery
    ? allData.filter(item =>
        item.title.toLowerCase().includes(trimmedQuery) ||
        item.category.toLowerCase().includes(trimmedQuery) ||
        item.district.toLowerCase().includes(trimmedQuery) ||
        (item.description && item.description.toLowerCase().includes(trimmedQuery))
      )
    : [];

  const filteredByTab = activeTabFilter === 'all'
    ? matchingResults
    : matchingResults.filter(item => item.type === activeTabFilter);

  const ngoCount = matchingResults.filter(i => i.type === 'ngo').length;
  const campCount = matchingResults.filter(i => i.type === 'camp').length;
  const categoryCount = matchingResults.filter(i => i.type === 'category').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>Global Platform Search Results</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Search Results for <span className="text-blue-600">"{query}"</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Found <span className="font-bold text-slate-800">{matchingResults.length}</span> matching entries across NGOs, Camps & Events, and Categories in Tamil Nadu.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-6 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-2">Filter View:</span>
          
          {[
            { id: 'all', label: `All Matches (${matchingResults.length})` },
            { id: 'ngo', label: `NGOs (${ngoCount})` },
            { id: 'camp', label: `Camps & Events (${campCount})` },
            { id: 'category', label: `Categories (${categoryCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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

      {/* Grid of Results */}
      {filteredByTab.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching results found for "{query}"</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try searching for a different district (e.g., Chennai, Madurai), category (e.g., Medical, Blood), or non-profit name.
          </p>
          <button
            onClick={() => navigate('/ngo-directory')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition inline-block mt-2"
          >
            Browse Full NGO Directory →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredByTab.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Type Tag Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
                    item.type === 'ngo' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    item.type === 'camp' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {item.type === 'ngo' && <Building2 className="w-3 h-3 text-blue-600" />}
                    {item.type === 'camp' && <Calendar className="w-3 h-3 text-emerald-600" />}
                    {item.type === 'category' && <Tag className="w-3 h-3 text-amber-600" />}
                    <span>{item.type === 'ngo' ? 'Registered NGO' : item.type === 'camp' ? 'Upcoming Camp' : 'Social Category'}</span>
                  </span>

                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {item.district}
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

              {/* Action */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (item.type === 'ngo') {
                      if (onSelectNGO && item.raw) onSelectNGO(item.raw);
                      else navigate('/ngo-directory');
                    } else if (item.type === 'camp') {
                      navigate('/camps-events');
                    } else {
                      navigate(`/ngo-directory?category=${encodeURIComponent(item.title)}`);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs border border-slate-200 hover:border-blue-600 transition-all flex items-center justify-center gap-1.5 active:scale-95"
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
