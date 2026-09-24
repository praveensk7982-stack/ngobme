import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function UserProtectedRoute() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">
        Loading session...
      </div>
    );
  }

  // If NOT logged in as user or admin, redirect to /login
  if (role !== 'user' && role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminProtectedRoute() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">
        Loading admin session...
      </div>
    );
  }

  // Strict check: Only role === 'admin' can access /admin
  if (role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
}
