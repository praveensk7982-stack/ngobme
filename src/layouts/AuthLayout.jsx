import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthLayout() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">
        Loading session...
      </div>
    );
  }

  // If user is ALREADY logged in, redirect away from auth pages to home or admin
  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  if (role === 'user') {
    return <Navigate to="/" replace />;
  }

  // Standalone layout with ONLY the auth page content (no topbar, no sidebar)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      <Outlet />
    </div>
  );
}
