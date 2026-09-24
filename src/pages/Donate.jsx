import React, { useState } from 'react';
import { Heart, ShieldCheck, CheckCircle2, IndianRupee, Sparkles, CreditCard, Lock } from 'lucide-react';
import { FEATURED_NGOS } from '../data/mockData';

export default function Donate() {
  const [selectedNGO, setSelectedNGO] = useState(FEATURED_NGOS[0].name);
  const [amount, setAmount] = useState('1000');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [submitted, setSubmitted] = useState(false);
  const [donorDetails, setDonorDetails] = useState({
    name: 'Dharshini Raj',
    email: 'dharshini@ngo-tn.org',
    pan: 'ABCDE1234F',
    phone: '+91 94440 88776'
  });

  const handleAmountClick = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Tax Exempt under Section 80G • Govt Audited</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Support Verified Causes in Tamil Nadu
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Your contributions directly fund emergency blood bank network ops, free cataract eye surgeries, urban Miyawaki forests, and rural child education.
          </p>
        </div>
      </div>

      {/* Main Donation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        
        {submitted && (
          <div className="p-5 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-center space-y-2 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold">Donation Successful!</h3>
            <p className="text-xs font-medium text-emerald-800">
              Thank you, <span className="font-bold">{donorDetails.name}</span>! Your donation of <span className="font-bold text-emerald-950">₹{amount}</span> to <span className="font-bold">{selectedNGO}</span> has been processed.
            </p>
            <p className="text-[11px] font-semibold text-emerald-700">An 80G Tax Exemption receipt (#TN-80G-2026-9921) was emailed to {donorDetails.email}.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Select NGO/Cause */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-2">
              1. Select Target NGO / Social Cause
            </label>
            <select
              value={selectedNGO}
              onChange={(e) => setSelectedNGO(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-emerald-600 focus:outline-none bg-slate-50 text-xs font-bold text-slate-800 cursor-pointer"
            >
              {FEATURED_NGOS.map((ngo) => (
                <option key={ngo.id} value={ngo.name}>
                  {ngo.name} ({ngo.category} • {ngo.district})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Select Amount */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-2">
              2. Select Donation Amount
            </label>
            
            {/* Quick buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {['500', '1000', '2000'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAmountClick(val)}
                  className={`py-3 rounded-2xl border text-sm font-extrabold transition-all ${
                    amount === val && !customAmount
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
              <div className="relative">
                <input
                  type="number"
                  placeholder="Custom ₹"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className={`w-full h-full px-3 text-xs font-bold rounded-2xl border text-center focus:outline-none ${
                    customAmount ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold' : 'border-slate-200 bg-slate-50'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 3. Donor Details Form */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-1">
              3. Donor & 80G Tax Exemption Information
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="text-slate-600 block mb-1">Full Name (as per PAN)</label>
                <input
                  type="text"
                  required
                  value={donorDetails.name}
                  onChange={(e) => setDonorDetails({...donorDetails, name: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Email (Receipt Destination)</label>
                <input
                  type="email"
                  required
                  value={donorDetails.email}
                  onChange={(e) => setDonorDetails({...donorDetails, email: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="text-slate-600 block mb-1">PAN Card No. (Optional for 80G Tax Claim)</label>
                <input
                  type="text"
                  value={donorDetails.pan}
                  onChange={(e) => setDonorDetails({...donorDetails, pan: e.target.value})}
                  placeholder="ABCDE1234F"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={donorDetails.phone}
                  onChange={(e) => setDonorDetails({...donorDetails, phone: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. Payment Gateway Option */}
          <div className="pt-4 border-t border-slate-100">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-2">
              4. Payment Gateway Mode
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)' },
                { id: 'CARD', label: 'Credit / Debit Card' },
                { id: 'NET', label: 'NetBanking / IMPS' }
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    paymentMethod === pm.id
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 active:scale-95"
          >
            <Lock className="w-4 h-4" />
            <span>Donate Now (₹{amount || 0})</span>
          </button>

        </form>

      </div>
    </div>
  );
}
