import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  KeyRound,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ALL_TN_DISTRICTS } from '../../data/mockData';
import { supabase } from '../../lib/supabaseClient';

export default function Signup() {
  const [step, setStep] = useState(1); // 1: Collect Details & Send OTP, 2: Verify OTP
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Chennai');
  const [otpToken, setOtpToken] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // 30s Resend Timer
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Step 1: Validate Fields & Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      await sendOtp(cleanEmail);
      setStep(2);
      setResendTimer(30);
      setCanResend(false);
      setToastMessage('Verification OTP sent to your email!');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      console.error('Signup Send OTP error:', err);
      setError(err.message || 'Failed to send OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP Token & Register Profile
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const cleanToken = otpToken.trim();
    if (!cleanToken || cleanToken.length < 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp(email.trim(), cleanToken);
      
      // Attempt profile row insertion if profiles table exists
      if (data?.session?.user?.id) {
        try {
          await supabase.from('profiles').insert([
            {
              id: data.session.user.id,
              name: name.trim(),
              phone: phone.trim(),
              district: district
            }
          ]);
        } catch (profileErr) {
          console.warn('Profiles table insert skipped or unavailable:', profileErr);
        }
      }

      setToastMessage('Account verified & created successfully!');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      console.error('Signup Verify OTP error:', err);
      setError(err.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setError('');
    setLoading(true);
    try {
      await sendOtp(email.trim());
      setResendTimer(30);
      setCanResend(false);
      setToastMessage('New verification code sent!');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl animate-in fade-in duration-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center shadow-lg shadow-blue-600/30 mx-auto mb-3">
            <UserPlus className="w-6 h-6 text-amber-300" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {step === 1 ? 'Create Volunteer Account' : 'Verify Email Address'}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {step === 1 
              ? 'Join 3,642+ active volunteers across Tamil Nadu' 
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Form Inputs */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-3.5 text-xs font-semibold">
            <div>
              <label className="text-slate-700 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
                  placeholder="e.g. Dharshini Raj"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); if (error) setError(''); }}
                    placeholder="10-digit number"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">District</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-white text-slate-800 font-semibold cursor-pointer"
                >
                  {ALL_TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95 mt-2 ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              }`}
            >
              <span>{loading ? 'Sending Verification OTP...' : 'Send Verification OTP'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        {/* STEP 2: Verify OTP Token */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="text-slate-700 block mb-1.5 font-bold">
                6-Digit OTP Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  value={otpToken}
                  onChange={(e) => {
                    setOtpToken(e.target.value.replace(/\D/g, ''));
                    if (error) setError('');
                  }}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 text-center text-lg font-mono font-bold tracking-[0.5em] text-slate-900 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otpToken.length < 6}
              className={`w-full py-3 rounded-xl text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95 ${
                loading || otpToken.length < 6
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              }`}
            >
              <span>{loading ? 'Verifying Account...' : 'Verify & Complete Signup'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError('');
                }}
                className="font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Change details
              </button>

              <button
                type="button"
                disabled={!canResend || loading}
                onClick={handleResendOtp}
                className={`font-bold transition flex items-center gap-1 ${
                  canResend && !loading 
                    ? 'text-blue-600 hover:underline cursor-pointer' 
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}</span>
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs">
          <p className="text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
