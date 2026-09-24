import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  KeyRound,
  Users, 
  Building2, 
  Tent, 
  HeartHandshake, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // 30s Resend Timer
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Countdown timer effect for Step 2
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

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Email address is required.');
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await sendOtp(cleanEmail);
      setStep(2);
      setResendTimer(30);
      setCanResend(false);
      setToastMessage('OTP code sent to your email address!');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP Token
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
      await verifyOtp(email.trim(), cleanToken);
      setToastMessage('Authentication successful! Redirecting...');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError(err.message || 'Invalid or expired OTP code. Please check and try again.');
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
      setToastMessage('New OTP code sent!');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setToastMessage('Google login coming soon!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl animate-in fade-in duration-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* LEFT PANEL: Branding & Connected Nodes Diagram (~40% Width) */}
      {/* ========================================================= */}
      <div className="md:w-[40%] lg:w-[42%] bg-gradient-to-br from-[#0a1a3d] via-[#0c204c] to-[#0d2456] text-white p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden min-h-[360px] md:min-h-screen shrink-0">
        
        {/* Background Wavy Curved Shape SVG */}
        <svg 
          className="absolute bottom-0 left-0 right-0 w-full h-32 opacity-15 text-cyan-400 fill-current pointer-events-none" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <path d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,218.7C960,235,1056,245,1152,234.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>

        {/* Faint Tamil Nadu State Map Silhouette Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center p-8">
          <svg className="w-full h-full text-blue-300 fill-current max-w-md" viewBox="0 0 400 500">
            <path d="M 220 40 L 340 60 L 330 140 L 300 200 L 270 260 L 310 350 L 250 400 L 200 460 L 130 490 L 90 460 L 80 390 L 50 300 L 60 180 L 140 130 Z" />
          </svg>
        </div>

        {/* Top Header Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border border-cyan-300/30 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-white uppercase leading-none">
                Tamil Nadu
              </h1>
              <span className="text-base font-extrabold text-cyan-400 tracking-tight block">
                NGO Connect
              </span>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-base sm:text-lg font-bold text-cyan-300 tracking-wide">
              Many NGOs. One Platform. Greater Impact.
            </p>
            <div className="w-12 h-1 bg-cyan-400 rounded-full mt-2" />

            <p className="text-xs text-slate-300 font-normal leading-relaxed mt-3 max-w-sm hidden sm:block">
              Connecting NGOs, volunteers, camps and social impact initiatives across Tamil Nadu for a stronger, healthier and more inclusive community.
            </p>
          </div>
        </div>

        {/* CENTER: Connected-Nodes Diagram */}
        <div className="relative z-10 my-6 py-4 flex items-center justify-center">
          <div className="relative w-64 h-56 flex items-center justify-center">
            
            {/* SVG Dotted Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 256 224">
              <line x1="128" y1="112" x2="48" y2="48" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
              <line x1="128" y1="112" x2="208" y2="48" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
              <line x1="128" y1="112" x2="48" y2="176" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
              <line x1="128" y1="112" x2="208" y2="176" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
            </svg>

            {/* Central Circle */}
            <div className="relative z-20 w-16 h-16 rounded-full bg-blue-600 border-4 border-cyan-400/50 shadow-xl shadow-blue-600/50 flex items-center justify-center text-white ring-8 ring-blue-500/20">
              <Users className="w-8 h-8 text-white" />
            </div>

            {/* Node 1: NGOs */}
            <div className="absolute top-2 left-2 flex flex-col items-center group cursor-pointer z-20">
              <div className="w-11 h-11 rounded-2xl bg-slate-800/90 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-200 mt-1">NGOs</span>
            </div>

            {/* Node 2: Volunteers */}
            <div className="absolute top-2 right-2 flex flex-col items-center group cursor-pointer z-20">
              <div className="w-11 h-11 rounded-2xl bg-slate-800/90 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-200 mt-1">Volunteers</span>
            </div>

            {/* Node 3: Camps */}
            <div className="absolute bottom-2 left-2 flex flex-col items-center group cursor-pointer z-20">
              <div className="w-11 h-11 rounded-2xl bg-slate-800/90 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Tent className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-200 mt-1">Camps</span>
            </div>

            {/* Node 4: Social Impact */}
            <div className="absolute bottom-2 right-2 flex flex-col items-center group cursor-pointer z-20">
              <div className="w-11 h-11 rounded-2xl bg-slate-800/90 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-200 mt-1">Social Impact</span>
            </div>

          </div>
        </div>

        {/* Left Footer */}
        <div className="relative z-10 pt-2 border-t border-slate-700/50 text-[11px] text-slate-400 font-medium">
          <p>© 2026 Tamil Nadu NGO Connect • All Rights Reserved</p>
        </div>

      </div>

      {/* ========================================================= */}
      {/* RIGHT PANEL: Form Side (~60% Width, White Background) */}
      {/* ========================================================= */}
      <div className="md:w-[60%] lg:w-[58%] bg-white p-6 sm:p-10 md:p-12 flex flex-col justify-between relative overflow-y-auto min-h-screen">
        
        {/* Top-Right Back Link */}
        <div className="flex justify-end mb-4 sm:mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition py-1 px-3 rounded-lg hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Centered Form Card (~420px max width) */}
        <div className="max-w-[420px] w-full mx-auto my-auto space-y-6">
          
          {/* Form Heading & Subtext */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1a3d] tracking-tight">
              {step === 1 ? 'Welcome Back' : 'Enter Verification Code'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {step === 1 
                ? 'Sign in to continue to Tamil Nadu NGO Connect' 
                : `We've sent a 6-digit code to ${email}`}
            </p>
          </div>

          {/* STEP 1: Email Input Form */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-700 block mb-1.5 font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your email address"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-slate-800 placeholder-slate-400 focus:outline-none transition ${
                      error 
                        ? 'border-rose-500 bg-rose-50/30 focus:border-rose-500' 
                        : 'border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10'
                    }`}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className={`w-full py-3.5 rounded-xl text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2 active:scale-98 ${
                  loading || !email.trim()
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                }`}
              >
                <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* STEP 2: Verify OTP Token Form */}
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
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-center text-lg font-mono font-bold tracking-[0.5em] text-slate-900 focus:outline-none transition ${
                      error 
                        ? 'border-rose-500 bg-rose-50/30 focus:border-rose-500' 
                        : 'border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10'
                    }`}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otpToken.length < 6}
                className={`w-full py-3.5 rounded-xl text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2 active:scale-98 ${
                  loading || otpToken.length < 6
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                }`}
              >
                <span>{loading ? 'Verifying...' : 'Verify & Login'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              {/* Resend OTP & Change Email Controls */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError('');
                  }}
                  className="font-bold text-slate-600 hover:text-blue-600 transition flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change email
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
                  <span>{canResend ? 'Resend OTP' : `Resend OTP in ${resendTimer}s`}</span>
                </button>
              </div>
            </form>
          )}

          {/* OR Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Continue with Google Outlined Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Bottom Sign-Up Link */}
          <div className="text-center text-xs text-slate-600 font-medium pt-2">
            <span>Don't have an account? </span>
            <Link to="/signup" className="font-bold text-blue-600 hover:underline">
              Register now
            </Link>
          </div>

        </div>

        {/* Right Footer */}
        <div className="text-center text-[11px] text-slate-400 font-medium pt-6">
          <p>Tamil Nadu NGO Connect • Government of Tamil Nadu Welfare Partner</p>
        </div>

      </div>

    </div>
  );
}
