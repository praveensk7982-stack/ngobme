import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, ShieldCheck, ExternalLink, Building2, Star, Users } from 'lucide-react';
import { FEATURED_NGOS, ALL_TN_DISTRICTS, CATEGORIES } from '../data/mockData';

export default function NGODirectory({ onSelectNGO }) {
  const [searchParams] = useSearchParams();

  const queryDistrict = searchParams.get('district') || 'All Districts';
  const querySearch = searchParams.get('q') || searchParams.get('search') || '';
  const queryCategory = searchParams.get('category') || 'All Categories';

  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [selectedDistrict, setSelectedDistrict] = useState(queryDistrict);

  // Sync state when URL search params change
  useEffect(() => {
    if (searchParams.has('district')) {
      setSelectedDistrict(searchParams.get('district') || 'All Districts');
    }
    if (searchParams.has('q') || searchParams.has('search')) {
      setSearchTerm(searchParams.get('q') || searchParams.get('search') || '');
    }
    if (searchParams.has('category')) {
      setSelectedCategory(searchParams.get('category') || 'All Categories');
    }
  }, [searchParams]);

  // Filter NGOs based on search term, category, and district
  const filteredNGOs = FEATURED_NGOS.filter((ngo) => {
    const matchesSearch = !searchTerm.trim() ||
                          ngo.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                          ngo.description.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                          ngo.district.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesCategory = selectedCategory === 'All Categories' || ngo.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'All Districts' || ngo.district === selectedDistrict;

    return matchesSearch && matchesCategory && matchesDistrict;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Statewide Directory • 42,746+ Verified Non-Profits</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tamil Nadu NGO Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Search verified non-profit organizations across all 38 districts of Tamil Nadu by location, cause, and community impact.
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3 pt-6 border-t border-slate-100">
          
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search NGO name, cause, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3 relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div className="sm:col-span-3 relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
            >
              <option value="All Districts">All 38 Districts</option>
              {ALL_TN_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-bold text-slate-600">
          Showing <span className="text-blue-600 font-extrabold">{filteredNGOs.length}</span> verified NGOs 
          {selectedDistrict !== 'All Districts' && <span> in <strong className="text-slate-800">{selectedDistrict}</strong></span>}
        </p>

        {(searchTerm || selectedCategory !== 'All Categories' || selectedDistrict !== 'All Districts') && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Categories');
              setSelectedDistrict('All Districts');
            }}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Grid of NGO Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNGOs.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No NGOs matched your selected filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try selecting "All 38 Districts" or clear the search keyword to see more results across Tamil Nadu.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setSelectedDistrict('All Districts');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md transition inline-block"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredNGOs.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Logo & Category pill */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-2xl ${ngo.logoBg} text-white font-black text-sm flex items-center justify-center shadow-md ring-2 ring-white group-hover:scale-105 transition-transform`}>
                    {ngo.logoInitials}
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${ngo.categoryTagColor}`}>
                    {ngo.category}
                  </span>
                </div>

                {/* Title & Verified Badge */}
                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition mb-1 flex items-center gap-1">
                  {ngo.name}
                  {ngo.verified && <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 inline" />}
                </h3>

                {/* District & Location */}
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-2.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{ngo.district}, Tamil Nadu</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {ngo.description}
                </p>
              </div>

              {/* Bottom Meta & Action */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> {ngo.volunteers}
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" /> {ngo.rating.split(' ')[0]}
                  </span>
                </div>

                <button
                  onClick={() => onSelectNGO(ngo)}
                  className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs border border-blue-200 hover:border-blue-600 transition-all shadow-2xs flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>View Full Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
