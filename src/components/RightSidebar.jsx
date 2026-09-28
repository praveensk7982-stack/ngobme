import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  ChevronRight, 
  MapPin, 
  Clock, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { UPCOMING_EVENTS } from '../data/mockData';
import { getLocalizedField, formatDate } from '../utils/i18nHelpers';
import CampDetailsModal from './CampDetailsModal';

export default function RightSidebar() {
  const { t, i18n } = useTranslation();
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const handleRegisterSuccess = (eventId) => {
    if (!registeredEvents.includes(eventId)) {
      setRegisteredEvents([...registeredEvents, eventId]);
    }
  };

  return (
    <aside className="space-y-5">
      
      {/* Upcoming Camps & Events Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              {t('campsWidget.upcomingCamps')}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">{t('campsWidget.subtext')}</p>
          </div>
        </div>

        {/* List of Events */}
        <div className="space-y-3">
          {UPCOMING_EVENTS.slice(0, 4).map((evt) => {
            const isGovt = evt.camp_type === 'government';
            const title = getLocalizedField(evt, 'title', i18n.language) || evt.title;
            const location = getLocalizedField(evt, 'location', i18n.language) || evt.location;
            const org = getLocalizedField(evt, 'org', i18n.language) || evt.org;

            return (
              <div
                key={evt.id}
                onClick={() => setSelectedCamp(evt)}
                className="p-3 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/70 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                {/* Top Badges Row */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1">
                    {/* Govt vs Private Camp Badge */}
                    {isGovt ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5 text-blue-600" /> {t('campsWidget.govtCamp')}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-0.5">
                        <Building2 className="w-2.5 h-2.5 text-purple-600" /> {t('campsWidget.privateCamp')}
                      </span>
                    )}

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${evt.categoryColor}`}>
                      {t(`categoryBadges.${evt.category}`, evt.category)}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-semibold">{evt.spots}</span>
                </div>

                {/* Event Title */}
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition leading-snug mb-1">
                  {title}
                </h3>

                {/* Organization */}
                <p className="text-[11px] font-medium text-slate-600 mb-2">
                  {t('campsWidget.organizedBy')} <span className="font-semibold text-slate-700">{org}</span>
                </p>

                {/* Date/Time & Location */}
                <div className="space-y-1 text-[10px] text-slate-500 font-semibold pt-2 border-t border-slate-200/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>{formatDate(evt.date, i18n.language)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[170px]">{location}</span>
                    </div>
                  </div>

                  <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition shrink-0">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clickable Modal */}
      {selectedCamp && (
        <CampDetailsModal
          camp={selectedCamp}
          onClose={() => setSelectedCamp(null)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

    </aside>
  );
}
