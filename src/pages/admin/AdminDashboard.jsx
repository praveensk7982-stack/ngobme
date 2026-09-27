import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Users, 
  HeartHandshake, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Eye, 
  Siren, 
  Send, 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  X,
  FileText,
  UserCheck
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { FEATURED_NGOS, UPCOMING_EVENTS, ALL_TN_DISTRICTS } from '../../data/mockData';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('camps'); // 'camps' | 'emergency_alerts' | 'community_reports' | 'ngos'

  // Camps Management State
  const [campsList, setCampsList] = useState(UPCOMING_EVENTS);
  const [showPostCampModal, setShowPostCampModal] = useState(false);
  const [selectedCampRegistrations, setSelectedCampRegistrations] = useState(null);
  const [registrationsList, setRegistrationsList] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  // New Camp Form State
  const [campForm, setCampForm] = useState({
    title_en: '',
    title_ta: '',
    title_hi: '',
    category: 'Medical',
    camp_type: 'private',
    org: 'State Government / Partner NGO',
    date: 'Sep 30 • 9:00 AM',
    location_en: '',
    location_ta: '',
    location_hi: '',
    district: 'Chennai',
    spots_available: 100,
    description_en: '',
    description_ta: '',
    description_hi: ''
  });

  // Emergency Alerts (Direction A) State
  const [adminEmergencies, setAdminEmergencies] = useState([
    {
      id: 'emg-1',
      title: 'Urgent O-Negative Blood Required for Surgery at GH Madurai',
      description: 'Immediate 4 units of rare O-Negative blood needed for emergency trauma surgery at Government Rajaji Hospital, Madurai.',
      emergency_type: 'blood_needed',
      district: 'Madurai',
      urgency_level: 'critical',
      status: 'active',
      created_at: new Date().toISOString()
    }
  ]);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [emergencyForm, setEmergencyForm] = useState({
    title: '',
    description: '',
    emergency_type: 'blood_needed',
    district: 'Chennai',
    urgency_level: 'high',
    expires_at: ''
  });

  // User Emergency Reports (Direction B) State
  const [userReports, setUserReports] = useState([
    {
      id: 'rep-101',
      reporter_name: 'Dharshini Raj',
      mobile_number: '9444088776',
      emergency_type: 'blood_needed',
      district: 'Madurai',
      location_detail: 'GH Madurai, Ward 4',
      description: 'Urgent O-Negative blood needed for surgery patient.',
      status: 'pending',
      reported_at: new Date().toISOString()
    },
    {
      id: 'rep-102',
      reporter_name: 'Karthik Raja',
      mobile_number: '9840112233',
      emergency_type: 'disaster_relief',
      district: 'Cuddalore',
      location_detail: 'Subramaniapuram coastal hamlet',
      description: 'Waterlogging up to 3 feet in low lying area. Dry food ration required.',
      status: 'reviewed',
      reported_at: new Date(Date.now() - 3600000).toISOString()
    }
  ]);

  // NGO Approvals State
  const [pendingNGOs, setPendingNGOs] = useState([
    { id: 'p-1', name: 'Pasumai Delta Youth Trust', district: 'Thanjavur', regNo: 'TN/2026/00918', category: 'Environment', date: '2 hours ago' },
    { id: 'p-2', name: 'Annai Therasa Care Home', district: 'Madurai', regNo: 'TN/2026/00919', category: 'Elderly Care', date: '5 hours ago' }
  ]);
  const [approvedNGOIds, setApprovedNGOIds] = useState([]);

  useEffect(() => {
    fetchCamps();
    fetchAdminEmergencies();
    fetchUserReports();
  }, []);

  const fetchCamps = async () => {
    try {
      const { data, error } = await supabase.from('camps').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setCampsList(data);
      }
    } catch (err) {
      console.warn('Supabase camps fetch notice:', err);
    }
  };

  const fetchAdminEmergencies = async () => {
    try {
      const { data, error } = await supabase.from('admin_emergencies').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setAdminEmergencies(data);
      }
    } catch (err) {
      console.warn('Supabase admin_emergencies fetch notice:', err);
    }
  };

  const fetchUserReports = async () => {
    try {
      const { data, error } = await supabase.from('user_emergency_reports').select('*').order('reported_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setUserReports(data);
      }
    } catch (err) {
      console.warn('Supabase user_emergency_reports fetch notice:', err);
    }
  };

  // Camp Handlers
  const handleCreateCamp = async (e) => {
    e.preventDefault();
    const newCamp = {
      id: `evt-${Date.now()}`,
      title: campForm.title_en,
      title_en: campForm.title_en,
      title_ta: campForm.title_ta || campForm.title_en,
      title_hi: campForm.title_hi || campForm.title_en,
      category: campForm.category,
      camp_type: campForm.camp_type,
      org: campForm.org,
      date: campForm.date,
      location: campForm.location_en,
      location_en: campForm.location_en,
      location_ta: campForm.location_ta || campForm.location_en,
      location_hi: campForm.location_hi || campForm.location_en,
      district: campForm.district,
      spots_available: Number(campForm.spots_available),
      spots: `${campForm.spots_available} spots left`,
      description: campForm.description_en,
      description_en: campForm.description_en,
      description_ta: campForm.description_ta || campForm.description_en,
      description_hi: campForm.description_hi || campForm.description_en,
      categoryColor: 'bg-purple-50 text-purple-700 border-purple-200'
    };

    setCampsList([newCamp, ...campsList]);
    setShowPostCampModal(false);

    try {
      await supabase.from('camps').insert(newCamp);
    } catch (err) {
      console.warn('Supabase camp insert fallback:', err);
    }
  };

  const handleDeleteCamp = (id) => {
    if (confirm('Are you sure you want to delete this camp?')) {
      setCampsList(campsList.filter(c => c.id !== id));
    }
  };

  const handleViewRegistrations = async (camp) => {
    setSelectedCampRegistrations(camp);
    setLoadingRegs(true);
    setRegistrationsList([]);

    try {
      const { data, error } = await supabase
        .from('camp_registrations')
        .select('*')
        .eq('camp_id', camp.id)
        .order('registered_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setRegistrationsList(data);
      } else {
        // Mock fallback registrations if table empty
        setRegistrationsList([
          { id: 'reg-1', full_name: 'Dharshini Raj', mobile_number: '9444088776', place: 'Chennai', registered_at: new Date().toISOString() },
          { id: 'reg-2', full_name: 'Karthik Subramanian', mobile_number: '9840122334', place: 'Madurai', registered_at: new Date(Date.now() - 7200000).toISOString() }
        ]);
      }
    } catch (err) {
      setRegistrationsList([
        { id: 'reg-1', full_name: 'Dharshini Raj', mobile_number: '9444088776', place: 'Chennai', registered_at: new Date().toISOString() }
      ]);
    } finally {
      setLoadingRegs(false);
    }
  };

  // Emergency Handlers
  const handleCreateAdminEmergency = async (e) => {
    e.preventDefault();
    const newAlert = {
      id: `emg-${Date.now()}`,
      title: emergencyForm.title,
      description: emergencyForm.description,
      emergency_type: emergencyForm.emergency_type,
      district: emergencyForm.district,
      urgency_level: (emergencyForm.urgency_level || 'high').toLowerCase(),
      status: 'active',
      created_at: new Date().toISOString(),
      expires_at: emergencyForm.expires_at || null
    };

    const updated = [newAlert, ...adminEmergencies];
    setAdminEmergencies(updated);
    try {
      localStorage.setItem('tn_ngo_admin_emergencies', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage write warning:', e);
    }

    setShowEmergencyForm(false);
    setEmergencyForm({ title: '', description: '', emergency_type: 'blood_needed', district: 'Chennai', urgency_level: 'high', expires_at: '' });

    try {
      const { error } = await supabase.from('admin_emergencies').insert(newAlert);
      if (error) {
        console.error('[AdminDashboard] Supabase admin_emergencies insert error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      }
    } catch (err) {
      console.warn('Supabase emergency insert fallback:', err);
    }
  };

  const handleToggleEmergencyStatus = async (id) => {
    const updated = adminEmergencies.map(e => e.id === id ? { ...e, status: e.status === 'active' ? 'resolved' : 'active' } : e);
    setAdminEmergencies(updated);
    try {
      localStorage.setItem('tn_ngo_admin_emergencies', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage write warning:', e);
    }

    const target = updated.find(e => e.id === id);
    if (target) {
      try {
        const { error } = await supabase.from('admin_emergencies').update({ status: target.status }).eq('id', id);
        if (error) {
          console.error('[AdminDashboard] Supabase status update error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase emergency status update fallback:', err);
      }
    }
  };

  const handleUserReportStatusChange = (id, newStatus) => {
    setUserReports(userReports.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleEscalateReportToAlert = (report) => {
    setEmergencyForm({
      title: `Emergency Alert: ${report.emergency_type.replace('_', ' ').toUpperCase()} in ${report.district}`,
      description: `Reported by ${report.reporter_name} at ${report.location_detail}: ${report.description}`,
      emergency_type: report.emergency_type,
      district: report.district,
      urgency_level: 'high',
      expires_at: ''
    });
    setActiveTab('emergency_alerts');
    setShowEmergencyForm(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Header Banner */}
      <div className="bg-[#0f1e3d] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>State Secretariat Control Console • Govt of Tamil Nadu</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Statewide Admin Control Center
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/80 mt-1">
              Manage community camps, issue statewide emergency alerts, review public reports, and audit non-profit registrations.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-400/30 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              Secretariat Status: Online
            </span>
          </div>
        </div>
      </div>

      {/* Admin Stat Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200 text-purple-950 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-purple-800 uppercase tracking-wider">Camps Managed</span>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-extrabold">{campsList.length} Active Camps</h3>
          <p className="text-[11px] font-semibold text-purple-700 mt-1">Admin creation & attendee roster live</p>
        </div>

        <div className="p-5 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-950 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-rose-800 uppercase tracking-wider">Active State Alerts</span>
            <Siren className="w-5 h-5 text-rose-600 animate-pulse" />
          </div>
          <h3 className="text-2xl font-extrabold">{adminEmergencies.filter(e => e.status === 'active').length} Public Alerts</h3>
          <p className="text-[11px] font-semibold text-rose-700 mt-1">Broadcasting to all 38 districts</p>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">User Emergency Reports</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-2xl font-extrabold">{userReports.filter(r => r.status === 'pending').length} Pending Reports</h3>
          <p className="text-[11px] font-semibold text-amber-700 mt-1">{userReports.length} total reports received</p>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">Verified NGOs</span>
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-extrabold">42,746 NGOs</h3>
          <p className="text-[11px] font-semibold text-blue-700 mt-1">Statewide Directory Audit</p>
        </div>

      </div>

      {/* Main Container with Navigation Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-slate-100">
          {[
            { id: 'camps', label: 'Camps & Events Management', icon: Calendar },
            { id: 'emergency_alerts', label: 'State Emergency Alerts (Public)', icon: Siren },
            { id: 'community_reports', label: 'User Emergency Reports', icon: AlertTriangle },
            { id: 'ngos', label: 'NGO Approvals & Directory', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer
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

        {/* TAB 1: CAMPS & EVENTS MANAGEMENT */}
        {activeTab === 'camps' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Admin Camp Broadcast & Registration Control</h2>
                <p className="text-xs text-slate-500 font-medium">Create new official camps, edit existing events, and view attendee lists.</p>
              </div>

              <button
                onClick={() => setShowPostCampModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Camp / Event</span>
              </button>
            </div>

            {/* List of Camps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campsList.map((evt) => (
                <div key={evt.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">
                        {evt.category} Camp ({evt.camp_type})
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{evt.title}</h3>
                      <p className="text-xs text-slate-600 font-medium">Org: {evt.org}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteCamp(evt.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete Camp"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 font-medium space-y-1">
                    <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-600" /> {evt.date}</p>
                    <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-500" /> {evt.location} ({evt.district})</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {evt.spots_available || 100} Spots Remaining
                    </span>

                    <button
                      onClick={() => handleViewRegistrations(evt)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Registrations</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: STATE EMERGENCY ALERTS (PUBLIC BROADCASTS - DIRECTION A) */}
        {activeTab === 'emergency_alerts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Admin Emergency Public Alerts (Direction A)</h2>
                <p className="text-xs text-slate-500 font-medium">Broadcast urgent alerts across the state (blood requests, disaster warnings, missing person searches).</p>
              </div>

              <button
                onClick={() => setShowEmergencyForm(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Siren className="w-4 h-4 animate-pulse" />
                <span>Post Public Emergency Alert</span>
              </button>
            </div>

            {/* Admin Alerts List */}
            <div className="space-y-3">
              {adminEmergencies.map((emg) => (
                <div key={emg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white ${
                        emg.urgency_level === 'critical' ? 'bg-rose-600' : emg.urgency_level === 'high' ? 'bg-orange-500' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {emg.urgency_level} urgency
                      </span>
                      <span className="text-[11px] font-bold text-slate-600">{emg.emergency_type} • {emg.district}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${emg.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                        {emg.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{emg.title}</h4>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{emg.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleEmergencyStatus(emg.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                        emg.status === 'active' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      }`}
                    >
                      {emg.status === 'active' ? 'Mark Resolved' : 'Re-activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: USER EMERGENCY REPORTS (DIRECTION B) */}
        {activeTab === 'community_reports' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Community Emergency Reports (Direction B)</h2>
              <p className="text-xs text-slate-500 font-medium">Review reports submitted by public users and escalate critical incidents into statewide alerts.</p>
            </div>

            <div className="space-y-3">
              {userReports.map((report) => (
                <div key={report.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                        {report.emergency_type}
                      </span>
                      <span className="text-xs font-bold text-slate-700">District: {report.district}</span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        report.status === 'pending' ? 'bg-amber-100 text-amber-800' : report.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-semibold">
                      Reported: {new Date(report.reported_at).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Reporter: {report.reporter_name} (+91 {report.mobile_number})</h4>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">Location: {report.location_detail}</p>
                    <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                      "{report.description}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUserReportStatusChange(report.id, 'reviewed')}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs border border-blue-200 transition cursor-pointer"
                      >
                        Mark Reviewed
                      </button>
                      <button
                        onClick={() => handleUserReportStatusChange(report.id, 'resolved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    </div>

                    <button
                      onClick={() => handleEscalateReportToAlert(report)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-xs shadow-sm hover:from-rose-500 hover:to-red-500 transition flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Escalate to Public Alert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: NGO APPROVALS */}
        {activeTab === 'ngos' && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Pending NGO Verification Queue</h3>
            <div className="space-y-3">
              {pendingNGOs.map((ngo) => (
                <div key={ngo.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">Reg No: {ngo.regNo}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{ngo.name}</h4>
                    <p className="text-xs text-slate-600">Category: {ngo.category} • {ngo.district}, Tamil Nadu</p>
                  </div>

                  <button
                    onClick={() => setApprovedNGOIds([...approvedNGOIds, ngo.id])}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition"
                  >
                    Approve NGO
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CREATE NEW CAMP MODAL */}
      {showPostCampModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-purple-700 text-white relative">
              <button onClick={() => setShowPostCampModal(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 text-white"><X className="w-5 h-5" /></button>
              <h2 className="text-lg font-black">Create New Camp / Event Drive</h2>
              <p className="text-xs text-purple-100 font-medium">Broadcast new drive across Tamil Nadu</p>
            </div>

            <form onSubmit={handleCreateCamp} className="p-6 overflow-y-auto space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700 font-bold">Category</label>
                  <select value={campForm.category} onChange={(e) => setCampForm({...campForm, category: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300">
                    <option value="Medical">Medical Camp</option>
                    <option value="Blood">Blood Donation</option>
                    <option value="Health">Health Screening</option>
                    <option value="Environment">Environment Drive</option>
                    <option value="Education">Education Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-700 font-bold">Camp Type</label>
                  <select value={campForm.camp_type} onChange={(e) => setCampForm({...campForm, camp_type: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300">
                    <option value="government">Government Sponsored</option>
                    <option value="private">NGO / Private Drive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-700 font-bold">Event Title (English) *</label>
                <input required type="text" value={campForm.title_en} onChange={(e) => setCampForm({...campForm, title_en: e.target.value})} placeholder="e.g. Free Eye Checkup Camp 2026" className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>

              <div>
                <label className="block mb-1 text-slate-700 font-bold">Event Title (தமிழ்)</label>
                <input type="text" value={campForm.title_ta} onChange={(e) => setCampForm({...campForm, title_ta: e.target.value})} placeholder="எ.கா. இலவசக் கண் பரிசோதனை முகாம்" className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700 font-bold">District Location *</label>
                  <select value={campForm.district} onChange={(e) => setCampForm({...campForm, district: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300">
                    {ALL_TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-700 font-bold">Available Spots *</label>
                  <input required type="number" value={campForm.spots_available} onChange={(e) => setCampForm({...campForm, spots_available: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-700 font-bold">Venue Location (English) *</label>
                <input required type="text" value={campForm.location_en} onChange={(e) => setCampForm({...campForm, location_en: e.target.value})} placeholder="e.g. GH Grounds, Chennai" className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>

              <div>
                <label className="block mb-1 text-slate-700 font-bold">Description (English)</label>
                <textarea rows="2" value={campForm.description_en} onChange={(e) => setCampForm({...campForm, description_en: e.target.value})} placeholder="Brief details about the camp..." className="w-full p-2.5 rounded-xl border border-slate-300 resize-none" />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md">
                Publish Camp Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE EMERGENCY PUBLIC ALERT MODAL */}
      {showEmergencyForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-rose-700 text-white relative">
              <button onClick={() => setShowEmergencyForm(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 text-white"><X className="w-5 h-5" /></button>
              <h2 className="text-lg font-black">Broadcast State Public Emergency Alert</h2>
              <p className="text-xs text-rose-100 font-medium">Post urgent public alert for blood, flood, or medical emergency</p>
            </div>

            <form onSubmit={handleCreateAdminEmergency} className="p-6 overflow-y-auto space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700 font-bold">Emergency Type</label>
                  <select value={emergencyForm.emergency_type} onChange={(e) => setEmergencyForm({...emergencyForm, emergency_type: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300">
                    <option value="blood_needed">Blood / Plasma Needed</option>
                    <option value="disaster_relief">Disaster & Flood Relief</option>
                    <option value="medical_emergency">Medical Emergency</option>
                    <option value="missing_person">Missing Person Search</option>
                    <option value="food_ration">Emergency Food & Ration</option>
                    <option value="animal_rescue">Animal Rescue</option>
                    <option value="other">General Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-700 font-bold">Urgency Level</label>
                  <select value={emergencyForm.urgency_level} onChange={(e) => setEmergencyForm({...emergencyForm, urgency_level: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-rose-700">
                    <option value="critical">Critical Urgency</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Urgency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-700 font-bold">District Location *</label>
                <select value={emergencyForm.district} onChange={(e) => setEmergencyForm({...emergencyForm, district: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300">
                  {ALL_TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-700 font-bold">Emergency Title *</label>
                <input required type="text" value={emergencyForm.title} onChange={(e) => setEmergencyForm({...emergencyForm, title: e.target.value})} placeholder="e.g. Urgent O-Negative Blood Needed at GH Madurai" className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>

              <div>
                <label className="block mb-1 text-slate-700 font-bold">Detailed Emergency Description *</label>
                <textarea required rows="3" value={emergencyForm.description} onChange={(e) => setEmergencyForm({...emergencyForm, description: e.target.value})} placeholder="Provide clear instructions and location details..." className="w-full p-2.5 rounded-xl border border-slate-300 resize-none" />
              </div>

              <button type="submit" className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md">
                Broadcast Emergency Alert Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW CAMP REGISTRATIONS MODAL */}
      {selectedCampRegistrations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-blue-700 text-white relative">
              <button onClick={() => setSelectedCampRegistrations(null)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 text-white"><X className="w-5 h-5" /></button>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-200">Registered Attendees</span>
              <h2 className="text-base font-black">{selectedCampRegistrations.title}</h2>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 text-xs">
              {loadingRegs ? (
                <p className="text-center text-slate-500 py-4 font-semibold">Loading attendee list...</p>
              ) : registrationsList.length === 0 ? (
                <p className="text-center text-slate-500 py-4 font-semibold">No attendees registered yet.</p>
              ) : (
                registrationsList.map((reg) => (
                  <div key={reg.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between font-semibold">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{reg.full_name}</p>
                      <p className="text-slate-500 text-xs">📍 {reg.place} • 📞 +91 {reg.mobile_number}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{new Date(reg.registered_at).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
