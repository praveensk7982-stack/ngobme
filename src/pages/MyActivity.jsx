import React, { useState, useEffect } from 'react';
import { Activity, Heart, Calendar, Users, Award, ShieldCheck, Download, Clock, Building2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { USER_ACTIVITIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { getAllNGOs } from '../lib/ngoData';

export default function MyActivity() {
  const { user: authUser } = useAuth();
  const [userNGOs, setUserNGOs] = useState([]);
  const [loadingNGOs, setLoadingNGOs] = useState(true);

  useEffect(() => {
    async function loadUserSubmittedNGOs() {
      setLoadingNGOs(true);
      try {
        const all = await getAllNGOs();
        const userIdentifier = authUser?.uid || authUser?.id || authUser?.email;
        const mySubmitted = all.filter(ngo => {
          if (!userIdentifier) return ngo.submitted_by !== 'system';
          return ngo.submitted_by === userIdentifier || ngo.submitted_by === 'user_anonymous' || ngo.submitted_by === authUser?.email;
        });
        setUserNGOs(mySubmitted);
      } catch (err) {
        console.warn('Failed to load user submitted NGOs:', err);
      } finally {
        setLoadingNGOs(false);
      }
    }
    loadUserSubmittedNGOs();
  }, [authUser]);

  return (
    <div className="space-y-6">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg ring-4 ring-blue-50">
              {authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'D'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {authUser?.name || 'Dharshini Raj'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Volunteer Lead
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Member since Jan 2024 • Headquarters: {authUser?.district || 'Chennai'} District
              </p>
            </div>
          </div>

          <button className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer">
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

      {/* SECTION: My Submitted NGO Registration Applications */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-500" />
              My Submitted NGO Registration Applications
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Track real-time admin verification status of non-profits you submitted</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            {userNGOs.length} Applications
          </span>
        </div>

        {loadingNGOs ? (
          <div className="p-6 text-center text-xs font-semibold text-slate-500">Loading submitted applications...</div>
        ) : userNGOs.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
            <p className="text-xs font-bold text-slate-700">No NGO registration applications submitted yet.</p>
            <p className="text-[11px] text-slate-500">Go to the NGO Directory page and click "Register your NGO" to submit a non-profit for verification.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userNGOs.map((ngo) => (
              <div key={ngo.id || ngo.reg_number} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-200">
                      Reg: {ngo.reg_number || ngo.regNo}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{ngo.category} • {ngo.district}</span>
                  </div>

                  {/* Status Badge */}
                  {ngo.status === 'pending' && (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold flex items-center gap-1 w-fit">
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                      <span>Pending Admin Verification</span>
                    </span>
                  )}
                  {ngo.status === 'approved' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Approved & Verified ✓</span>
                    </span>
                  )}
                  {ngo.status === 'rejected' && (
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold flex items-center gap-1 w-fit">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Application Rejected</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{ngo.name}</h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Contact Lead: {ngo.contact_person} (+91 {ngo.mobile_number}) • {ngo.email}
                  </p>
                  {ngo.description && (
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 mt-2">
                      "{ngo.description}"
                    </p>
                  )}
                </div>

                {/* Rejection Reason Display if Rejected */}
                {ngo.status === 'rejected' && ngo.rejection_reason && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium space-y-0.5">
                    <p className="font-bold flex items-center gap-1 text-rose-700">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Rejection Reason from State Secretariat Admin:</span>
                    </p>
                    <p className="text-slate-800 pl-4">{ngo.rejection_reason}</p>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 font-medium text-right pt-1 border-t border-slate-200/60">
                  Submitted on: {new Date(ngo.created_at || Date.now()).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
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
