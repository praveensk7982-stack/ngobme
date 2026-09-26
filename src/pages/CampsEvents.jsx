import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  PlusCircle, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';
import { UPCOMING_EVENTS } from '../data/mockData';
import { getLocalizedField, formatDate } from '../utils/i18nHelpers';
import CampDetailsModal from '../components/CampDetailsModal';

export default function CampsEvents({ onOpenPostEventModal }) {
  const { t, i18n } = useTranslation();
  const [campTypeFilter, setCampTypeFilter] = useState('all'); // 'all' | 'government' | 'private'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const categories = ['All', 'Medical', 'Blood', 'Health', 'Environment', 'Education', 'Food'];

  // Filter events by both camp_type and category
  const filteredEvents = UPCOMING_EVENTS.filter(evt => {
    const matchesType = campTypeFilter === 'all' || evt.camp_type === campTypeFilter;
    const matchesCategory = selectedCategoryFilter === 'All' || evt.category === selectedCategoryFilter;
    return matchesType && matchesCategory;
  });

  const handleRegisterSuccess = (eventId) => {
    if (!registeredEvents.includes(eventId)) {
      setRegisteredEvents([...registeredEvents, eventId]);
    }
  };

  const getCategoryFilterLabel = (cat) => {
    if (cat === 'All') return t('campsPage.filterAll');
    if (cat === 'Medical') return t('campsPage.filterMedical');
    if (cat === 'Blood') return t('campsPage.filterBlood');
    if (cat === 'Health') return t('campsPage.filterHealth');
    if (cat === 'Environment') return t('campsPage.filterEnvironment');
    if (cat === 'Education') return t('campsPage.filterEducation');
    if (cat === 'Food') return t('campsPage.filterFood');
    return t(`categoryBadges.${cat}`, cat) + ' ' + t('campsPage.campsSuffix', 'Camps');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-200">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('campsPage.activeCampsBadge')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('campsPage.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {t('campsPage.subtitle')}
            </p>
          </div>

          <button
            onClick={onOpenPostEventModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('campsPage.postEvent')}</span>
          </button>
        </div>

        {/* 1. Camp Type Tabs (Govt vs Private) */}
        <div className="mt-6 p-1.5 bg-slate-100 rounded-2xl flex items-center gap-1 max-w-md border border-slate-200/60">
          <button
            type="button"
            onClick={() => setCampTypeFilter('all')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all text-center ${
              campTypeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('campsPage.allCamps')}
          </button>

          <button
            type="button"
            onClick={() => setCampTypeFilter('government')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1.5 ${
              campTypeFilter === 'government'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('campsPage.govtCamps')}</span>
          </button>

          <button
            type="button"
            onClick={() => setCampTypeFilter('private')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1.5 ${
              campTypeFilter === 'private'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('campsPage.privateCamps')}</span>
          </button>
        </div>

        {/* 2. Category Pills Filter */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-2">{t('campsPage.categoryLabel')}</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategoryFilter === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {getCategoryFilterLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => {
          const isRegistered = registeredEvents.includes(evt.id);
          const isGovt = evt.camp_type === 'government';
          const title = getLocalizedField(evt, 'title', i18n.language) || evt.title;
          const location = getLocalizedField(evt, 'location', i18n.language) || evt.location;
          const org = getLocalizedField(evt, 'org', i18n.language) || evt.org;

          return (
            <div
              key={evt.id}
              onClick={() => setSelectedCamp(evt)}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Badges Row: Govt/Private Badge + Category Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Camp Type Badge */}
                    {isGovt ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-blue-600" /> {t('campsPage.govtCampBadge')}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-purple-600" /> {t('campsPage.privateCampBadge')}
                      </span>
                    )}

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${evt.categoryColor}`}>
                      {t(`categoryBadges.${evt.category}`, evt.category)}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full shrink-0">
                    {evt.spots_available ? `${evt.spots_available} ${t('campsWidget.spotsLeft', 'spots left')}` : evt.spots}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug mb-2">
                  {title}
                </h3>

                {/* Organizer */}
                <p className="text-xs text-slate-600 font-medium mb-3">
                  {t('campsPage.organizedBy')} <span className="font-bold text-slate-800">{org}</span>
                </p>

                {/* Details Box */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs text-slate-600 font-semibold mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{formatDate(evt.date, i18n.language)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{location} ({evt.district})</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isRegistered ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t('campsPage.registeredPass')}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCamp(evt);
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>{t('campsPage.viewAndRegister')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Clickable Camp Details & Registration Modal */}
      {selectedCamp && (
        <CampDetailsModal
          camp={selectedCamp}
          onClose={() => setSelectedCamp(null)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

    </div>
  );
}
