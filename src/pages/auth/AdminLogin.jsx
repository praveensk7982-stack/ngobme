import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Key, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@ngo-tn.gov.in');
  const [password, setPassword] = useState('admin2026pass');
  const [adminCode, setAdminCode] = useState('TN-GOV-2026');
  const [error, setError] = useState('');

  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter Admin Email and Password.');
      return;
    }

    loginAdmin(email, 'State Secretarial Admin');
    navigate('/admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      
      {/* Dark Navy Admin Card (#0f1e3d) */}
      <div className="bg-[#0f1e3d] text-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-500/30 relative overflow-hidden">
        
        {/* Glow & Watermark */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-2 left-2 opacity-5 pointer-events-none">
          <ShieldAlert className="w-48 h-48 text-amber-400" />
        </div>

        {/* Back Link */}
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-amber-300 transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Main Site
          </Link>
        </div>

        {/* Admin Branding Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 text-white font-extrabold flex items-center justify-center shadow-xl shadow-amber-500/20 mx-auto mb-3 border border-amber-400/30">
            <ShieldCheck className="w-8 h-8 text-slate-950" />
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold tracking-widest uppercase border border-amber-400/30 inline-block mb-2">
            Restricted Government Portal
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">TN NGO Admin Portal</h1>
          <p className="text-xs text-blue-200/80 font-medium mt-1">Statewide Welfare Officer & Verification Access</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold relative z-10">
          
          <div>
            <label className="text-slate-300 block mb-1">Official Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ngo-tn.gov.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:border-amber-400 focus:outline-none placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:border-amber-400 focus:outline-none placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1">Government Security Code</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="TN-GOV-2026"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-amber-300 font-mono font-bold focus:border-amber-400 focus:outline-none uppercase"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 active:scale-95 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticate & Access Admin Console</span>
          </button>

        </form>

        {/* Demo Admin Credentials Note */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-400 relative z-10">
          <p className="font-medium">
            Demo Credentials: <span className="text-amber-300 font-bold">admin@ngo-tn.gov.in</span> / <span className="text-amber-300 font-bold">admin2026pass</span>
          </p>
        </div>

      </div>
    </div>
  );
}
