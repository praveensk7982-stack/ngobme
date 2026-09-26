import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

// Centered Loading Spinner Component
export function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans selection:bg-teal-600 selection:text-white">
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 via-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-teal-600/30 animate-pulse">
          <Heart className="w-7 h-7 text-white fill-current" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            TN NGO Connect
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Verifying secure session...
          </p>
        </div>
        <div className="w-6 h-6 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mt-1" />
      </div>
    </div>
  );
}

// User Protected Route Wrapper
export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Admin Protected Route Wrapper
export function AdminProtectedRoute() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user || role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
