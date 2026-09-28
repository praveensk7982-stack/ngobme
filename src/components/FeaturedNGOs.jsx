import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, Award, ExternalLink, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { FEATURED_NGOS } from '../data/mockData';
import { getLocalizedField } from '../utils/i18nHelpers';
import { matchDistrict } from '../utils/districtUtils';
import { getApprovedNGOs } from '../lib/ngoData';

export default function FeaturedNGOs({ onSelectNGO, selectedDistrict }) {
  const { t, i18n } = useTranslation();
  const [approvedNGOs, setApprovedNGOs] = useState(FEATURED_NGOS);

  useEffect(() => {
    let isMounted = true;
    getApprovedNGOs().then((data) => {
      if (isMounted && data && data.length > 0) {
        setApprovedNGOs(data);
      }
    }).catch((err) => {
      console.warn('FeaturedNGOs getApprovedNGOs fallback:', err);
    });
    return () => { isMounted = false; };
  }, []);

  const filteredNGOs = selectedDistrict && selectedDistrict !== 'All Districts'
    ? approvedNGOs.filter(ngo => matchDistrict(ngo.district, selectedDistrict))
    : approvedNGOs;

  const displayList = (filteredNGOs.length > 0 ? filteredNGOs : approvedNGOs).slice(0, 8);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            {t('home.featuredNgosTitle')}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{t('home.featuredNgosSubtitle')}</p>
        </div>

        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition group cursor-pointer">
          <span>{t('home.viewAll')}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayList.map((ngo) => {
          const localizedName = getLocalizedField(ngo, 'name', i18n.language) || ngo.name;
          const localizedDesc = getLocalizedField(ngo, 'description', i18n.language) || ngo.description;

          const logoText = ngo.logo || ngo.logoInitials || (ngo.name ? ngo.name.substring(0, 2).toUpperCase() : 'NGO');
          const logoBg = ngo.logoBg || 'bg-gradient-to-br from-blue-600 to-indigo-600';
          const categoryTagColor = ngo.categoryTagColor || 'bg-blue-100 text-blue-800 border-blue-200';

          return (
            <div
              key={ngo.id || ngo.reg_number}
              className="bg-slate-50/80 hover:bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-2xl ${logoBg} text-white font-black text-sm flex items-center justify-center shadow-md ring-2 ring-white group-hover:scale-105 transition-transform shrink-0`}>
                    {logoText}
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${categoryTagColor}`}>
                    {t(`categoryBadges.${ngo.category}`, ngo.category)}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition mb-1 flex items-center gap-1">
                  {localizedName}
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 inline" />
                </h3>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-2.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{ngo.district}, Tamil Nadu</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {localizedDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> {ngo.volunteers || '50+ Volunteers'}
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" /> {ngo.rating ? ngo.rating.split(' ')[0] : '5.0'}
                  </span>
                </div>

                <button
                  onClick={() => onSelectNGO(ngo)}
                  className="w-full py-2 rounded-xl bg-white hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs border border-blue-200 hover:border-blue-600 transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span>View Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
