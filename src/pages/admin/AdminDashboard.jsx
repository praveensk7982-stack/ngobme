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
  UserCheck,
  Search
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useSearchParams } from 'react-router-dom';
import { FEATURED_NGOS, UPCOMING_EVENTS, ALL_TN_DISTRICTS } from '../../data/mockData';
import { 
  getVolunteerOpenings, 
  saveVolunteerOpening, 
  updateVolunteerOpeningStatus, 
  deleteVolunteerOpening, 
  sendInAppNotification 
} from '../../lib/volunteerOpenings';
import { getPendingNGOs, updateNGOStatus } from '../../lib/ngoData';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { role: authRole } = useAuth();

  // Volunteer Openings Admin State
  const [adminOpenings, setAdminOpenings] = useState([]);
  const [adminOpeningFilter, setAdminOpeningFilter] = useState('pending'); // 'pending' | 'active' | 'rejected' | 'closed'
  const [showRejectModal, setShowRejectModal] = useState(null); // opening object or null
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [showAdminPostOpeningModal, setShowAdminPostOpeningModal] = useState(false);
  const [adminOpeningForm, setAdminOpeningForm] = useState({
    title: '',
    ngo_name: 'State Secretariat / Govt Partner',
    district: 'Chennai',
    category_tag: 'High Impact',
    time_commitment: '4 hrs/week',
    blood_groups_needed: '',
    description: ''
  });

  useEffect(() => {
    loadAdminOpenings();
  }, []);

  const loadAdminOpenings = async () => {
    const list = await getVolunteerOpenings();
    setAdminOpenings(list);
  };

  const handleApproveOpening = async (op) => {
    const updated = await updateVolunteerOpeningStatus(op.id, 'active');
    setAdminOpenings(updated);

    await sendInAppNotification({
      id: `notif-${Date.now()}`,
      title: 'Volunteer Opening Approved! 🎉',
      message: `Your volunteer opening "${op.title}" has been approved by Secretariat Admin and is now live on TN NGO Connect.`,
      type: 'approval',
      target_ngo_id: op.ngo_id || 'ngo-1',
      unread: true,
      created_at: new Date().toISOString()
    });
  };

  const handleRejectOpeningSubmit = async (e) => {
    e.preventDefault();
    if (!showRejectModal) return;
    const op = showRejectModal;
    const reason = rejectionReasonInput.trim() || 'Did not meet government verification guidelines.';

    const updated = await updateVolunteerOpeningStatus(op.id, 'rejected', reason);
    setAdminOpenings(updated);
    setShowRejectModal(null);
    setRejectionReasonInput('');

    await sendInAppNotification({
      id: `notif-${Date.now()}`,
      title: 'Volunteer Opening Not Approved',
      message: `Your volunteer opening "${op.title}" was not approved. Reason: ${reason}`,
      type: 'rejection',
      target_ngo_id: op.ngo_id || 'ngo-1',
      unread: true,
      created_at: new Date().toISOString()
    });
  };

  const handleCloseOpening = async (id) => {
    const updated = await updateVolunteerOpeningStatus(id, 'closed');
    setAdminOpenings(updated);
  };

  const handleDeleteOpeningAction = async (id) => {
    if (confirm('Are you sure you want to delete this opening?')) {
      const updated = await deleteVolunteerOpening(id);
      setAdminOpenings(updated);
    }
  };

  const handleAdminCreateOpening = async (e) => {
    e.preventDefault();
    const newOpening = {
      id: `op-${Date.now()}`,
      title: adminOpeningForm.title,
      ngo_id: 'admin-secretariat',
      ngo_name: adminOpeningForm.ngo_name,
      district: adminOpeningForm.district,
      category_tag: adminOpeningForm.category_tag,
      time_commitment: adminOpeningForm.time_commitment,
      blood_groups_needed: adminOpeningForm.blood_groups_needed || '',
      description: adminOpeningForm.description || '',
      status: 'active',
      created_at: new Date().toISOString(),
      approved_at: new Date().toISOString()
    };

    const updated = await saveVolunteerOpening(newOpening);
    setAdminOpenings(updated);
    setShowAdminPostOpeningModal(false);
    setAdminOpeningForm({
      title: '',
      ngo_name: 'State Secretariat / Govt Partner',
      district: 'Chennai',
      category_tag: 'High Impact',
      time_commitment: '4 hrs/week',
      blood_groups_needed: '',
      description: ''
    });
  };

  // Stat Card Modal & Searchable NGO State
  const [activeStatModal, setActiveStatModal] = useState(null); // 'camps' | 'alerts' | 'reports' | 'ngos'
  const [ngoSearchQuery, setNgoSearchQuery] = useState('');
  const [ngoCurrentPage, setNgoCurrentPage] = useState(1);
  const ngoItemsPerPage = 10;

  const ALL_VERIFIED_NGOS = [
    ...FEATURED_NGOS,
    ...ALL_TN_DISTRICTS.map((dist, idx) => ({
      id: `ngo-gen-${idx}`,
      name: `${dist} Social Welfare & Development Trust`,
      category: idx % 4 === 0 ? 'Medical & Health' : idx % 4 === 1 ? 'Education' : idx % 4 === 2 ? 'Environment' : 'Elderly Care',
      district: dist,
      regNo: `TN/${2018 + (idx % 8)}/${String(1000 + idx * 7).padStart(5, '0')}`,
      verified: true,
      established: `${2008 + (idx % 15)}`,
      volunteers: `${120 + idx * 12}+ Volunteers`
    }))
  ];

  const filteredVerifiedNGOs = ALL_VERIFIED_NGOS.filter(ngo => {
    const query = ngoSearchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      ngo.name.toLowerCase().includes(query) ||
      ngo.district.toLowerCase().includes(query) ||
      ngo.category.toLowerCase().includes(query) ||
      (ngo.regNo && ngo.regNo.toLowerCase().includes(query))
    );
  });

  const totalNgoPages = Math.max(1, Math.ceil(filteredVerifiedNGOs.length / ngoItemsPerPage));
  const paginatedNGOs = filteredVerifiedNGOs.slice(
    (ngoCurrentPage - 1) * ngoItemsPerPage,
    ngoCurrentPage * ngoItemsPerPage
  );

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
      contact_phone: '9342637020',
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
    contact_phone: '',
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
  const [pendingNGOList, setPendingNGOList] = useState([]);
  const [loadingPendingNGOs, setLoadingPendingNGOs] = useState(true);
  const [showNGORejectModal, setShowNGORejectModal] = useState(null);
  const [ngoRejectionReason, setNgoRejectionReason] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchCamps();
    fetchAdminEmergencies();
    fetchUserReports();
    loadPendingNGOs();
  }, []);

  const loadPendingNGOs = async () => {
    setLoadingPendingNGOs(true);
    try {
      const list = await getPendingNGOs();
      setPendingNGOList(list);
    } catch (err) {
      console.error('Error loading pending NGOs:', err);
    } finally {
      setLoadingPendingNGOs(false);
    }
  };

  const handleApproveNGO = async (ngo) => {
    if (authRole !== 'admin') {
      setToastMessage({ type: 'error', text: 'Unauthorized: Only administrators can approve NGOs.' });
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    try {
      await updateNGOStatus(ngo.id || ngo.reg_number, 'approved');
      setToastMessage({ type: 'success', text: `NGO "${ngo.name}" has been approved!` });
      setTimeout(() => setToastMessage(null), 3500);
      loadPendingNGOs();
    } catch (err) {
      setToastMessage({ type: 'error', text: err.message || 'Failed to approve NGO.' });
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleRejectNGOSubmit = async (e) => {
    e.preventDefault();
    if (!showNGORejectModal) return;
    if (authRole !== 'admin') {
      setToastMessage({ type: 'error', text: 'Unauthorized: Only administrators can reject NGOs.' });
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    const ngo = showNGORejectModal;
    const reason = ngoRejectionReason.trim() || 'Registration details could not be verified.';

    try {
      await updateNGOStatus(ngo.id || ngo.reg_number, 'rejected', reason);
      setToastMessage({ type: 'success', text: `NGO "${ngo.name}" has been rejected.` });
      setTimeout(() => setToastMessage(null), 3500);
      setShowNGORejectModal(null);
      setNgoRejectionReason('');
      loadPendingNGOs();
    } catch (err) {
      setToastMessage({ type: 'error', text: err.message || 'Failed to reject NGO.' });
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

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
      contact_phone: emergencyForm.contact_phone || '9342637020',
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
    setEmergencyForm({ title: '', description: '', emergency_type: 'blood_needed', district: 'Chennai', urgency_level: 'high', contact_phone: '', expires_at: '' });

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
      contact_phone: report.mobile_number || '',
      expires_at: ''
    });
    setSearchParams({ tab: 'emergency_alerts' });
    setShowEmergencyForm(true);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. ADMIN OVERVIEW PAGE (Rendered ONLY when visiting /admin with no ?tab= parameter) */}
      {!tabParam && (
        <>
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
            
            <div 
              onClick={() => setActiveStatModal('camps')}
              className="p-5 rounded-2xl bg-purple-50/80 hover:bg-purple-100/80 border border-purple-200 text-purple-950 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-purple-800 uppercase tracking-wider">Camps Managed</span>
                  <Calendar className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-extrabold">{campsList.length} Active Camps</h3>
                <p className="text-[11px] font-semibold text-purple-700 mt-1">Admin creation & attendee roster live</p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-purple-200/70 flex items-center justify-between text-[11px] font-bold text-purple-800 group-hover:text-purple-950">
                <span>View details</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveStatModal('alerts')}
              className="p-5 rounded-2xl bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200 text-rose-950 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-rose-800 uppercase tracking-wider">Active State Alerts</span>
                  <Siren className="w-5 h-5 text-rose-600 animate-pulse group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-extrabold">{adminEmergencies.filter(e => e.status === 'active').length} Public Alerts</h3>
                <p className="text-[11px] font-semibold text-rose-700 mt-1">Broadcasting to all 38 districts</p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-rose-200/70 flex items-center justify-between text-[11px] font-bold text-rose-800 group-hover:text-rose-950">
                <span>View details</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveStatModal('reports')}
              className="p-5 rounded-2xl bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 text-amber-950 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">User Emergency Reports</span>
                  <AlertTriangle className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-extrabold">{userReports.filter(r => r.status === 'pending').length} Pending Reports</h3>
                <p className="text-[11px] font-semibold text-amber-700 mt-1">{userReports.length} total reports received</p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-amber-200/70 flex items-center justify-between text-[11px] font-bold text-amber-800 group-hover:text-amber-950">
                <span>View details</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveStatModal('ngos')}
              className="p-5 rounded-2xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 text-blue-950 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">Verified NGOs</span>
                  <Building2 className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-extrabold">42,746 NGOs</h3>
                <p className="text-[11px] font-semibold text-blue-700 mt-1">Statewide Directory Audit</p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-blue-200/70 flex items-center justify-between text-[11px] font-bold text-blue-800 group-hover:text-blue-950">
                <span>View details</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>

          </div>
        </>
      )}

      {/* 2. SPECIFIC ADMIN SECTION PANELS (Rendered ONLY when a ?tab= query parameter is present) */}
      {tabParam && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          
          {/* TAB 1: CAMPS & EVENTS MANAGEMENT */}
          {tabParam === 'camps' && (
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
          {tabParam === 'emergency_alerts' && (
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
                      <p className="text-xs font-bold text-rose-700 mt-1">📞 Contact: +91 {emg.contact_phone || '9342637020'}</p>
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
          {(tabParam === 'community_reports' || tabParam === 'user_reports') && (
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
          {(tabParam === 'ngos' || tabParam === 'ngo_approvals') && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Pending NGO Verification Queue</h3>
                  <p className="text-xs text-slate-500 font-medium">Review and verify non-profit registration applications submitted by users.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 self-start sm:self-auto">
                  {pendingNGOList.length} Applications Pending
                </span>
              </div>

              {loadingPendingNGOs ? (
                <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-500">Loading pending verification queue...</p>
                </div>
              ) : pendingNGOList.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-10 text-center border border-slate-200 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">NGO Approvals Queue Empty</h4>
                  <p className="text-xs text-slate-500">There are currently no pending NGO applications waiting for admin verification.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingNGOList.map((ngo) => (
                    <div key={ngo.id || ngo.reg_number} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                            Reg No: {ngo.reg_number || ngo.regNo}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                            {ngo.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{ngo.name}</h4>
                        <p className="text-xs text-slate-600 font-medium">
                          📍 {ngo.district}, Tamil Nadu • 👤 Contact: <span className="font-bold text-slate-800">{ngo.contact_person}</span> (+91 {ngo.mobile_number}) • ✉️ {ngo.email}
                        </p>
                        {ngo.description && (
                          <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 mt-2">
                            "{ngo.description}"
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400 font-medium pt-0.5">
                          Submitted: {new Date(ngo.created_at || Date.now()).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleApproveNGO(ngo)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer active:scale-95"
                        >
                          Approve NGO ✓
                        </button>
                        <button
                          onClick={() => {
                            setShowNGORejectModal(ngo);
                            setNgoRejectionReason('');
                          }}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition cursor-pointer active:scale-95"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: VOLUNTEER OPENINGS WORKFLOW */}
          {tabParam === 'volunteer_openings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Volunteer Openings Control & Approval Queue</h2>
                  <p className="text-xs text-slate-500 font-medium">Review pending openings submitted by NGOs, approve live drives, or post direct Secretariat openings.</p>
                </div>

                <button
                  onClick={() => setShowAdminPostOpeningModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Direct Opening (Auto-Active)</span>
                </button>
              </div>

              {/* Sub-tabs Filter */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto custom-scrollbar">
                {[
                  { id: 'pending', label: `Pending (${adminOpenings.filter(o => o.status === 'pending').length})` },
                  { id: 'active', label: `Active (${adminOpenings.filter(o => o.status === 'active').length})` },
                  { id: 'rejected', label: `Rejected (${adminOpenings.filter(o => o.status === 'rejected').length})` },
                  { id: 'closed', label: `Closed (${adminOpenings.filter(o => o.status === 'closed').length})` },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setAdminOpeningFilter(t.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                      adminOpeningFilter === t.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Openings List */}
              {adminOpenings.filter(o => o.status === adminOpeningFilter).length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <Users className="w-10 h-10 mx-auto mb-2 text-slate-400 opacity-60" />
                  <p className="font-bold text-sm">No {adminOpeningFilter} volunteer openings found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {adminOpenings.filter(o => o.status === adminOpeningFilter).map((op) => (
                    <div key={op.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            {op.category_tag || 'Volunteer'}
                          </span>
                          {op.blood_groups_needed && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                              Needs: {op.blood_groups_needed}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            op.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            op.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                            op.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {op.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-semibold">📍 {op.district}</span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{op.title}</h3>
                        <p className="text-xs text-slate-600 font-medium">Submitted by: <span className="font-bold text-slate-800">{op.ngo_name}</span> • ⏰ {op.time_commitment}</p>
                        {op.description && <p className="text-xs text-slate-600 mt-1 bg-white p-3 rounded-xl border border-slate-200">{op.description}</p>}
                        {op.rejection_reason && (
                          <p className="text-xs font-bold text-rose-700 mt-2 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                            ⚠️ Rejection Reason: {op.rejection_reason}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Created: {new Date(op.created_at).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-2">
                          {op.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveOpening(op)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                              >
                                Approve Opening ✓
                              </button>
                              <button
                                onClick={() => setShowRejectModal(op)}
                                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {op.status === 'active' && (
                            <button
                              onClick={() => handleCloseOpening(op.id)}
                              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
                            >
                              Close Opening
                            </button>
                          )}

                          {op.status === 'closed' && (
                            <button
                              onClick={() => handleApproveOpening(op)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                            >
                              Re-open
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteOpeningAction(op.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* REJECT REASON MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-rose-700 text-white relative">
              <button onClick={() => setShowRejectModal(null)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 text-white"><X className="w-5 h-5" /></button>
              <h2 className="text-base font-black">Reject Volunteer Opening</h2>
              <p className="text-xs text-rose-100 font-medium">Specify a reason for rejecting "{showRejectModal.title}"</p>
            </div>

            <form onSubmit={handleRejectOpeningSubmit} className="p-5 space-y-4 text-xs font-semibold">
              <div>
                <label className="block mb-1 text-slate-700 font-bold">Rejection Reason *</label>
                <textarea
                  required
                  rows="3"
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="e.g. Needs clearer venue details or NGO verification documents..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-rose-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN DIRECT POST OPENING MODAL */}
      {showAdminPostOpeningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-blue-700 text-white relative">
              <button onClick={() => setShowAdminPostOpeningModal(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 text-white"><X className="w-5 h-5" /></button>
              <h2 className="text-base font-black">Post Official Volunteer Opening</h2>
              <p className="text-xs text-blue-100 font-medium">Direct publication (auto-active) on TN NGO Connect</p>
            </div>

            <form onSubmit={handleAdminCreateOpening} className="p-6 overflow-y-auto space-y-4 text-xs font-semibold">
              <div>
                <label className="block mb-1 text-slate-700 font-bold">Opening Title *</label>
                <input required type="text" value={adminOpeningForm.title} onChange={(e) => setAdminOpeningForm({...adminOpeningForm, title: e.target.value})} placeholder="e.g. Disaster Relief Pack Volunteer" className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>

              <div>
                <label className="block mb-1 text-slate-700 font-bold">Organization / Department Name *</label>
                <input required type="text" value={adminOpeningForm.ngo_name} onChange={(e) => setAdminOpeningForm({...adminOpeningForm, ngo_name: e.target.value})} placeholder="State Secretariat / Partner NGO" className="w-full p-2.5 rounded-xl border border-slate-300" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700 font-bold">District *</label>
                  <select value={adminOpeningForm.district} onChange={(e) => setAdminOpeningForm({...adminOpeningForm, district: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300">
                    {ALL_TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-700 font-bold">Category Tag *</label>
                  <select value={adminOpeningForm.category_tag} onChange={(e) => setAdminOpeningForm({...adminOpeningForm, category_tag: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300">
                    <option value="Urgent Need">Urgent Need</option>
                    <option value="High Impact">High Impact</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700 font-bold">Time Commitment *</label>
                  <input required type="text" value={adminOpeningForm.time_commitment} onChange={(e) => setAdminOpeningForm({...adminOpeningForm, time_commitment: e.target.value})} placeholder="e.g. 4 hrs/week" className="w-full p-2.5 rounded-xl border border-slate-300" />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700 font-bold">Blood Groups Needed (Optional)</label>
                  <input type="text" value={adminOpeningForm.blood_groups_needed} onChange={(e) => setAdminOpeningForm({...adminOpeningForm, blood_groups_needed: e.target.value})} placeholder="e.g. O+, O-, AB-" className="w-full p-2.5 rounded-xl border border-slate-300" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-700 font-bold">Description</label>
                <textarea rows="3" value={adminOpeningForm.description} onChange={(e) => setAdminOpeningForm({...adminOpeningForm, description: e.target.value})} placeholder="Provide role responsibilities and requirements..." className="w-full p-2.5 rounded-xl border border-slate-300 resize-none" />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md">
                Publish Opening Now
              </button>
            </form>
          </div>
        </div>
      )}

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700 font-bold">District Location *</label>
                  <select value={emergencyForm.district} onChange={(e) => setEmergencyForm({...emergencyForm, district: e.target.value})} className="w-full p-2.5 rounded-xl border border-slate-300">
                    {ALL_TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-700 font-bold">Contact Phone Number *</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-600 font-bold text-xs">+91</span>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      value={emergencyForm.contact_phone}
                      onChange={(e) => setEmergencyForm({...emergencyForm, contact_phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                      placeholder="9876543210"
                      className="w-full p-2.5 rounded-r-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-rose-600"
                    />
                  </div>
                </div>
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

      {/* STAT CARDS DETAILS MODAL */}
      {activeStatModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className={`p-5 text-white relative flex items-center justify-between ${
              activeStatModal === 'camps' ? 'bg-purple-700' :
              activeStatModal === 'alerts' ? 'bg-rose-700' :
              activeStatModal === 'reports' ? 'bg-amber-600' : 'bg-blue-700'
            }`}>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-80">Secretariat Live Audit</span>
                <h2 className="text-base sm:text-lg font-black">
                  {activeStatModal === 'camps' && 'Camps Managed Directory'}
                  {activeStatModal === 'alerts' && 'Active Public Emergency Alerts'}
                  {activeStatModal === 'reports' && 'User Emergency Reports Audit'}
                  {activeStatModal === 'ngos' && 'Verified NGO Directory'}
                </h2>
              </div>
              <button 
                onClick={() => setActiveStatModal(null)} 
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 text-xs flex-1">
              
              {/* 1. CAMPS MANAGED LIST */}
              {activeStatModal === 'camps' && (
                campsList.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-400 opacity-60" />
                    <p className="font-bold text-sm">No camps currently recorded</p>
                    <p className="text-xs text-slate-400">New camps created by administrators will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {campsList.map((evt) => (
                      <div key={evt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">
                            {evt.category} Camp ({evt.camp_type})
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Active
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-600 font-semibold text-xs">
                          <p>🏛️ Organizer: <span className="text-slate-800 font-bold">{evt.org}</span></p>
                          <p>📍 Location: <span className="text-slate-800 font-bold">{evt.location} ({evt.district})</span></p>
                          <p>⏰ Date & Time: <span className="text-slate-800 font-bold">{evt.date}</span></p>
                          <p>👥 Capacity: <span className="text-emerald-700 font-bold">{evt.spots_available || 100} spots remaining</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* 2. ACTIVE STATE ALERTS LIST */}
              {activeStatModal === 'alerts' && (
                adminEmergencies.filter(e => e.status === 'active').length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    <Siren className="w-10 h-10 mx-auto mb-2 text-slate-400 opacity-60" />
                    <p className="font-bold text-sm">No active public alerts broadcasted</p>
                    <p className="text-xs text-slate-400">All emergency broadcasts are currently marked resolved.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {adminEmergencies.filter(e => e.status === 'active').map((emg) => (
                      <div key={emg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white ${
                            emg.urgency_level === 'critical' ? 'bg-rose-600' : emg.urgency_level === 'high' ? 'bg-orange-500' : 'bg-amber-500 text-slate-950'
                          }`}>
                            {emg.urgency_level} Urgency
                          </span>
                          <span className="text-[11px] font-bold text-slate-600">
                            {emg.emergency_type} • District: {emg.district}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{emg.title}</h4>
                        <p className="text-xs text-slate-600 font-medium">{emg.description}</p>
                        <p className="text-xs font-bold text-rose-700 pt-1 border-t border-slate-200/60">
                          📞 Contact Hotline: +91 {emg.contact_phone || '9342637020'}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* 3. USER EMERGENCY REPORTS LIST */}
              {activeStatModal === 'reports' && (
                userReports.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-slate-400 opacity-60" />
                    <p className="font-bold text-sm">No user emergency reports logged</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userReports.map((report) => (
                      <div key={report.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                            {report.emergency_type}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            report.status === 'pending' ? 'bg-amber-100 text-amber-800' : report.status === 'reviewed' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Reporter: {report.reporter_name} (+91 {report.mobile_number})</h4>
                        <p className="text-xs font-bold text-slate-700">📍 Location: {report.location_detail} ({report.district})</p>
                        <p className="text-xs text-slate-600 font-medium bg-white p-2.5 rounded-xl border border-slate-200">
                          "{report.description}"
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold text-right">
                          Submitted: {new Date(report.reported_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* 4. VERIFIED NGOS SEARCHABLE & PAGINATED LIST */}
              {activeStatModal === 'ngos' && (
                <div className="space-y-3">
                  {/* Search box */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search verified NGOs by name, district, or category..."
                      value={ngoSearchQuery}
                      onChange={(e) => {
                        setNgoSearchQuery(e.target.value);
                        setNgoCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* NGO List */}
                  {paginatedNGOs.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-400 opacity-60" />
                      <p className="font-bold text-sm">No matching verified NGOs found</p>
                      <p className="text-xs text-slate-400">Try searching for a different district or category name.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {paginatedNGOs.map((ngo) => (
                        <div key={ngo.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                {ngo.category}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                ✓ Verified
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900">{ngo.name}</h4>
                            <p className="text-xs text-slate-600 font-medium">📍 {ngo.district}, Tamil Nadu • Reg: {ngo.regNo || 'TN/2026/0418'}</p>
                          </div>
                          <span className="text-[11px] font-bold text-slate-500 shrink-0">
                            Est: {ngo.established || '2016'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination Footer */}
                  {filteredVerifiedNGOs.length > 0 && (
                    <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600">
                      <span>Showing {((ngoCurrentPage - 1) * ngoItemsPerPage) + 1}–{Math.min(ngoCurrentPage * ngoItemsPerPage, filteredVerifiedNGOs.length)} of {filteredVerifiedNGOs.length} NGOs</span>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={ngoCurrentPage === 1}
                          onClick={() => setNgoCurrentPage(p => Math.max(1, p - 1))}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer font-bold"
                        >
                          Prev
                        </button>
                        <span>{ngoCurrentPage} / {totalNgoPages}</span>
                        <button
                          disabled={ngoCurrentPage >= totalNgoPages}
                          onClick={() => setNgoCurrentPage(p => Math.min(totalNgoPages, p + 1))}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white cursor-pointer font-bold"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

            </div>
          )}

        </div>

      </div>
    </div>
  )}

      {/* NGO REJECT REASON MODAL */}
      {showNGORejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-rose-700 text-white relative">
              <button onClick={() => setShowNGORejectModal(null)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 text-white"><X className="w-5 h-5" /></button>
              <h2 className="text-base font-black">Reject NGO Registration</h2>
              <p className="text-xs text-rose-100 font-medium">Specify a reason for rejecting "{showNGORejectModal.name}"</p>
            </div>

            <form onSubmit={handleRejectNGOSubmit} className="p-5 space-y-4 text-xs font-semibold">
              <div>
                <label className="block mb-1 text-slate-700 font-bold">Rejection Reason *</label>
                <textarea
                  required
                  rows="3"
                  value={ngoRejectionReason}
                  onChange={(e) => setNgoRejectionReason(e.target.value)}
                  placeholder="e.g. Registration number verification failed, missing registration certificate..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-rose-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNGORejectModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 ${
          toastMessage.type === 'success' ? 'bg-emerald-900 text-emerald-100 border-emerald-700' : 'bg-rose-900 text-rose-100 border-rose-700'
        }`}>
          <span>{toastMessage.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

    </div>
  );
}
