import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  KeyRound
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function Login({ defaultTab = 'login' }) {
  const { t } = useTranslation();
  const { setUser, setRole } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab); // 'login' | 'signup'
  const [loginMode, setLoginMode] = useState('mobile'); // 'mobile' | 'email'

  // Login Email States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Login Mobile States
  const [loginPhone, setLoginPhone] = useState('');
  const [loginMobilePassword, setLoginMobilePassword] = useState('');
  const [showLoginMobilePassword, setShowLoginMobilePassword] = useState(false);

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

  // Forgot Password States
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotResendTimer, setForgotResendTimer] = useState(30);
  const [canForgotResend, setCanForgotResend] = useState(false);

  // Common UI States
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');
  const [emailRegisteredError, setEmailRegisteredError] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Resend Timer State for Signup
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  // Countdown effect for Signup OTP resend
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

  // Countdown effect for Forgot Password OTP resend
  useEffect(() => {
    let timer;
    if (isForgotPasswordMode && forgotStep === 2 && forgotResendTimer > 0) {
      setCanForgotResend(false);
      timer = setInterval(() => {
        setForgotResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (forgotResendTimer === 0) {
      setCanForgotResend(true);
    }
    return () => clearInterval(timer);
  }, [isForgotPasswordMode, forgotStep, forgotResendTimer]);

  // AUTO-FILL DEMO CREDENTIALS
  const handleAutoFillDemo = () => {
    setIsForgotPasswordMode(false);
    if (activeTab !== 'login') {
      setActiveTab('login');
    }
    if (loginMode === 'mobile') {
      setLoginPhone('9876543210');
      setLoginMobilePassword('demo123456');
    } else {
      setLoginEmail('dharshini@ngo-tn.org');
      setLoginPassword('demo123456');
    }
    setError('');
    setToastMessage('Demo credentials auto-filled!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  // HANDLE EMAIL LOGIN (Firebase Auth)
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
        badge: t('common.verifiedVolunteer')
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
          phone: '9876543210',
          district: 'Chennai',
          badge: t('common.verifiedVolunteerLead')
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

  // HANDLE MOBILE LOGIN
  const handleMobileLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = loginPhone.trim();
    const cleanPassword = loginMobilePassword;

    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!cleanPassword) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Fallback for demo mobile credentials
      if (cleanPhone === '9876543210' && cleanPassword === 'demo123456') {
        const demoUser = {
          name: 'Dharshini Raj',
          email: 'dharshini@ngo-tn.org',
          phone: '9876543210',
          district: 'Chennai',
          badge: t('common.verifiedVolunteerLead')
        };
        localStorage.setItem('tn_ngo_auth', JSON.stringify({ user: demoUser, role: 'user' }));
        if (setUser) setUser(demoUser);
        if (setRole) setRole('user');
        setToastMessage('Welcome back, Dharshini! Redirecting...');
        setTimeout(() => navigate('/'), 600);
        setLoading(false);
        return;
      }

      // 2. Query Supabase for email associated with phone
      const { data, error: dbError } = await supabase
        .from('user_profiles')
        .select('email, name')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (dbError) {
        console.error('Supabase phone lookup error:', dbError);
      }

      if (!data || !data.email) {
        setError('No account found with this mobile number.');
        setLoading(false);
        return;
      }

      const targetEmail = data.email;

      // 3. Authenticate with Firebase Auth using targetEmail
      const userCredential = await signInWithEmailAndPassword(auth, targetEmail, cleanPassword);
      const firebaseUser = userCredential.user;

      const userProfile = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || data.name || cleanPhone,
        email: firebaseUser.email,
        phone: cleanPhone,
        badge: t('common.verifiedVolunteer')
      };

      localStorage.setItem('tn_ngo_auth', JSON.stringify({ user: userProfile, role: 'user' }));
      if (setUser) setUser(userProfile);
      if (setRole) setRole('user');

      setToastMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 600);

    } catch (err) {
      console.error('Mobile login authentication error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid mobile number or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD STEP 1
  const handleForgotStep1 = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please enter a valid registered email address.');
      return;
    }

    setLoading(true);
    setLoadingText('Sending reset code...');

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, type: 'reset' })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to send reset code.');
      }

      setForgotStep(2);
      setForgotResendTimer(30);
      setCanForgotResend(false);
      setToastMessage(`Reset code sent to ${cleanEmail}`);
      setTimeout(() => setToastMessage(''), 4000);

    } catch (err) {
      console.error('Forgot password send OTP error:', err);
      setError(err.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
      setLoadingText('');
    }
  };

  // FORGOT PASSWORD STEP 2
  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    setError('');

    const cleanOtp = forgotOtp.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase(), otp: cleanOtp })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid or expired code.');
      }

      setForgotStep(3);
      setToastMessage('Email verified! Set your new password.');
      setTimeout(() => setToastMessage(''), 4000);

    } catch (err) {
      console.error('Forgot password verify OTP error:', err);
      setError(err.message || 'Verification failed. Check your code or click Resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD RESEND OTP
  const handleForgotResendOtp = async () => {
    if (!canForgotResend || loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase(), type: 'reset' })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to resend reset code.');
      }

      setForgotResendTimer(30);
      setCanForgotResend(false);
      setToastMessage('New reset code sent to your email!');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      console.error('Forgot password resend OTP error:', err);
      setError(err.message || 'Failed to resend reset code.');
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD STEP 3
  const handleForgotStep3 = async (e) => {
    e.preventDefault();
    setError('');

    if (forgotPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (forgotPassword !== forgotConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = forgotEmail.trim().toLowerCase();
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, newPassword: forgotPassword })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to reset password.');
      }

      setToastMessage('Password reset successful! Please login with your new password.');
      setTimeout(() => setToastMessage(''), 5000);

      // Return to Login tab
      setIsForgotPasswordMode(false);
      setForgotStep(1);
      setForgotEmail('');
      setForgotOtp('');
      setForgotPassword('');
      setForgotConfirmPassword('');
      setActiveTab('login');
      setLoginMode('email');
      setLoginEmail(cleanEmail);

    } catch (err) {
      console.error('Reset password step 3 error:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP STEP 1: SEND OTP
  const handleSignupStep1 = async (e) => {
    e.preventDefault();
    setError('');
    setEmailRegisteredError(false);

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
    setLoadingText('Checking email...');

    // 1. Check if email is already registered in Firebase Auth
    let isRegistered = false;
    try {
      const methods = await fetchSignInMethodsForEmail(auth, cleanEmail);
      if (methods && methods.length > 0) {
        isRegistered = true;
      }
    } catch (err) {
      console.error('Error checking if email exists in Firebase Auth:', err);
    }

    if (isRegistered) {
      setSignupStep(1);
      setEmailRegisteredError(true);
      setError(t('auth.emailAlreadyRegistered'));
      setLoading(false);
      setLoadingText('');
      return;
    }

    setLoadingText('Sending OTP...');

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
      setLoadingText('');
    }
  };

  // SIGNUP STEP 2: VERIFY OTP
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

  // RESEND OTP FOR SIGNUP
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

  // SIGNUP STEP 3: CREATE FIREBASE ACCOUNT & SUPABASE MAPPING
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
      const cleanPhone = signupPhone.trim();
      const cleanName = signupName.trim() || 'Volunteer Member';

      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, signupPassword);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: cleanName
      });

      try {
        await supabase.from('user_profiles').upsert({
          uid: firebaseUser.uid,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          created_at: new Date().toISOString()
        }, { onConflict: 'email' });
      } catch (dbErr) {
        console.error('Error saving user profile mapping to Supabase:', dbErr);
      }

      const newUser = {
        uid: firebaseUser.uid,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        badge: t('common.verifiedVolunteer')
      };

      localStorage.setItem('tn_ngo_auth', JSON.stringify({ user: newUser, role: 'user' }));
      if (setUser) setUser(newUser);
      if (setRole) setRole('user');

      setToastMessage('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/'), 800);

    } catch (err) {
      console.error('Firebase account creation error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError(t('auth.emailAlreadyRegistered'));
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
              {t('common.appName')}
            </h1>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
              {t('common.tagline')}
            </span>
          </div>
        </Link>

        {/* Right Header Section: Language Switcher + Admin Login */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />

          <Link
            to="/admin-login"
            title="State Secretariat Admin Portal"
            className="px-3.5 py-1.5 rounded-full border border-teal-600/50 bg-teal-50/40 hover:bg-teal-100/70 text-teal-800 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>{t('common.adminLogin')}</span>
          </Link>
        </div>
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
              {t('common.appName')}
            </h2>
            <p className="text-xs text-teal-100 font-medium mt-1">
              {t('common.tagline')}
            </p>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8">
            
            {/* ========================================= */}
            {/* VIEW A: FORGOT PASSWORD FLOW */}
            {/* ========================================= */}
            {isForgotPasswordMode ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-teal-600" />
                    <span>{t('auth.resetPassword')}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordMode(false);
                      setError('');
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 transition flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Login
                  </button>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* FORGOT STEP 1: Enter Registered Email */}
                {forgotStep === 1 && (
                  <form onSubmit={handleForgotStep1} className="space-y-4 text-xs font-semibold">
                    <p className="text-slate-600 text-xs font-medium">
                      Enter your registered email address below. We'll send a 6-digit verification code to reset your password.
                    </p>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5">
                        {t('auth.emailAddress')}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => {
                            setForgotEmail(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="e.g. yourname@gmail.com"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10 text-slate-800 focus:outline-none transition"
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
                      <span>{loading ? (loadingText || 'Sending...') : t('auth.sendVerificationCode')}</span>
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </form>
                )}

                {/* FORGOT STEP 2: Verify 6-Digit OTP */}
                {forgotStep === 2 && (
                  <form onSubmit={handleForgotStep2} className="space-y-4 text-xs font-semibold">
                    <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-center">
                      <p className="text-xs font-bold">
                        Verification code sent to <span className="underline">{forgotEmail}</span>
                      </p>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block text-center mb-2">
                        {t('auth.enterOtp')}
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={forgotOtp}
                          onChange={(e) => {
                            setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                            if (error) setError('');
                          }}
                          placeholder="123456"
                          className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-300 focus:border-teal-600 text-center text-xl font-mono tracking-[0.5em] font-black text-slate-900 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || forgotOtp.length < 6}
                      className={`w-full py-3.5 rounded-2xl text-white font-extrabold text-xs shadow-lg shadow-teal-600/20 transition flex items-center justify-center gap-2 active:scale-98 ${
                        loading || forgotOtp.length < 6
                          ? 'bg-teal-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 cursor-pointer'
                      }`}
                    >
                      <span>{loading ? 'Verifying...' : t('auth.verifyCode')}</span>
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotStep(1);
                          setError('');
                        }}
                        className="font-bold text-slate-600 hover:text-teal-600 transition flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Change Email
                      </button>

                      <button
                        type="button"
                        disabled={!canForgotResend || loading}
                        onClick={handleForgotResendOtp}
                        className={`font-bold transition flex items-center gap-1 ${
                          canForgotResend && !loading
                            ? 'text-teal-600 hover:underline cursor-pointer'
                            : 'text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>{canForgotResend ? 'Resend OTP' : `Resend in ${forgotResendTimer}s`}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* FORGOT STEP 3: Set New Password */}
                {forgotStep === 3 && (
                  <form onSubmit={handleForgotStep3} className="space-y-4 text-xs font-semibold">
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Verified: {forgotEmail}</span>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5">
                        {t('auth.newPassword')}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showForgotPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={forgotPassword}
                          onChange={(e) => {
                            setForgotPassword(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="Minimum 6 characters"
                          className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-300 focus:border-teal-600 focus:outline-none text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(!showForgotPassword)}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition"
                        >
                          {showForgotPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5">
                        {t('auth.confirmPassword')}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showForgotPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={forgotConfirmPassword}
                          onChange={(e) => {
                            setForgotConfirmPassword(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="Re-enter new password"
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
                      <span>{loading ? 'Updating Password...' : t('auth.updatePassword')}</span>
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </form>
                )}

              </div>
            ) : (
              /* ========================================= */
              /* VIEW B: MAIN LOGIN & SIGNUP TABS */
              /* ========================================= */
              <>
                {/* Highlighted Info Banner */}
                <div className="bg-teal-50/90 border border-teal-200/80 rounded-2xl p-3.5 mb-5 flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-teal-900">
                    <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{t('common.demoReady')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillDemo}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition shadow-sm active:scale-95 shrink-0"
                  >
                    {t('common.autoFillDemo')}
                  </button>
                </div>

                {/* Two-Tab Toggle */}
                <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center mb-6 border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setError('');
                      setSignupStep(1);
                      setEmailRegisteredError(false);
                    }}
                    className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 text-center ${
                      activeTab === 'login'
                        ? 'bg-white text-slate-900 shadow-md'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t('auth.login')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setError('');
                      setSignupStep(1);
                      setEmailRegisteredError(false);
                    }}
                    className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all duration-200 text-center ${
                      activeTab === 'signup'
                        ? 'bg-white text-slate-900 shadow-md'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t('auth.createAccount')}
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
                    
                    {/* Sub-toggle: Mobile (FIRST) vs Email (SECOND) */}
                    <div className="flex items-center gap-2 mb-2 p-1 bg-slate-100/70 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginMode('mobile');
                          setError('');
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                          loginMode === 'mobile'
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-200/60'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>{t('auth.loginWithMobile')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLoginMode('email');
                          setError('');
                        }}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                          loginMode === 'email'
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-200/60'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{t('auth.loginWithEmail')}</span>
                      </button>
                    </div>

                    {/* Mode 1: Mobile Login Form */}
                    {loginMode === 'mobile' ? (
                      <form onSubmit={handleMobileLoginSubmit} className="space-y-4 text-xs font-semibold">
                        <div>
                          <label className="text-slate-700 font-bold block mb-1.5">
                            {t('auth.mobileNumber')}
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
                                required
                                value={loginPhone}
                                onChange={(e) => {
                                  setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                                  if (error) setError('');
                                }}
                                placeholder="Enter 10-digit mobile number..."
                                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10 text-slate-800 placeholder-slate-400 focus:outline-none transition"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-slate-700 font-bold block">
                              {t('auth.password')}
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setIsForgotPasswordMode(true);
                                setForgotStep(1);
                                setError('');
                              }}
                              className="text-teal-600 hover:underline font-bold text-xs"
                            >
                              {t('auth.forgotPassword')}
                            </button>
                          </div>

                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <input
                              type={showLoginMobilePassword ? 'text' : 'password'}
                              required
                              value={loginMobilePassword}
                              onChange={(e) => {
                                setLoginMobilePassword(e.target.value);
                                if (error) setError('');
                              }}
                              placeholder="Enter your password..."
                              className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10 text-slate-800 placeholder-slate-400 focus:outline-none transition"
                            />
                            <button
                              type="button"
                              onClick={() => setShowLoginMobilePassword(!showLoginMobilePassword)}
                              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition"
                            >
                              {showLoginMobilePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
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
                          <span>{loading ? 'Logging in...' : t('auth.login')}</span>
                          {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                      </form>
                    ) : (
                      /* Mode 2: Email Login Form */
                      <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
                        <div>
                          <label className="text-slate-700 font-bold block mb-1.5">
                            {t('auth.emailAddress')}
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
                              {t('auth.password')}
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setIsForgotPasswordMode(true);
                                setForgotStep(1);
                                if (loginEmail) setForgotEmail(loginEmail);
                                setError('');
                              }}
                              className="text-teal-600 hover:underline font-bold text-xs"
                            >
                              {t('auth.forgotPassword')}
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
                          <span>{loading ? 'Logging in...' : t('auth.login')}</span>
                          {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                      </form>
                    )}

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('signup');
                          setError('');
                          setSignupStep(1);
                          setEmailRegisteredError(false);
                        }}
                        className="text-xs font-bold text-slate-600 hover:text-teal-700 transition"
                      >
                        {t('auth.newUser')} <span className="text-teal-600 underline">{t('auth.createAccountForTn')}</span>
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
                            {t('auth.fullName')}
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
                            {t('auth.mobileSignupLabel')}
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
                            {t('auth.emailSignupLabel')}
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
                                if (emailRegisteredError) setEmailRegisteredError(false);
                              }}
                              placeholder="e.g. yourname@gmail.com"
                              className={`w-full pl-10 pr-4 py-3 rounded-2xl border ${
                                emailRegisteredError ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:border-teal-600'
                              } focus:outline-none text-slate-800`}
                            />
                          </div>

                          {emailRegisteredError && (
                            <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
                              <div className="flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                <span>{t('auth.emailAlreadyRegistered')}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setLoginEmail(signupEmail.trim().toLowerCase());
                                  setActiveTab('login');
                                  setLoginMode('email');
                                  setError('');
                                  setEmailRegisteredError(false);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] shrink-0 transition cursor-pointer shadow-sm"
                              >
                                {t('auth.goToLogin')}
                              </button>
                            </div>
                          )}
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
                          <span>{loading ? (loadingText || 'Checking email...') : t('auth.continueSendOtp')}</span>
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
                            {t('auth.enterOtp')}
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
                          <span>{loading ? 'Verifying...' : t('auth.verifyEmail')}</span>
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
                            {t('auth.setPassword')}
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
                            {t('auth.confirmPassword')}
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
                          <span>{loading ? 'Creating Account...' : t('auth.createAccount')}</span>
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
                            {t('auth.alreadyRegistered')} <span className="text-teal-600 underline">{t('auth.loginHere')}</span>
                          </button>
                        </div>
                      </form>
                    )}

                  </div>
                )}
              </>
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