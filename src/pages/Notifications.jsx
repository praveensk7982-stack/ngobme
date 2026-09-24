import React from 'react';
import { Bell, CheckCheck, Clock, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

export default function Notifications({ notificationsList, unreadNotificationsCount, onClearNotifications }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Page Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-3 border border-rose-200">
              <Bell className="w-3.5 h-3.5 text-rose-600" />
              <span>Real-Time Notifications & Community Updates</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Notification Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Stay updated on blood emergency calls, camp schedule approvals, and donation tax receipts.
            </p>
          </div>

          <button
            onClick={onClearNotifications}
            className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 divide-y divide-slate-100">
        {notificationsList.map((notif) => {
          const isUnread = notif.unread && unreadNotificationsCount > 0;

          return (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl transition flex items-start gap-4 ${
                isUnread ? 'bg-blue-50/60 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isUnread ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'
              }`}>
                <Bell className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    isUnread ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {notif.category || 'Alert'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {notif.time}
                  </span>
                </div>

                <p className={`text-xs sm:text-sm ${isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                  {notif.text}
                </p>
              </div>

              {isUnread && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
