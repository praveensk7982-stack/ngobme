import React, { useState, useEffect, useRef } from 'react';
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

  const formRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [appliedOps, setAppliedOps] = useState([]);
  const [error, setError] = useState('');
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Selected Opening State for Apply Now
  const [selectedOpening, setSelectedOpening] = useState(null);

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

  const getMatchingCategory = (op) => {
    if (!op) return null;
    const cat = op.category || '';
    const title = (op.title || '').toLowerCase();
    
    if (cat === 'Education' || title.includes('tutor') || title.includes('school') || title.includes('teach') || title.includes('education')) return 'Education';
    if (cat === 'Blood Donation' || title.includes('blood')) return 'Blood Donation';
    if (cat === 'Environment' || title.includes('forest') || title.includes('planting') || title.includes('tree')) return 'Environment';
    if (cat === 'Elderly Care' || title.includes('senior') || title.includes('elderly') || title.includes('companion')) return 'Elderly Care';
    if (cat === 'Medical & Health' || title.includes('medical') || title.includes('health') || title.includes('doctor') || title.includes('eye')) return 'Medical & Health';
    if (cat === 'Disaster Relief' || title.includes('disaster') || title.includes('relief') || title.includes('flood')) return 'Disaster Relief';
    return cat || null;
  };

  const handleApplyNowClick = (op) => {
    setSelectedOpening(op);

    // Auto-fill district & matching interest category
    const matchedCategory = getMatchingCategory(op);
    setFormData(prev => {
      const currentInterests = prev.interests || [];
      const updatedInterests = matchedCategory && !currentInterests.includes(matchedCategory)
        ? [...currentInterests, matchedCategory]
        : currentInterests;

      return {
        ...prev,
        district: ALL_TN_DISTRICTS.includes(op.district) ? op.district : prev.district,
        interests: updatedInterests
      };
    });

    // Smooth scroll to form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Trigger 2-second visual highlight
    setIsHighlighted(true);
    setTimeout(() => {
      setIsHighlighted(false);
    }, 2000);
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
      const appliedForText = selectedOpening 
        ? `${selectedOpening.title} by ${selectedOpening.ngo}`
        : null;

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
          applied_for: appliedForText,
          opening_id: selectedOpening ? String(selectedOpening.id) : null,
          created_at: new Date().toISOString()
        });

      if (dbError) {
        console.warn('Supabase volunteer insert warning:', dbError.message);
      }

      // Also save to volunteer_applications if an opening was selected
      if (selectedOpening) {
        try {
          await supabase.from('volunteer_applications').insert({
            opening_id: String(selectedOpening.id),
            opening_title: selectedOpening.title,
            applicant_user_id: authUser?.uid || null,
            applicant_name: formData.name,
            mobile_number: formData.phone,
            email: formData.email,
            place: `${formData.district}, Tamil Nadu`,
            blood_group: formData.interests.includes('Blood Donation') ? formData.bloodGroup : null,
            status: 'pending',
            applied_at: new Date().toISOString()
          });
        } catch (appErr) {
          console.warn('Supabase volunteer_applications insert notice:', appErr);
        }

        setAppliedOps(prev => Array.from(new Set([...prev, String(selectedOpening.id)])));
      }
    } catch (err) {
      console.error('Volunteer registration error:', err);
    }

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
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
        <div 
          ref={formRef}
          className={`lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border transition-all duration-500 ${
            isHighlighted 
              ? 'border-blue-500 ring-4 ring-blue-500/40 shadow-2xl scale-[1.005]' 
              : 'border-slate-200/80 shadow-sm'
          }`}
        >
          <h2 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Volunteer Registration Form
          </h2>
          <p className="text-xs text-slate-500 font-medium mb-4">Complete your profile to receive instant volunteer drive invites</p>

          {/* Selected Opening Highlighted Banner */}
          {selectedOpening && (
            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 text-blue-950 flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">Selected Opportunity</p>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug truncate">
                    Applying for: <span className="text-blue-700 font-black">{selectedOpening.title}</span> — by <span className="text-slate-800">{selectedOpening.ngo}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOpening(null)}
                title="Clear selection"
                className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition cursor-pointer shrink-0 shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {submitted && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">Registration Profile Updated!</p>
                <p className="text-[11px] text-emerald-700 font-medium">
                  {selectedOpening 
                    ? `Application for "${selectedOpening.title}" submitted! Matching NGOs in ${formData.district} will contact you at ${formData.phone}.`
                    : `Matching NGOs in ${formData.district} will send drive notifications to ${formData.phone}.`}
                </p>
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
              <span>{selectedOpening ? `Submit Application for ${selectedOpening.title}` : 'Submit Volunteer Profile'}</span>
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
                const isApplied = appliedOps.includes(String(op.id));
                const neededBgs = op.neededBloodGroups || (op.category === 'Blood Donation' ? ['O+', 'O-', 'AB-'] : null);

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

                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 pt-2 border-t border-slate-200/60">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-600" /> {op.commitment}</span>
                      
                      {isApplied ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t('volunteer.alreadyApplied', 'Applied ✓')}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApplyNowClick(op)}
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

    </div>
  );
}
