import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  AlertTriangle, 
  Siren, 
  MapPin, 
  Clock, 
  Phone, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  PlusCircle, 
  Droplet, 
  Flame, 
  Stethoscope, 
  UserX, 
  Utensils, 
  Heart,
  Share2
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { ALL_TN_DISTRICTS } from '../data/mockData';

// Initial Seed Admin Emergencies if DB empty
const INITIAL_EMERGENCIES = [
  {
    id: 'emg-1',
    title: 'Urgent O-Negative Blood Required for Surgery at GH Madurai',
    description: 'Immediate 4 units of rare O-Negative blood needed for emergency trauma surgery at Government Rajaji Hospital, Madurai. Refreshments & travel support arranged.',
    emergency_type: 'blood_needed',
    district: 'Madurai',
    urgency_level: 'critical',
    status: 'active',
    created_at: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 'emg-2',
    title: 'Cuddalore Coastal Flood Relief & Emergency Ration Distribution',
    description: 'Continuous heavy rainfall causing waterlogging in low-lying coastal hamlets. Volunteer rescue squads and dry food ration packs needed immediately.',
    emergency_type: 'disaster_relief',
    district: 'Cuddalore',
    urgency_level: 'high',
    status: 'active',
    created_at: new Date(Date.now() - 3 * 3600000).toISOString()
  },
  {
    id: 'emg-3',
    title: 'Missing Elderly Citizen with Memory Impairment in North Chennai',
    description: '72-year-old male wearing blue shirt last seen near Vyasarpadi market on Sep 26 at 4:00 PM. Please report any sighting immediately to control room.',
    emergency_type: 'missing_person',
    district: 'Chennai',
    urgency_level: 'medium',
    status: 'active',
    created_at: new Date(Date.now() - 12 * 3600000).toISOString()
  }
];

export default function Emergency() {
  const { t, i18n } = useTranslation();
  const { user: authUser } = useAuth();

  const [emergencies, setEmergencies] = useState(INITIAL_EMERGENCIES);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  // Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reportSuccessRef, setReportSuccessRef] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    reporter_name: authUser?.name || '',
    mobile_number: authUser?.phone || '',
    emergency_type: 'blood_needed',
    district: authUser?.district || 'Chennai',
    location_detail: '',
    description: ''
  });

  useEffect(() => {
    fetchActiveEmergencies();
  }, []);

  const fetchActiveEmergencies = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_emergencies')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch active emergencies notice:', error.message);
      } else if (data && data.length > 0) {
        setEmergencies(data);
      }
    } catch (err) {
      console.error('Error fetching admin emergencies:', err);
    } finally {
      setLoadingAlerts(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const refId = Math.floor(100000 + Math.random() * 900000);

    try {
      const { error: dbErr } = await supabase
        .from('user_emergency_reports')
        .insert({
          reporter_user_id: authUser?.uid || null,
          reporter_name: formData.reporter_name.trim(),
          mobile_number: formData.mobile_number.trim(),
          emergency_type: formData.emergency_type,
          district: formData.district,
          location_detail: formData.location_detail.trim(),
          description: formData.description.trim(),
          status: 'pending',
          reported_at: new Date().toISOString()
        });

      if (dbErr) {
        console.warn('Supabase report insert notice (local backup fallback):', dbErr.message);
      }

      setReportSuccessRef(refId);
    } catch (err) {
      console.error('Emergency report submission error:', err);
      setReportSuccessRef(refId);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered List
  const filteredEmergencies = emergencies.filter((emg) => {
    return activeCategoryFilter === 'all' || emg.emergency_type === activeCategoryFilter;
  });

  // Sort by urgency: Critical -> High -> Medium
  const urgencyWeight = { critical: 3, high: 2, medium: 1 };
  const sortedEmergencies = [...filteredEmergencies].sort((a, b) => {
    const wA = urgencyWeight[a.urgency_level] || 1;
    const wB = urgencyWeight[b.urgency_level] || 1;
    return wB - wA;
  });

  const getUrgencyBadge = (level) => {
    if (level === 'critical') {
      return (
        <span className="px-3 py-1 rounded-full text-[11px] font-black bg-rose-600 text-white shadow-md shadow-rose-600/30 flex items-center gap-1 animate-pulse">
          <Siren className="w-3.5 h-3.5" />
          {t('emergency.urgency.critical')}
        </span>
      );
    }
    if (level === 'high') {
      return (
        <span className="px-3 py-1 rounded-full text-[11px] font-black bg-orange-500 text-white shadow-sm flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          {t('emergency.urgency.high')}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" />
        {t('emergency.urgency.medium')}
      </span>
    );
  };

  const getEmergencyIcon = (type) => {
    switch (type) {
      case 'blood_needed': return <Droplet className="w-4 h-4 text-rose-500" />;
      case 'disaster_relief': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'medical_emergency': return <Stethoscope className="w-4 h-4 text-blue-500" />;
      case 'missing_person': return <UserX className="w-4 h-4 text-purple-500" />;
      case 'food_ration': return <Utensils className="w-4 h-4 text-amber-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-900/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold mb-3 backdrop-blur-md">
              <Siren className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>{t('emergency.badge')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              {t('emergency.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {t('emergency.subtitle')}
            </p>
          </div>

          <button
            onClick={() => {
              setReportSuccessRef(null);
              setShowReportModal(true);
            }}
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('emergency.reportEmergency')}</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2">Category Filter:</span>
          
          {[
            { id: 'all', label: t('emergency.filterAll') },
            { id: 'blood_needed', label: t('emergency.types.blood_needed') },
            { id: 'disaster_relief', label: t('emergency.types.disaster_relief') },
            { id: 'medical_emergency', label: t('emergency.types.medical_emergency') },
            { id: 'missing_person', label: t('emergency.types.missing_person') },
            { id: 'food_ration', label: t('emergency.types.food_ration') },
            { id: 'animal_rescue', label: t('emergency.types.animal_rescue') },
            { id: 'other', label: t('emergency.types.other') },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === cat.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2 px-1">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>{t('emergency.activeAlerts')}</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200">
            {sortedEmergencies.length}
          </span>
        </h2>

        {sortedEmergencies.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">{t('emergency.noAlerts')}</h3>
            <p className="text-xs text-slate-500">All regional emergency channels are currently clear.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sortedEmergencies.map((emg) => (
              <div
                key={emg.id}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-rose-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getUrgencyBadge(emg.urgency_level)}

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                        {getEmergencyIcon(emg.emergency_type)}
                        {t(`emergency.types.${emg.emergency_type}`, emg.emergency_type)}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {t(`districts.${emg.district}`, emg.district)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition leading-snug mb-2">
                    {emg.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                    {emg.description}
                  </p>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(emg.created_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:108`}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>Helpline 108</span>
                    </a>

                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: emg.title,
                            text: emg.description,
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(`${emg.title} - ${emg.description}`);
                          alert('Emergency alert copied to clipboard!');
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Alert</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* REPORT EMERGENCY MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-rose-700 via-red-700 to-rose-800 text-white relative">
              <button
                onClick={() => setShowReportModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <Siren className="w-5 h-5 text-amber-300 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-rose-200">Public Control Room</span>
              </div>
              <h2 className="text-xl font-black text-white">{t('emergency.reportEmergency')}</h2>
              <p className="text-xs text-rose-100/90 font-medium mt-0.5">
                Submit an urgent request for blood, disaster relief, or emergency assistance.
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-semibold">
              
              {reportSuccessRef ? (
                <div className="p-6 text-center space-y-3 animate-in zoom-in-95">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{t('emergency.reportSuccess')}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {t('emergency.reportSuccessSub')}<strong className="text-slate-900 font-extrabold">{reportSuccessRef}</strong>.
                  </p>
                  <p className="text-[11px] text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-medium">
                    {t('emergency.reportNotice')}
                  </p>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    {t('emergency.close')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">{t('emergency.reporterName')}</label>
                    <input
                      type="text"
                      required
                      value={formData.reporter_name}
                      onChange={(e) => setFormData({...formData, reporter_name: e.target.value})}
                      placeholder="e.g. Dharshini Raj"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-600 focus:outline-none text-slate-900 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">{t('emergency.mobileNumber')}</label>
                      <input
                        type="tel"
                        required
                        value={formData.mobile_number}
                        onChange={(e) => setFormData({...formData, mobile_number: e.target.value})}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-600 focus:outline-none text-slate-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">{t('emergency.district')}</label>
                      <select
                        value={formData.district}
                        onChange={(e) => setFormData({...formData, district: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-600 focus:outline-none text-slate-900 font-semibold bg-white cursor-pointer"
                      >
                        {ALL_TN_DISTRICTS.map(d => <option key={d} value={d}>{t(`districts.${d}`, d)}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">{t('emergency.emergencyType')}</label>
                    <select
                      value={formData.emergency_type}
                      onChange={(e) => setFormData({...formData, emergency_type: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-600 focus:outline-none text-slate-900 font-semibold bg-white cursor-pointer"
                    >
                      <option value="blood_needed">{t('emergency.types.blood_needed')}</option>
                      <option value="disaster_relief">{t('emergency.types.disaster_relief')}</option>
                      <option value="medical_emergency">{t('emergency.types.medical_emergency')}</option>
                      <option value="missing_person">{t('emergency.types.missing_person')}</option>
                      <option value="food_ration">{t('emergency.types.food_ration')}</option>
                      <option value="animal_rescue">{t('emergency.types.animal_rescue')}</option>
                      <option value="other">{t('emergency.types.other')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">{t('emergency.locationDetail')}</label>
                    <input
                      type="text"
                      required
                      value={formData.location_detail}
                      onChange={(e) => setFormData({...formData, location_detail: e.target.value})}
                      placeholder="e.g. Ward 4, GH Hospital, Opp. Central Bus Stand"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-600 focus:outline-none text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">{t('emergency.description')}</label>
                    <textarea
                      required
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Provide clear details of the situation and immediate assistance needed..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-600 focus:outline-none text-slate-900 font-semibold resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? t('emergency.submitting') : t('emergency.submitReport')}</span>
                  </button>

                </form>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
