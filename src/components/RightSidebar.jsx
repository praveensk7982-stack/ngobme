import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronRight, 
  UserPlus, 
  HeartHandshake, 
  Building2, 
  PlusCircle, 
  Sparkles,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { UPCOMING_EVENTS } from '../data/mockData';
import CampDetailsModal from './CampDetailsModal';

export default function RightSidebar({ 
  onOpenVolunteerModal, 
  onOpenDonateModal, 
  onOpenRegisterNGOModal, 
  onOpenPostEventModal
}) {
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const handleRegisterSuccess = (eventId) => {
    if (!registeredEvents.includes(eventId)) {
      setRegisteredEvents([...registeredEvents, eventId]);
    }
  };

  return (
    <aside className="space-y-5">
      
      {/* 1. Upcoming Camps & Events Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              Upcoming Camps & Events
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Join upcoming drives in your region</p>
          </div>
        </div>

        {/* List of Events */}
        <div className="space-y-3">
          {UPCOMING_EVENTS.slice(0, 4).map((evt) => {
            const isGovt = evt.camp_type === 'government';

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
                        <ShieldCheck className="w-2.5 h-2.5 text-blue-600" /> Govt
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-0.5">
                        <Building2 className="w-2.5 h-2.5 text-purple-600" /> Private
                      </span>
                    )}

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${evt.categoryColor}`}>
                      {evt.category}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-semibold">{evt.spots}</span>
                </div>

                {/* Event Title */}
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition leading-snug mb-1">
                  {evt.title}
                </h3>

                {/* Organization */}
                <p className="text-[11px] font-medium text-slate-600 mb-2">
                  by <span className="font-semibold text-slate-700">{evt.org}</span>
                </p>

                {/* Date/Time & Location */}
                <div className="space-y-1 text-[10px] text-slate-500 font-semibold pt-2 border-t border-slate-200/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[170px]">{evt.location}</span>
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

      {/* 2. Quick Actions 2x2 Grid */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
        <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-3">
          
          <button
            onClick={onOpenVolunteerModal}
            className="p-3.5 rounded-2xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 hover:border-blue-400 text-left transition-all duration-200 group flex flex-col justify-between h-28 shadow-2xs hover:shadow-md cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-950 leading-tight">Register as Volunteer</p>
              <span className="text-[10px] font-semibold text-blue-700 block mt-0.5">Join Local Drives</span>
            </div>
          </button>

          <button
            onClick={onOpenDonateModal}
            className="p-3.5 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/80 hover:border-emerald-400 text-left transition-all duration-200 group flex flex-col justify-between h-28 shadow-2xs hover:shadow-md cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950 leading-tight">Make a Donation</p>
              <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">Direct 80G Tax Relief</span>
            </div>
          </button>

          <button
            onClick={onOpenRegisterNGOModal}
            className="p-3.5 rounded-2xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200/80 hover:border-amber-400 text-left transition-all duration-200 group flex flex-col justify-between h-28 shadow-2xs hover:shadow-md cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950 leading-tight">Add / Register NGO</p>
              <span className="text-[10px] font-semibold text-amber-700 block mt-0.5">Free Directory Listing</span>
            </div>
          </button>

          <button
            onClick={onOpenPostEventModal}
            className="p-3.5 rounded-2xl bg-purple-50/80 hover:bg-purple-100 border border-purple-200/80 hover:border-purple-400 text-left transition-all duration-200 group flex flex-col justify-between h-28 shadow-2xs hover:shadow-md cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-purple-950 leading-tight">Post Event / Camp</p>
              <span className="text-[10px] font-semibold text-purple-700 block mt-0.5">Mobilize Volunteers</span>
            </div>
          </button>

        </div>
      </div>

      {/* 3. Promo Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 p-5 text-white shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/20 blur-xl pointer-events-none" />
        
        <div className="relative z-10">
          <span className="px-2.5 py-1 rounded-full bg-white/20 text-white font-bold text-[10px] tracking-wide uppercase inline-block mb-2 backdrop-blur-sm">
            Community Spotlight
          </span>

          <h3 className="text-base font-extrabold leading-snug mb-1.5">
            "Small help creates a big change"
          </h3>

          <p className="text-xs text-orange-50 font-medium leading-relaxed mb-4">
            Even ₹100 or 1 hour of volunteer time can sponsor a child's school kit or fund emergency meals.
          </p>

          <button
            onClick={onOpenDonateModal}
            className="w-full py-2.5 rounded-xl bg-white hover:bg-orange-50 text-orange-700 font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>Contribute Today</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clickable Modal for Home Page Upcoming Camps widget */}
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
