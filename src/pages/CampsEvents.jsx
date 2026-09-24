import React, { useState } from 'react';
import { Calendar, PlusCircle, MapPin, Clock, Users, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { UPCOMING_EVENTS } from '../data/mockData';

export default function CampsEvents({ onOpenPostEventModal, onOpenVolunteerModal }) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const filters = ['All', 'Medical', 'Blood', 'Health', 'Environment'];

  const filteredEvents = selectedCategoryFilter === 'All'
    ? UPCOMING_EVENTS
    : UPCOMING_EVENTS.filter(evt => evt.category === selectedCategoryFilter);

  const handleRegisterEvent = (eventId) => {
    if (!registeredEvents.includes(eventId)) {
      setRegisteredEvents([...registeredEvents, eventId]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-200">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>1,258+ Upcoming Camps Active Across Tamil Nadu</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Community Camps & Social Events
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Find free health screening drives, blood donation camps, environmental cleanups, and educational seminars happening near you.
            </p>
          </div>

          <button
            onClick={onOpenPostEventModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post an Event / Camp</span>
          </button>
        </div>

        {/* Category Pills Filter */}
        <div className="mt-6 flex flex-wrap items-center gap-2 pt-6 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-2">Filter by Category:</span>
          {filters.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat} {cat !== 'All' ? 'Camps' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => {
          const isRegistered = registeredEvents.includes(evt.id);

          return (
            <div
              key={evt.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Category Pill Tag & Capacity */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${evt.categoryColor}`}>
                    {evt.category} Camp
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {evt.spots}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug mb-2">
                  {evt.title}
                </h3>

                {/* Organizer */}
                <p className="text-xs text-slate-600 font-medium mb-3">
                  Organized by <span className="font-bold text-slate-800">{evt.org}</span>
                </p>

                {/* Details Box */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs text-slate-600 font-semibold mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{evt.location} ({evt.district})</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isRegistered ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Registered • Pass Sent to Mobile</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRegisterEvent(evt.id)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Register for Camp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
