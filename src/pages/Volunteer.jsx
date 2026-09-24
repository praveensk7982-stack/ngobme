import React, { useState } from 'react';
import { Users, CheckCircle2, MapPin, Clock, Award, Send, Sparkles, HeartHandshake } from 'lucide-react';
import { ALL_TN_DISTRICTS, VOLUNTEER_OPPORTUNITIES } from '../data/mockData';

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false);
  const [appliedOps, setAppliedOps] = useState([]);
  const [formData, setFormData] = useState({
    name: 'Dharshini Raj',
    email: 'dharshini@ngo-tn.org',
    phone: '+91 94440 88776',
    district: 'Chennai',
    availability: 'Weekends (Sat & Sun)',
    interests: ['Medical & Health', 'Education']
  });

  const handleCheckboxToggle = (cause) => {
    if (formData.interests.includes(cause)) {
      setFormData({ ...formData, interests: formData.interests.filter(i => i !== cause) });
    } else {
      setFormData({ ...formData, interests: [...formData.interests, cause] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleApplyOpp = (opId) => {
    if (!appliedOps.includes(opId)) {
      setAppliedOps([...appliedOps, opId]);
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

                return (
                  <div key={op.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${op.badgeColor}`}>
                        {op.badge}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">{op.district}</span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{op.title}</h3>
                    <p className="text-[11px] text-slate-600 font-medium">by <span className="font-semibold text-slate-800">{op.ngo}</span></p>

                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 pt-2 border-t border-slate-200/60">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-600" /> {op.commitment}</span>
                      
                      {isApplied ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Applied</span>
                      ) : (
                        <button
                          onClick={() => handleApplyOpp(op.id)}
                          className="text-blue-600 hover:text-blue-800 font-bold underline"
                        >
                          Apply Now →
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
