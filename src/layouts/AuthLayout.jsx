import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      <Outlet />
    </div>
  );
}
