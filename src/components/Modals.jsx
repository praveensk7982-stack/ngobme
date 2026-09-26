import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Heart, 
  Building2, 
  Calendar, 
  UserPlus, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Globe, 
  Star,
  IndianRupee,
  Share2
} from 'lucide-react';
import { ALL_TN_DISTRICTS } from '../data/mockData';

export function NGOProfileModal({ ngo, onClose, onOpenDonateModal }) {
  if (!ngo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative animate-in zoom-in-95 duration-200">
        
        {/* Banner Header */}
        <div className={`p-6 ${ngo.logoBg} text-white relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white font-black text-xl flex items-center justify-center border border-white/30 shadow-lg">
              {ngo.logoInitials}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold backdrop-blur-sm border border-white/20">
                  {ngo.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-[10px] font-bold backdrop-blur-sm border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" /> Govt Verified
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">{ngo.name}</h2>
              <p className="text-xs text-blue-100 font-semibold flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" /> {ngo.district}, Tamil Nadu • Estd. {ngo.established}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Key Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Impact</span>
              <p className="text-xs font-extrabold text-slate-900">{ngo.impact}</p>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Volunteers</span>
              <p className="text-xs font-extrabold text-blue-600">{ngo.volunteers}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Rating</span>
              <p className="text-xs font-extrabold text-amber-600 flex items-center justify-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-current" /> {ngo.rating}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">About Organization</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">{ngo.description}</p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-700">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" /> <span>+91 94440 12345 / 044-2435 8899</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" /> <span>contact@{ngo.id}.org</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" /> <span>www.{ngo.id}.org</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
          >
            Close
          </button>

          <button 
            onClick={() => {
              onClose();
              onOpenDonateModal();
            }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-current text-rose-300" />
            <span>Donate to this NGO</span>
          </button>
        </div>

      </div>
    </div>
  );
}


export function VolunteerModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', district: 'Chennai', cause: 'Medical & Health' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-200 relative animate-in zoom-in-95">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Volunteer Registration</h2>
            <p className="text-xs text-slate-500 font-medium">Join Tamil Nadu's largest volunteer movement</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Registration Successful!</h3>
            <p className="text-xs text-slate-600">
              Thank you, <span className="font-bold">{formData.name || 'Volunteer'}</span>! Local NGOs in {formData.district} will contact you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs font-semibold">
            <div>
              <label className="text-slate-600 block mb-1">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Dharshini Raj"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Mobile Number</label>
              <input 
                type="tel" 
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">District</label>
              <select 
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-white"
              >
                {ALL_TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Primary Interest Area</label>
              <select 
                value={formData.cause}
                onChange={(e) => setFormData({...formData, cause: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-white"
              >
                <option value="Medical & Health">Medical & Health Camps</option>
                <option value="Blood Donation">Blood & Plasma Drives</option>
                <option value="Education">Underprivileged Education</option>
                <option value="Environment">Plantation & Lake Cleanup</option>
                <option value="Disaster Relief">Flood & Emergency Response</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition mt-2"
            >
              Submit Volunteer Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


export function DonateModal({ onClose }) {
  const [amount, setAmount] = useState('1000');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-200 relative animate-in zoom-in-95">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Make a Donation</h2>
            <p className="text-xs text-slate-500 font-medium">100% Tax Exempt under Section 80G</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Donation Complete!</h3>
            <p className="text-xs text-slate-600">
              Thank you for contributing <span className="font-bold text-emerald-700">₹{amount}</span>! Your 80G tax receipt has been sent to your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            
            {/* Amount Presets */}
            <div>
              <label className="text-slate-600 block mb-2">Select Donation Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {['500', '1000', '2500'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2.5 rounded-xl border text-xs font-extrabold transition ${
                      amount === amt 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Custom Amount (₹)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none text-sm font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Payment Method</label>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input type="radio" name="pay" defaultChecked className="accent-emerald-600" />
                  <span>UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-600">
                  <input type="radio" name="pay" className="accent-emerald-600" />
                  <span>Credit / Debit Card / NetBanking</span>
                </label>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
            >
              Proceed to Donate ₹{amount || 0}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


export function RegisterNGOModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-200 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Add / Register NGO</h2>
            <p className="text-xs text-slate-500 font-medium">Get listed on TN NGO Connect</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold">Application Submitted!</h3>
            <p className="text-xs text-slate-600">Our verification team will inspect your Darpan / 80G credentials and approve within 48 hours.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); setTimeout(onClose, 2500); }} className="space-y-3 text-xs font-semibold">
            <div>
              <label className="text-slate-600 block mb-1">NGO Name</label>
              <input required type="text" placeholder="e.g. Pasumai Trust" className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label className="text-slate-600 block mb-1">NITI Aayog Darpan ID / Reg No.</label>
              <input required type="text" placeholder="TN/2024/0987654" className="w-full px-3.5 py-2 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label className="text-slate-600 block mb-1">Headquarters District</label>
              <select className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white">
                {ALL_TN_DISTRICTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md mt-2">
              Submit NGO for Verification
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


export function PostEventModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState('en');
  const [formData, setFormData] = useState({
    title_en: '',
    title_ta: '',
    title_hi: '',
    category: 'Medical & Health Camp',
    camp_type: 'private',
    location_en: '',
    location_ta: '',
    location_hi: '',
    description_en: '',
    description_ta: '',
    description_hi: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 2500);
  };

  const isTaIncomplete = !formData.title_ta.trim() || !formData.location_ta.trim() || !formData.description_ta.trim();
  const isHiIncomplete = !formData.title_hi.trim() || !formData.location_hi.trim() || !formData.description_hi.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Post Event or Camp</h2>
            <p className="text-xs text-slate-500 font-medium">Broadcast your upcoming drive across TN in multiple languages</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-purple-600 mx-auto" />
            <h3 className="text-base font-bold">Event Published!</h3>
            <p className="text-xs text-slate-600">Your camp is now live with multi-language support on TN NGO Connect.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            
            {/* Category & Camp Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">Event Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-purple-600"
                >
                  <option>Medical & Health Camp</option>
                  <option>Blood & Plasma Drive</option>
                  <option>Tree Plantation & Eco Drive</option>
                  <option>Food & Ration Distribution</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Organizer Type</label>
                <select 
                  value={formData.camp_type}
                  onChange={(e) => setFormData({...formData, camp_type: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-purple-600"
                >
                  <option value="government">Government Camp</option>
                  <option value="private">NGO / Private Camp</option>
                </select>
              </div>
            </div>

            {/* Language Selector Tabs */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-700 font-bold">Multilingual Information</label>
                <span className="text-[10px] text-slate-400 font-medium">Fill all languages for full accessibility</span>
              </div>

              <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                    activeLangTab === 'en' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇬🇧 English <span className="text-[10px] text-rose-500">*</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('ta')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                    activeLangTab === 'ta' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇮🇳 தமிழ் (Tamil) {isTaIncomplete && <span className="w-2 h-2 rounded-full bg-amber-500" title="Incomplete"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('hi')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                    activeLangTab === 'hi' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇮🇳 हिंदी (Hindi) {isHiIncomplete && <span className="w-2 h-2 rounded-full bg-amber-500" title="Incomplete"></span>}
                </button>
              </div>
            </div>

            {/* Tab 1: English */}
            {activeLangTab === 'en' && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                <div>
                  <label className="text-slate-700 block mb-1">Event Title (English) *</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Free Eye Checkup Camp 2026" 
                    value={formData.title_en}
                    onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600" 
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Venue Location & District (English) *</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="GH Grounds, Coimbatore" 
                    value={formData.location_en}
                    onChange={(e) => setFormData({...formData, location_en: e.target.value})}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600" 
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Description (English)</label>
                  <textarea 
                    rows="2"
                    placeholder="Brief description of the camp..." 
                    value={formData.description_en}
                    onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 resize-none" 
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Tamil */}
            {activeLangTab === 'ta' && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100">
                <div>
                  <label className="text-slate-700 block mb-1">Event Title (தமிழ்)</label>
                  <input 
                    type="text" 
                    placeholder="எ.கா. இலவசக் கண் பரிசோதனை முகாம் 2026" 
                    value={formData.title_ta}
                    onChange={(e) => setFormData({...formData, title_ta: e.target.value})}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600" 
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Venue Location & District (தமிழ்)</label>
                  <input 
                    type="text" 
                    placeholder="அரசு மருத்துவமனை மைதானம், கோயம்புத்தூர்" 
                    value={formData.location_ta}
                    onChange={(e) => setFormData({...formData, location_ta: e.target.value})}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600" 
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Description (தமிழ்)</label>
                  <textarea 
                    rows="2"
                    placeholder="முகாம் பற்றிய சுருக்கமான விவரம்..." 
                    value={formData.description_ta}
                    onChange={(e) => setFormData({...formData, description_ta: e.target.value})}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 resize-none" 
                  />
                </div>
                {isTaIncomplete && (
                  <p className="text-[11px] text-amber-700 bg-amber-100/70 p-2 rounded-lg font-medium">
                    ⚠️ Tamil fields left blank will fallback to English text for Tamil users.
                  </p>
                )}
              </div>
            )}

            {/* Tab 3: Hindi */}
            {activeLangTab === 'hi' && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100">
                <div>
                  <label className="text-slate-700 block mb-1">Event Title (हिंदी)</label>
                  <input 
                    type="text" 
                    placeholder="उदा. निःशुल्क नेत्र जांच शिविर 2026" 
                    value={formData.title_hi}
                    onChange={(e) => setFormData({...formData, title_hi: e.target.value})}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600" 
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Venue Location & District (हिंदी)</label>
                  <input 
                    type="text" 
                    placeholder="सरकारी अस्पताल मैदान, कोयंबटूर" 
                    value={formData.location_hi}
                    onChange={(e) => setFormData({...formData, location_hi: e.target.value})}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600" 
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Description (हिंदी)</label>
                  <textarea 
                    rows="2"
                    placeholder="शिविर का संक्षिप्त विवरण..." 
                    value={formData.description_hi}
                    onChange={(e) => setFormData({...formData, description_hi: e.target.value})}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 resize-none" 
                  />
                </div>
                {isHiIncomplete && (
                  <p className="text-[11px] text-blue-700 bg-blue-100/70 p-2 rounded-lg font-medium">
                    ⚠️ Hindi fields left blank will fallback to English text for Hindi users.
                  </p>
                )}
              </div>
            )}

            {/* Summary Warnings if Tamil or Hindi is empty */}
            {(isTaIncomplete || isHiIncomplete) && (
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-medium leading-relaxed">
                ℹ️ <span className="font-bold text-slate-700">Multilingual Fallback Active:</span> {isTaIncomplete && isHiIncomplete ? 'Tamil and Hindi' : isTaIncomplete ? 'Tamil' : 'Hindi'} translations missing. English content will be displayed.
              </div>
            )}

            <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md mt-2 transition">
              Publish Event Now
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
