import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Users, 
  HeartHandshake, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Filter,
  BarChart3,
  Sparkles,
  Search
} from 'lucide-react';
import { FEATURED_NGOS, UPCOMING_EVENTS } from '../../data/mockData';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ngos');
  const [pendingNGOs, setPendingNGOs] = useState([
    { id: 'p-1', name: 'Pasumai Delta Youth Trust', district: 'Thanjavur', regNo: 'TN/2026/00918', category: 'Environment', date: '2 hours ago' },
    { id: 'p-2', name: 'Annai Therasa Care Home', district: 'Madurai', regNo: 'TN/2026/00919', category: 'Elderly Care', date: '5 hours ago' },
    { id: 'p-3', name: 'Nethaji Blood Donors Club', district: 'Coimbatore', regNo: 'TN/2026/00920', category: 'Blood Donation', date: 'Yesterday' }
  ]);

  const [approvedNGOIds, setApprovedNGOIds] = useState([]);
  const [rejectedNGOIds, setRejectedNGOIds] = useState([]);

  const handleApprove = (id) => {
    setApprovedNGOIds([...approvedNGOIds, id]);
  };

  const handleReject = (id) => {
    setRejectedNGOIds([...rejectedNGOIds, id]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#0f1e3d] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>State Secretarial Administration • Govt of Tamil Nadu</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Statewide NGO Control & Verification Console
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/80 mt-1">
              Audit NITI Aayog Darpan registrations, approve medical camp broadcasts, and oversee 80G donation receipts.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-400/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              System Status: Active
            </span>
          </div>
        </div>
      </div>

      {/* Top Admin Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Pending Approvals</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold">{pendingNGOs.length - approvedNGOIds.length - rejectedNGOIds.length} NGOs</h3>
          <p className="text-[11px] font-semibold text-amber-700 mt-1">Requires 80G & Darpan Audit</p>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-blue-950 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">Active Verified NGOs</span>
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold">42,746</h3>
          <p className="text-[11px] font-semibold text-blue-700 mt-1">Across 38 Districts</p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Camps Scheduled</span>
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold">1,258</h3>
          <p className="text-[11px] font-semibold text-emerald-700 mt-1">48 Active Today</p>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200/80 text-purple-950 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-purple-800 uppercase tracking-wider">Donations Processed</span>
            <HeartHandshake className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold">₹4.2Cr</h3>
          <p className="text-[11px] font-semibold text-purple-700 mt-1">80G Receipts Issued</p>
        </div>

      </div>

      {/* Main Admin Section with Navigation Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-slate-100">
          {[
            { id: 'ngos', label: 'Manage NGOs & Approvals', icon: Building2 },
            { id: 'camps', label: 'Approve Events & Camps', icon: Calendar },
            { id: 'volunteers', label: 'Manage Volunteers', icon: Users },
            { id: 'donations', label: 'Donation Audit Reports', icon: HeartHandshake },
            { id: 'users', label: 'User & Security Management', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2
                  ${isActive 
                    ? 'bg-[#0f1e3d] text-white shadow-md' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Manage NGOs */}
        {activeTab === 'ngos' && (
          <div className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Pending NGO Verification Queue</h3>
                <p className="text-xs text-slate-500 font-medium">Inspect Darpan registration IDs before approving public directory listing</p>
              </div>
            </div>

            <div className="space-y-3">
              {pendingNGOs.map((ngo) => {
                const isApproved = approvedNGOIds.includes(ngo.id);
                const isRejected = rejectedNGOIds.includes(ngo.id);

                return (
                  <div key={ngo.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Reg No: {ngo.regNo}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">{ngo.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{ngo.name}</h4>
                      <p className="text-xs text-slate-600 font-medium">Category: {ngo.category} • District: {ngo.district}, Tamil Nadu</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isApproved ? (
                        <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Approved
                        </span>
                      ) : isRejected ? (
                        <span className="px-4 py-2 rounded-xl bg-rose-100 text-rose-800 font-bold text-xs flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-rose-600" /> Rejected
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(ngo.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Approve NGO
                          </button>
                          <button
                            onClick={() => handleReject(ngo.id)}
                            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Approve Events */}
        {activeTab === 'camps' && (
          <div className="pt-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Medical & Health Camp Approvals</h3>
            <div className="space-y-3">
              {UPCOMING_EVENTS.map((evt) => (
                <div key={evt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">{evt.category} Camp</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{evt.title}</h4>
                    <p className="text-xs text-slate-600">by {evt.org} • {evt.location}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3, 4, 5 Placeholder Overview */}
        {(activeTab === 'volunteers' || activeTab === 'donations' || activeTab === 'users') && (
          <div className="pt-6 text-center space-y-3 py-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 mx-auto flex items-center justify-center font-bold">
              TN
            </div>
            <h3 className="text-base font-extrabold text-slate-900 capitalize">{activeTab} Management Portal</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Live state management active. State Secretariat auditing reports are operational across 38 districts of Tamil Nadu.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
