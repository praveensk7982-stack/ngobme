import React from 'react';
import { Building2, CalendarHeart, Users, HeartHandshake, TrendingUp, Sparkles } from 'lucide-react';
import { STATS } from '../data/mockData';

const ICON_MAP = {
  Building2,
  CalendarHeart,
  Users,
  HeartHandshake
};

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat) => {
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
                  {stat.title}
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {stat.value}
                </h3>
              </div>

              {/* Icon Badge */}
              <div className={`p-3 rounded-2xl ${stat.iconColor} shadow-md shrink-0`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            {/* Bottom Trend / Subtitle */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              <TrendingUp className={`w-3.5 h-3.5 ${stat.accentColor}`} />
              <span className={stat.accentColor}>{stat.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
