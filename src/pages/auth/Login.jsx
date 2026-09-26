import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

export default function Login({ defaultTab = 'login' }) {
  const { setUser, setRole } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab); // 'login' | 'signup'
  const [loginMode, setLoginMode] = useState('email'); // 'email' | 'mobile'

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup Form States
  const [signupStep, setSignupStep] = useState(1); // 1, 2, 3
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otpToken, setOtpToken] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Common UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Resend Timer State
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  // Countdown effect for OTP resend
  useEffect(() => {
    let timer;
    if (activeTab === 'signup' && signupStep === 2 && resendTimer > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [activeTab, signupStep, resendTimer]);

  // AUTO-FILL DEMO CREDENTIALS
  const handleAutoFillDemo = () => {
    if (activeTab !== 'login') {
      setActiveTab('login');
    }
    setLoginMode('email');
    setLoginEmail('dharshini@ngo-tn.org');
    setLoginPassword('demo123456');
    setError('');
    setToastMessage('Demo credentials auto-filled!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  // HANDLE LOGIN (Firebase Auth)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPassword = loginPassword;

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please enter a valid registered email address.');
      return;
    }

    if (!cleanPassword) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const firebaseUser = userCredential.user;

      const userProfile = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || cleanEmail.split('@')[0],
        email: firebaseUser.email,
        badge: 'Verified Volunteer'
      };
      localStorage.setItem('tn_ngo_auth', JSON.stringify({ user: userProfile, role: 'user' }));
      if (setUser) setUser(userProfile);
      if (setRole) setRole('user');

      setToastMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 600);

    } catch (err) {
      console.error('Firebase login error:', err);

      // Fallback for demo credentials
      if (cleanEmail === 'dharshini@ngo-tn.org' && cleanPassword === 'demo123456') {
        const demoUser = {
          name: 'Dharshini Raj',
          email: 'dharshini@ngo-tn.org',
          district: 'Chennai',
          badge: 'Verified Volunteer Lead'
        };
        localStorage.setItem('tn_ngo_auth', JSON.stringify({ user: demoUser, role: 'user' }));
        if (setUser) setUser(demoUser);
        if (setRole) setRole('user');
        setToastMessage('Welcome back, Dharshini! Redirecting...');
        setTimeout(() => navigate('/'), 600);
        setLoading(false);
        return;
      }

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP STEP 1: SEND OTP (via /api/send-otp -> stored in Supabase, emailed via Nodemailer)
  const handleSignupStep1 = async (e) => {
    e.preventDefault();
    setError('');

    const cleanName = signupName.trim();
    const cleanEmail = signupEmail.trim().toLowerCase();
    const cleanPhone = signupPhone.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (cleanPhone && !phoneRegex.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to send OTP.');
      }

      setSignupStep(2);
      setResendTimer(30);
      setCanResend(false);
      setToastMessage(`6-digit code sent to ${cleanEmail}`);
      setTimeout(() => setToastMessage(''), 4000);

    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP STEP 2: VERIFY OTP (via /api/verify-otp -> checked against Supabase)
  const handleSignupStep2 = async (e) => {
    e.preventDefault();
    setError('');

    const cleanToken = otpToken.trim();

    if (!cleanToken || cleanToken.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail.trim().toLowerCase(), otp: cleanToken })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid or expired code.');
      }

      setSignupStep(3);
      setToastMessage('Email verified successfully!');
      setTimeout(() => setToastMessage(''), 4000);

    } catch (err) {
      console.error('Verify OTP failed:', err);
      setError(err.message || 'Verification failed. Please check your code or click Resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail.trim().toLowerCase() })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to resend OTP.');
      }

      setResendTimer(30);
      setCanResend(false);
      setToastMessage('New OTP sent to your email!');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP STEP 3: SET PASSWORD & CREATE FIREBASE ACCOUNT
  const handleSignupStep3 = async (e) => {
    e.preventDefault();
    setError('');

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = signupEmail.trim().toLowerCase();

      // Email OTP-ஐ ஏற்கனவே verify பண்ணிட்டோம் (Step 2) — இப்போ Firebase account create பண்றோம்
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, signupPassword);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: signupName
      });

      const newUser = {
        uid: firebaseUser.uid,
        name: signupName || 'Volunteer Member',
        email: cleanEmail,
        phone: signupPhone,
        badge: 'Verified Volunteer'
      };

      localStorage.setItem('tn_ngo_auth', JSON.stringify({ user: newUser, role: 'user' }));
      if (setUser) setUser(newUser);
      if (setRole) setRole('user');

      setToastMessage('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/'), 800);

    } catch (err) {
      console.error('Firebase account creation error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError(err.message || 'Failed to create account. Please try signing up again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-teal-50/20 to-blue-50/30 flex flex-col font-sans selection:bg-teal-600 selection:text-white">
      
      {/* Decorative Top Thin Dark Bar */}
      <div className="h-2 bg-[#0f1e3d] w-full shrink-0" />

      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 via-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-current text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
              TN NGO Connect
            </h1>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
              Together for a Better Tomorrow
            </span>
          </div>
        </Link>

        {/* Admin Login Outlined Pill Button */}
        <Link
          to="/admin-login"
          title="State Secretariat Admin Portal"
          className="px-3.5 py-1.5 rounded-full border border-teal-600/50 bg-teal-50/40 hover:bg-teal-100/70 text-teal-800 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>🛡 Admin Login</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-8 px-4 flex items-center justify-center">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* CENTERED CARD */}
        <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto transition-all">
          
          {/* Card Top Banner */}
          <div className="bg-gradient-to-r from-teal-600 via-cyan-700 to-blue-700 p-6 sm:p-7 text-white text-center relative overflow-hidden rounded-t-3xl">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mx-auto mb-3 shadow-inner">
              <Heart className="w-7 h-7 text-white fill-current" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              TN NGO Connect
            </h2>
            <p className="text-xs text-teal-100 font-medium mt-1">
              Together for a Better Tomorrow
            </p>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8">
            
            {/* Highlighted Info Banner */}
            <div className="bg-teal-50/90 border border-teal-200/80 rounded-2xl p-3.5 mb-5 flex items-center justify-between gap-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-extrabold text-teal-900">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Demo Account Ready</span>
              </div>
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition shadow-sm active:scale-95 shrink-0"
              >
                Auto-fill Demo
              </button>
            </div>

            {/* Two-Tab Toggle */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center mb-6 border border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError('');
                }}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 text-center ${
                  activeTab === 'login'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setError('');
                }}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 text-center ${
                  activeTab === 'signup'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ========================================= */}
            {/* TAB 1: LOGIN CONTENT */}
            {/* ========================================= */}
            {activeTab === 'login' && (
              <div className="space-y-4">
                
                {/* Sub-toggle: Mobile vs Email */}
                <div className="flex items-center gap-2 mb-2 p-1 bg-slate-100/70 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setLoginMode('email')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                      loginMode === 'email'
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Login with Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setToastMessage('Mobile login is coming soon! Please use Email Login.');
                      setTimeout(() => setToastMessage(''), 4000);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                      loginMode === 'mobile'
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-200/60'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Login with Mobile</span>
                  </button>
                </div>

                {/* Email Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1.5">
                      Registered Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="e.g. yourname@gmail.com"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10 text-slate-800 placeholder-slate-400 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-700 font-bold block">
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setToastMessage('Enter your registered email and click Auto-fill Demo if needed.');
                          setTimeout(() => setToastMessage(''), 4000);
                        }}
                        className="text-teal-600 hover:underline font-bold text-xs"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="Enter your password..."
                        className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10 text-slate-800 placeholder-slate-400 focus:outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Full-width Teal Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 rounded-2xl text-white font-extrabold text-xs shadow-lg shadow-teal-600/20 transition flex items-center justify-center gap-2 active:scale-98 mt-2 ${
                      loading
                        ? 'bg-teal-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 cursor-pointer'
                    }`}
                  >
                    <span>{loading ? 'Logging in...' : 'Login'}</span>
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setError('');
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-teal-700 transition"
                  >
                    New user? <span className="text-teal-600 underline">Create Account for TN NGO Connect</span>
                  </button>
                </div>

              </div>
            )}

            {/* ========================================= */}
            {/* TAB 2: CREATE ACCOUNT CONTENT */}
            {/* ========================================= */}
            {activeTab === 'signup' && (
              <div className="space-y-5">
                
                {/* 3-Step Progress Indicator */}
                <div className="flex items-center justify-between relative px-2 py-1 mb-4">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                  <div 
                    className="absolute top-1/2 left-8 h-0.5 bg-teal-600 -translate-y-1/2 z-0 transition-all duration-300"
                    style={{
                      width: signupStep === 1 ? '0%' : signupStep === 2 ? '50%' : '100%'
                    }}
                  />

                  {/* Step 1 Circle */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      signupStep >= 1 ? 'bg-teal-600 text-white ring-4 ring-teal-100' : 'bg-slate-200 text-slate-600'
                    }`}>
                      1
                    </div>
                    <span className={`text-[10px] font-bold mt-1 ${signupStep >= 1 ? 'text-teal-700' : 'text-slate-400'}`}>
                      Details
                    </span>
                  </div>

                  {/* Step 2 Circle */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      signupStep >= 2 ? 'bg-teal-600 text-white ring-4 ring-teal-100' : 'bg-slate-200 text-slate-600'
                    }`}>
                      2
                    </div>
                    <span className={`text-[10px] font-bold mt-1 ${signupStep >= 2 ? 'text-teal-700' : 'text-slate-400'}`}>
                      Verify Email
                    </span>
                  </div>

                  {/* Step 3 Circle */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      signupStep >= 3 ? 'bg-teal-600 text-white ring-4 ring-teal-100' : 'bg-slate-200 text-slate-600'
                    }`}>
                      3
                    </div>
                    <span className={`text-[10px] font-bold mt-1 ${signupStep >= 3 ? 'text-teal-700' : 'text-slate-400'}`}>
                      Set Password
                    </span>
                  </div>
                </div>

                {/* STEP 1: Details Form */}
                {signupStep === 1 && (
                  <form onSubmit={handleSignupStep1} className="space-y-3.5 text-xs font-semibold">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => {
                            setSignupName(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="e.g. Your Name"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:border-teal-600 focus:outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">
                        Mobile Phone Number *
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="px-2.5 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-800 font-bold text-xs focus:outline-none shrink-0"
                        >
                          <option value="+91">IN +91</option>
                        </select>
                        <div className="relative flex-1">
                          <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="tel"
                            value={signupPhone}
                            onChange={(e) => {
                              setSignupPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                              if (error) setError('');
                            }}
                            placeholder="Enter 10-digit mobile number..."
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:border-teal-600 focus:outline-none text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">
                        Email Address * (for account verification)
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          value={signupEmail}
                          onChange={(e) => {
                            setSignupEmail(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="e.g. yourname@gmail.com"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:border-teal-600 focus:outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3.5 rounded-2xl text-white font-extrabold text-xs shadow-lg shadow-teal-600/20 transition flex items-center justify-center gap-2 active:scale-98 mt-2 ${
                        loading
                          ? 'bg-teal-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 cursor-pointer'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{loading ? 'Sending OTP...' : 'Continue & Send Email OTP'}</span>
                    </button>
                  </form>
                )}

                {/* STEP 2: Verify Email */}
                {signupStep === 2 && (
                  <form onSubmit={handleSignupStep2} className="space-y-4 text-xs font-semibold">
                    <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-center">
                      <p className="text-xs font-bold">
                        We've sent a 6-digit code to <span className="underline">{signupEmail}</span>
                      </p>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block text-center mb-2">
                        Enter 6-Digit OTP Code
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={otpToken}
                          onChange={(e) => {
                            setOtpToken(e.target.value.replace(/\D/g, '').slice(0, 6));
                            if (error) setError('');
                          }}
                          placeholder="123456"
                          className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-300 focus:border-teal-600 text-center text-xl font-mono tracking-[0.5em] font-black text-slate-900 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpToken.length < 6}
                      className={`w-full py-3.5 rounded-2xl text-white font-extrabold text-xs shadow-lg shadow-teal-600/20 transition flex items-center justify-center gap-2 active:scale-98 ${
                        loading || otpToken.length < 6
                          ? 'bg-teal-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 cursor-pointer'
                      }`}
                    >
                      <span>{loading ? 'Verifying...' : 'Verify Email'}</span>
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSignupStep(1);
                          setError('');
                        }}
                        className="font-bold text-slate-600 hover:text-teal-600 transition flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Details
                      </button>

                      <button
                        type="button"
                        disabled={!canResend || loading}
                        onClick={handleResendOtp}
                        className={`font-bold transition flex items-center gap-1 ${
                          canResend && !loading
                            ? 'text-teal-600 hover:underline cursor-pointer'
                            : 'text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>{canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: Set Password */}
                {signupStep === 3 && (
                  <form onSubmit={handleSignupStep3} className="space-y-4 text-xs font-semibold">
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Email verified: {signupEmail}</span>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5">
                        Set Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={signupPassword}
                          onChange={(e) => {
                            setSignupPassword(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="Minimum 6 characters"
                          className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-300 focus:border-teal-600 focus:outline-none text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition"
                        >
                          {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={signupConfirmPassword}
                          onChange={(e) => {
                            setSignupConfirmPassword(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="Re-enter password"
                          className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-300 focus:border-teal-600 focus:outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3.5 rounded-2xl text-white font-extrabold text-xs shadow-lg shadow-teal-600/20 transition flex items-center justify-center gap-2 active:scale-98 ${
                        loading
                          ? 'bg-teal-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 cursor-pointer'
                      }`}
                    >
                      <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('login');
                          setError('');
                        }}
                        className="text-xs font-bold text-slate-600 hover:text-teal-700 transition"
                      >
                        Already registered? <span className="text-teal-600 underline">Login here</span>
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )}

            {/* Footer Badges */}
            <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-500 font-semibold">
              <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-600" /> Firebase Auth
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-cyan-600" /> Verified Email OTP Sign Up
              </span>
            </div>

          </div>
        </div>

      </main>

    </div>
  );
}