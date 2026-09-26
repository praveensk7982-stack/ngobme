import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, CalendarHeart, Users, HeartHandshake, TrendingUp } from 'lucide-react';

const ICON_MAP = {
  Building2,
  CalendarHeart,
  Users,
  HeartHandshake
};

export default function StatCards() {
  const { t } = useTranslation();

  const STATS_ITEMS = [
    {
      id: 'ngos',
      titleKey: 'stats.ngosTitle',
      value: '42,746+',
      changeKey: 'stats.ngosChange',
      accentColor: 'text-blue-600',
      bgColor: 'bg-blue-50/80 hover:bg-blue-100/80 border-blue-100 text-blue-900',
      iconColor: 'bg-blue-600 text-white',
      iconName: 'Building2'
    },
    {
      id: 'camps',
      titleKey: 'stats.campsTitle',
      value: '1,258+',
      changeKey: 'stats.campsChange',
      accentColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-100 text-emerald-900',
      iconColor: 'bg-emerald-600 text-white',
      iconName: 'CalendarHeart'
    },
    {
      id: 'volunteers',
      titleKey: 'stats.volunteersTitle',
      value: '3,642+',
      changeKey: 'stats.volunteersChange',
      accentColor: 'text-rose-600',
      bgColor: 'bg-rose-50/80 hover:bg-rose-100/80 border-rose-100 text-rose-900',
      iconColor: 'bg-rose-600 text-white',
      iconName: 'Users'
    },
    {
      id: 'donations',
      titleKey: 'stats.donationsTitle',
      value: '892+',
      changeKey: 'stats.donationsChange',
      accentColor: 'text-purple-600',
      bgColor: 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-100 text-purple-900',
      iconColor: 'bg-purple-600 text-white',
      iconName: 'HeartHandshake'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS_ITEMS.map((stat) => {
        const IconComponent = ICON_MAP[stat.iconName] || Building2;
        
        return (
          <div
            key={stat.id}
            className={`
              p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
              flex flex-col justify-between ${stat.bgColor} backdrop-blur-sm
            `}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  {t(stat.titleKey)}
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {stat.value}
                </h3>
              </div>

              <div className={`p-3 rounded-2xl ${stat.iconColor} shadow-md shrink-0`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              <TrendingUp className={`w-3.5 h-3.5 ${stat.accentColor}`} />
              <span className={stat.accentColor}>{t(stat.changeKey)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
