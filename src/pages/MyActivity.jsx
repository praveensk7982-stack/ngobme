import React from 'react';
import { Activity, Heart, Calendar, Users, Award, ShieldCheck, Download, Clock } from 'lucide-react';
import { USER_ACTIVITIES } from '../data/mockData';

export default function MyActivity() {
  return (
    <div className="space-y-6">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg ring-4 ring-blue-50">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Dharshini Raj</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Volunteer Lead
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Member since Jan 2024 • Headquarters: Chennai District</p>
            </div>
          </div>

          <button className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5">
            <Download className="w-4 h-4 text-blue-600" />
            <span>Download Annual Impact Certificate</span>
          </button>

        </div>

        {/* 4 Activity Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-emerald-950">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase">Total Donated</span>
              <Heart className="w-4 h-4 text-emerald-600 fill-current" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold">₹4,500</p>
            <span className="text-[10px] font-semibold text-emerald-700">Across 3 verified NGOs</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-950">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-blue-700 uppercase">Volunteer Hours</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold">28 Hours</p>
            <span className="text-[10px] font-semibold text-blue-700">6 Camps Completed</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100 text-purple-950">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-purple-700 uppercase">Events Attended</span>
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold">8 Events</p>
            <span className="text-[10px] font-semibold text-purple-700">Chennai & Madurai</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-100 text-amber-950">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-amber-700 uppercase">Badges Earned</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold">4 Badges</p>
            <span className="text-[10px] font-semibold text-amber-700">Silver Contributor</span>
          </div>

        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <h2 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Recent Activity Timeline
        </h2>
        <p className="text-xs text-slate-500 font-medium mb-6">Log of your contributions, registrations, and badges</p>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200">
          {USER_ACTIVITIES.map((act) => (
            <div key={act.id} className="relative pl-9 flex items-start justify-between gap-4 group">
              
              {/* Dot icon on line */}
              <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-blue-600 shadow-sm group-hover:scale-125 transition-transform" />

              <div className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200/80 flex-1 transition">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${act.badgeColor}`}>
                    {act.badge}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {act.date}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{act.title}</h3>
                <p className="text-[11px] font-semibold text-slate-500">Status: <span className="text-slate-700">{act.status}</span></p>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
