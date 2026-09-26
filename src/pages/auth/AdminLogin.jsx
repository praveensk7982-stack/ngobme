import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { setUser, setRole } = useAuth();
  const [email, setEmail] = useState('admin@ngo-tn.gov.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Admin email is required.');
      return;
    }

    if (!password) {
      setError('Admin password is required.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const adminData = {
        name: 'State Secretarial Admin',
        email: email.trim(),
        district: 'State Secretariat, Chennai',
        badge: 'State Admin Lead'
      };

      localStorage.setItem('tn_ngo_auth', JSON.stringify({ user: adminData, role: 'admin' }));
      if (setUser) setUser(adminData);
      if (setRole) setRole('admin');

      setToastMessage('State Secretariat Admin access granted!');

      setTimeout(() => {
        navigate('/admin');
      }, 500);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0f1e3d] to-slate-950 flex flex-col font-sans text-white selection:bg-amber-500 selection:text-slate-950">
      
      {/* Decorative Top Amber Line */}
      <div className="h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 w-full shrink-0" />

      {/* Header Bar */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-amber-300 tracking-tight leading-none flex items-center gap-1.5">
              TN NGO Connect <span className="text-[10px] bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2 py-0.5 rounded-full font-extrabold uppercase">Govt Portal</span>
            </h1>
            <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
              State Secretariat Control Console
            </span>
          </div>
        </Link>

        <Link
          to="/login"
          className="px-3.5 py-1.5 rounded-full border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>User Portal</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-8 px-4 flex items-center justify-center">
        
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-5 z-50 bg-amber-500 text-slate-950 text-xs font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* CENTERED CARD */}
        <div className="w-full max-w-[440px] bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-auto">
          
          {/* Card Top Banner */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 p-6 text-slate-950 text-center relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-slate-950/20 backdrop-blur-md border border-slate-950/30 flex items-center justify-center text-slate-950 mx-auto mb-3 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-slate-950" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-950">
              State Admin Portal
            </h2>
            <p className="text-xs text-slate-900 font-bold mt-1">
              Government of Tamil Nadu Welfare Secretariat
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-4">
            
            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  Official Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ngo-tn.gov.in"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  Admin Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 focus:border-amber-400 text-white placeholder-slate-500 focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer mt-2"
              >
                <span>{loading ? 'Authenticating Admin...' : 'Authenticate State Admin'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 text-center">
              <Link to="/login" className="text-xs font-bold text-slate-400 hover:text-amber-300 transition">
                Return to Volunteer / NGO User Login →
              </Link>
            </div>

          </div>
        </div>

      </main>

    </div>
  );
}
