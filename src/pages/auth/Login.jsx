import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [tab, setTab] = useState('phone'); // 'phone' | 'email'
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const isPhoneValid = /^\d{10}$/.test(phone.trim());
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length >= 6;

  const isFilled = tab === 'phone' ? (phone.trim().length > 0 && password.length > 0) : (email.trim().length > 0 && password.length > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'phone') {
      if (!isPhoneValid) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
    } else {
      if (!isEmailValid) {
        setError('Please enter a valid email address.');
        return;
      }
    }

    if (!isPasswordValid) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const loginId = tab === 'phone' ? `${countryCode} ${phone}` : email;
    loginUser(loginId, 'Dharshini Raj');
    navigate('/');
  };

  const handleGoogleLogin = () => {
    setToastMessage('Google login coming soon!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fillDemo = () => {
    setError('');
    if (tab === 'phone') {
      setPhone('9444088776');
      setPassword('password123');
    } else {
      setEmail('dharshini@ngo-tn.org');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-8 px-4">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Main Centered Card (Max-width ~350px) */}
      <div className="w-full max-w-[350px] bg-white sm:border sm:border-slate-300 sm:rounded-2xl sm:shadow-2xs p-6 sm:p-8 space-y-4">
        
        {/* Top Wordmark Logo */}
        <div className="text-center pt-2 pb-1">
          <h1 className="font-['Pacifico',cursive] text-3xl text-slate-900 tracking-wide select-none">
            TN NGO Connect
          </h1>
        </div>

        {/* Input Mode Toggle Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500">
          <button
            type="button"
            onClick={() => { setTab('phone'); setError(''); }}
            className={`flex-1 py-2 text-center border-b-2 transition ${
              tab === 'phone' ? 'border-blue-600 text-blue-600 font-extrabold' : 'border-transparent hover:text-slate-800'
            }`}
          >
            Phone Number
          </button>
          <button
            type="button"
            onClick={() => { setTab('email'); setError(''); }}
            className={`flex-1 py-2 text-center border-b-2 transition ${
              tab === 'email' ? 'border-blue-600 text-blue-600 font-extrabold' : 'border-transparent hover:text-slate-800'
            }`}
          >
            Email Address
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Phone Number Mode */}
          {tab === 'phone' ? (
            <div>
              <div className="flex rounded-lg border border-slate-300 focus-within:border-slate-400 bg-slate-50/50 overflow-hidden">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-transparent pl-2.5 pr-1 py-2.5 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer border-r border-slate-200"
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                </select>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(''); }}
                  placeholder="Phone number (10 digits)"
                  className="w-full px-3 py-2.5 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>
            </div>
          ) : (
            /* Email Mode */
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="Email address"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 font-medium"
              />
            </div>
          )}

          {/* Password Input with Show/Hide Toggle */}
          <div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Password"
                className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-slate-300 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Inline Error Message */}
          {error && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Log In Button */}
          <button
            type="submit"
            disabled={!isFilled}
            className={`w-full py-2.5 rounded-lg font-extrabold text-xs shadow-2xs transition-all duration-200 mt-1 ${
              isFilled
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-98'
                : 'bg-blue-300 text-white/90 cursor-not-allowed'
            }`}
          >
            Log In
          </button>
        </form>

        {/* Demo Auto-Fill helper */}
        <div className="text-center">
          <button
            type="button"
            onClick={fillDemo}
            className="text-[11px] font-semibold text-blue-600 hover:underline"
          >
            Fill Demo {tab === 'phone' ? 'Phone' : 'Email'}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-center pt-1">
          <button type="button" className="text-[11px] font-bold text-slate-700 hover:text-blue-600 transition">
            Forgot password?
          </button>
        </div>

        {/* OR Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Google Login Button (Mock) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          {/* Google SVG Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Log in with Google</span>
        </button>

      </div>

      {/* Bottom Separate Box: Sign Up */}
      <div className="w-full max-w-[350px] bg-white sm:border sm:border-slate-300 sm:rounded-2xl p-4 text-center text-xs text-slate-600 font-medium mt-3">
        <span>Don't have an account? </span>
        <Link to="/signup" className="font-bold text-blue-600 hover:underline">
          Sign up
        </Link>
      </div>

      {/* Small Muted Footer */}
      <footer className="mt-8 text-center text-[11px] text-slate-400 font-medium">
        <p>TN NGO Connect © 2026 • Together for a Better Tomorrow</p>
      </footer>

    </div>
  );
}
