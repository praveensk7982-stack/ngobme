import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Award, 
  Send, 
  Sparkles, 
  HeartHandshake, 
  Droplet,
  AlertCircle,
  X
} from 'lucide-react';
import { ALL_TN_DISTRICTS, VOLUNTEER_OPPORTUNITIES } from '../data/mockData';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function Volunteer() {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();

  const [submitted, setSubmitted] = useState(false);
  const [appliedOps, setAppliedOps] = useState([]);
  const [bloodWarnings, setBloodWarnings] = useState({}); // { [opId]: warningMessage }
  const [error, setError] = useState('');

  // Modal State for Apply Now
  const [selectedOpening, setSelectedOpening] = useState(null);
  const [applyForm, setApplyForm] = useState({
    applicant_name: authUser?.name || 'Dharshini Raj',
    mobile_number: authUser?.phone || '9444088776',
    email: authUser?.email || 'dharshini@ngo-tn.org',
    message: '',
    blood_group: 'O+'
  });
  const [submittingApply, setSubmittingApply] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: authUser?.name || 'Dharshini Raj',
    email: authUser?.email || 'dharshini@ngo-tn.org',
    phone: authUser?.phone || '9444088776',
    district: authUser?.district || 'Chennai',
    availability: 'Weekends (Sat & Sun)',
    interests: ['Medical & Health', 'Blood Donation'],
    bloodGroup: 'O+'
  });

  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Load user's existing applications on mount
  useEffect(() => {
    fetchUserApplications();
  }, [authUser]);

  const fetchUserApplications = async () => {
    try {
      let query = supabase.from('volunteer_applications').select('opening_id');
      if (authUser?.uid) {
        query = query.eq('applicant_user_id', authUser.uid);
      } else if (formData.phone) {
        query = query.eq('mobile_number', formData.phone);
      }

      const { data, error: fetchErr } = await query;
      if (!fetchErr && data && data.length > 0) {
        const ids = data.map(item => item.opening_id);
        setAppliedOps(prev => Array.from(new Set([...prev, ...ids])));
      }
    } catch (err) {
      console.warn('Fetch applications fallback warning:', err);
    }
  };

  const handleCheckboxToggle = (cause) => {
    if (formData.interests.includes(cause)) {
      setFormData({ 
        ...formData, 
        interests: formData.interests.filter(i => i !== cause) 
      });
    } else {
      setFormData({ 
        ...formData, 
        interests: [...formData.interests, cause] 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation: If Blood Donation is checked, bloodGroup is required
    if (formData.interests.includes('Blood Donation') && !formData.bloodGroup) {
      setError('Please select your blood group for blood donation registration.');
      return;
    }

    try {
      // Save volunteer application profile to Supabase volunteers table
      const { error: dbError } = await supabase
        .from('volunteers')
        .insert({
          user_id: authUser?.uid || null,
          full_name: formData.name,
          email: formData.email,
          mobile_number: formData.phone,
          district: formData.district,
          availability: formData.availability,
          interests: formData.interests,
          blood_group: formData.interests.includes('Blood Donation') ? formData.bloodGroup : null,
          created_at: new Date().toISOString()
        });

      if (dbError) {
        console.warn('Supabase volunteer insert warning:', dbError.message);
      }
    } catch (err) {
      console.error('Volunteer registration error:', err);
    }

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleOpenApplyModal = (op) => {
    const needed = op.neededBloodGroups || (op.category === 'Blood Donation' ? ['O+', 'O-', 'AB-'] : null);
    if (needed) {
      const userBg = applyForm.blood_group || formData.bloodGroup;
      const isMatch = userBg && needed.includes(userBg);
      if (!isMatch) {
        setBloodWarnings(prev => ({
          ...prev,
          [op.id]: `This request needs ${needed.join(', ')} blood group. Your registered blood group is ${userBg || 'Not set'}. Priority is given to matching blood types.`
        }));
      } else {
        setBloodWarnings(prev => ({ ...prev, [op.id]: null }));
      }
    }

    setSelectedOpening(op);
    setApplySuccess(false);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedOpening) return;
    setSubmittingApply(true);

    const applicationData = {
      opening_id: String(selectedOpening.id),
      opening_title: selectedOpening.title,
      applicant_user_id: authUser?.uid || null,
      applicant_name: applyForm.applicant_name.trim(),
      mobile_number: applyForm.mobile_number.trim(),
      email: applyForm.email.trim() || null,
      message: applyForm.message.trim() || null,
      blood_group: selectedOpening.category === 'Blood Donation' || selectedOpening.neededBloodGroups ? applyForm.blood_group : null,
      status: 'pending',
      applied_at: new Date().toISOString()
    };

    try {
      const { error: insertErr } = await supabase
        .from('volunteer_applications')
        .insert(applicationData);

      if (insertErr) {
        console.warn('Supabase volunteer_applications insert notice:', insertErr.message);
      }

      setAppliedOps(prev => Array.from(new Set([...prev, String(selectedOpening.id)])));
      setApplySuccess(true);
      setTimeout(() => {
        setSelectedOpening(null);
        setApplySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Volunteer application submit error:', err);
      setAppliedOps(prev => Array.from(new Set([...prev, String(selectedOpening.id)])));
      setApplySuccess(true);
      setTimeout(() => {
        setSelectedOpening(null);
        setApplySuccess(false);
      }, 2000);
    } finally {
      setSubmittingApply(false);
    }
  };

  const causesList = ['Medical & Health', 'Blood Donation', 'Education', 'Environment', 'Elderly Care', 'Disaster Relief'];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold mb-3">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span>Join 3,642+ Active Volunteers Across Tamil Nadu</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Volunteer Network & Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Offer your skills and time to empower local communities. Register your profile to get matched with verified non-profits in your home district.
          </p>
        </div>
      </div>

      {/* Main Grid: Registration Form Left, Active Opportunities Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Volunteer Registration Form
          </h2>
          <p className="text-xs text-slate-500 font-medium mb-6">Complete your profile to receive instant volunteer drive invites</p>

          {submitted && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">Registration Profile Updated!</p>
                <p className="text-[11px] text-emerald-700 font-medium">Matching NGOs in {formData.district} will send drive notifications to {formData.phone}.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-700 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-700 block mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">District</label>
                <select 
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-white text-slate-800 font-semibold cursor-pointer"
                >
                  {ALL_TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Availability</label>
              <select 
                value={formData.availability}
                onChange={(e) => setFormData({...formData, availability: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-white text-slate-800 cursor-pointer"
              >
                <option value="Weekends (Sat & Sun)">Weekends (Sat & Sun)</option>
                <option value="Weekdays (Mon-Fri)">Weekdays (Mon-Fri)</option>
                <option value="Emergency Calls Only">Emergency / Disaster Response Calls Only</option>
                <option value="Flexible Remote">Flexible Remote Support</option>
              </select>
            </div>

            {/* Checkboxes Area of Interest */}
            <div>
              <label className="text-slate-700 block mb-2">Areas of Interest (Select all that apply)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {causesList.map((cause) => {
                  const isChecked = formData.interests.includes(cause);

                  return (
                    <label 
                      key={cause}
                      className={`p-2.5 rounded-xl border text-[11px] font-bold cursor-pointer transition flex items-center gap-2 ${
                        isChecked 
                          ? 'bg-blue-50 text-blue-800 border-blue-400 shadow-2xs' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxToggle(cause)}
                        className="accent-blue-600 rounded"
                      />
                      <span>{cause}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* CONDITIONAL BLOOD GROUP FIELD (Only shown when "Blood Donation" is checked) */}
            {formData.interests.includes('Blood Donation') && (
              <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200 animate-in fade-in space-y-1.5">
                <label className="text-rose-950 font-extrabold block text-xs flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Blood Group * (Required for Emergency Blood Matching)</span>
                </label>
                <p className="text-[11px] text-rose-700 font-medium">
                  Used to notify you for urgent blood donation requests in your district.
                </p>
                <select
                  required
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 focus:border-rose-600 focus:outline-none bg-white text-slate-800 font-bold text-xs cursor-pointer"
                >
                  <option value="">Select your Blood Group...</option>
                  {bloodGroupOptions.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95 mt-4"
            >
              <Send className="w-4 h-4" />
              <span>Submit Volunteer Profile</span>
            </button>

          </form>
        </div>

        {/* Right Opportunities Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Active Volunteer Openings
            </h2>
            <p className="text-xs text-slate-500 font-medium mb-4">Direct recruitment by verified non-profits</p>

            <div className="space-y-3">
              {VOLUNTEER_OPPORTUNITIES.map((op) => {
                const isApplied = appliedOps.includes(op.id);
                const neededBgs = op.neededBloodGroups || (op.category === 'Blood Donation' ? ['O+', 'O-', 'AB-'] : null);
                const warningMsg = bloodWarnings[op.id];

                return (
                  <div key={op.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    
                    {/* Badges Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${op.badgeColor}`}>
                          {op.badge}
                        </span>

                        {/* Needed Blood Group Badge for blood emergency openings */}
                        {neededBgs && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                            <Droplet className="w-3 h-3 text-rose-600" /> Needs: {neededBgs.join(', ')}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-500 font-semibold">{op.district}</span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{op.title}</h3>
                    <p className="text-[11px] text-slate-600 font-medium">by <span className="font-semibold text-slate-800">{op.ngo}</span></p>

                    {/* Gentle Blood Group Mismatch Warning Banner */}
                    {warningMsg && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold flex items-start gap-1.5 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{warningMsg}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 pt-2 border-t border-slate-200/60">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-600" /> {op.commitment}</span>
                      
                      {isApplied ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t('volunteer.alreadyApplied', 'Applied ✓')}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenApplyModal(op)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1 cursor-pointer active:scale-95"
                        >
                          <span>{t('volunteer.applyNow', 'Apply Now →')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* APPLY NOW MODAL OVERLAY */}
      {selectedOpening && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white relative">
              <button
                onClick={() => setSelectedOpening(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-[10px] uppercase font-black tracking-wider text-blue-200 block mb-1">
                {t('volunteer.applyModalTitle', 'Volunteer Application')}
              </span>
              <h2 className="text-lg font-black text-white leading-snug">{selectedOpening.title}</h2>
              <p className="text-xs text-blue-100/90 font-semibold mt-0.5">by {selectedOpening.ngo} ({selectedOpening.district})</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-semibold">
              {applySuccess ? (
                <div className="p-6 text-center space-y-3 animate-in zoom-in-95">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{t('volunteer.applySuccess', 'Application Submitted Successfully!')}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    <strong className="text-slate-900 font-bold">{selectedOpening.ngo}</strong> {t('volunteer.applySuccessSub', 'will review your application and contact you soon.')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">{t('volunteer.applicantName', 'Full Name *')}</label>
                    <input
                      type="text"
                      required
                      value={applyForm.applicant_name}
                      onChange={(e) => setApplyForm({ ...applyForm, applicant_name: e.target.value })}
                      placeholder="e.g. Dharshini Raj"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none text-slate-900 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">{t('volunteer.mobileNumber', 'Mobile Contact Number *')}</label>
                      <div className="flex items-center">
                        <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-600 font-bold text-xs">+91</span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={applyForm.mobile_number}
                          onChange={(e) => setApplyForm({ ...applyForm, mobile_number: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          placeholder="9444088776"
                          className="w-full p-2.5 rounded-r-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">{t('volunteer.emailAddress', 'Email Address (Optional)')}</label>
                      <input
                        type="email"
                        value={applyForm.email}
                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                        placeholder="dharshini@ngo-tn.org"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* CONDITIONAL BLOOD GROUP CONFIRMATION FIELD */}
                  {(selectedOpening.category === 'Blood Donation' || selectedOpening.neededBloodGroups) && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
                      <label className="text-rose-950 font-extrabold text-xs flex items-center gap-1.5">
                        <Droplet className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{t('volunteer.confirmBloodGroup', 'Blood Group Confirmation *')}</span>
                      </label>
                      <select
                        required
                        value={applyForm.blood_group}
                        onChange={(e) => setApplyForm({ ...applyForm, blood_group: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 focus:border-rose-600 focus:outline-none bg-white text-slate-900 font-bold text-xs cursor-pointer"
                      >
                        {bloodGroupOptions.map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">{t('volunteer.whyVolunteer', 'Why do you want to volunteer for this drive? (Optional)')}</label>
                    <textarea
                      rows="3"
                      value={applyForm.message}
                      onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
                      placeholder="Briefly share your experience or reason for applying..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none text-slate-900 font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingApply}
                    className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submittingApply ? t('volunteer.submitting', 'Submitting Application...') : t('volunteer.submitApplication', 'Submit Application')}</span>
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
