import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Building2, 
  CalendarHeart, 
  Users, 
  HeartHandshake, 
  Search, 
  Activity, 
  Bell, 
  Settings,
  X,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ mobileOpen, setMobileOpen, unreadNotificationsCount = 12 }) {
  const { t } = useTranslation();

  const navItems = [
    { to: '/', labelKey: 'nav.home', icon: Home, badge: null, end: true },
    { to: '/ngo-directory', labelKey: 'nav.ngoDirectory', icon: Building2, badge: null },
    { to: '/camps-events', labelKey: 'nav.campsEvents', icon: CalendarHeart, badge: null },
    { to: '/volunteer', labelKey: 'nav.volunteer', icon: Users, badge: null },
    { to: '/donate', labelKey: 'nav.donate', icon: HeartHandshake, badge: null },
    { to: '/find-help', labelKey: 'nav.findHelp', icon: Search, badge: null },
    { to: '/my-activity', labelKey: 'nav.myActivity', icon: Activity, badge: null },
    { to: '/notifications', labelKey: 'nav.notifications', icon: Bell, badge: unreadNotificationsCount },
    { to: '/settings', labelKey: 'nav.settings', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between 
          w-[240px] bg-[#0f1e3d] text-white shadow-2xl transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Top Header & Logo */}
        <div className="p-5 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <NavLink 
              to="/" 
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 group"
            >
              {/* Gopuram emblem logo */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white font-bold text-lg border border-blue-400/30 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 fill-current text-amber-300" viewBox="0 0 24 24">
                  <path d="M12 2L9 7H15L12 2ZM8 8L5 13H19L16 8H8ZM4 14L2 20H22L20 14H4ZM12 16A2 2 0 1 1 12 20A2 2 0 0 1 12 16Z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1">
                  {t('common.appName')}
                </h1>
                <p className="text-[11px] text-blue-200/80 font-medium">{t('common.tagline')}</p>
              </div>
            </NavLink>

            {/* Mobile close button */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold
                  transition-all duration-200 group
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold border border-blue-400/30 translate-x-1' 
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white hover:translate-x-0.5'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-blue-300'}`} />
                      <span>{t(item.labelKey)}</span>
                    </div>

                    {item.badge ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white shadow-sm animate-pulse">
                        {item.badge}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Decorative Illustration Card */}
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-b from-slate-800/90 to-[#16284e] border border-blue-500/20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:8px_8px]" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-full h-14 mb-2 flex items-center justify-center text-amber-400/90 group-hover:scale-105 transition-transform duration-300">
              <svg className="h-full w-auto drop-shadow-md" viewBox="0 0 120 70" fill="currentColor">
                <path d="M 60 5 L 53 16 L 67 16 Z" />
                <rect x="50" y="16" width="20" height="4" rx="1" fill="#f59e0b" />
                <path d="M 46 20 L 41 32 L 79 32 L 74 20 Z" />
                <rect x="38" y="32" width="44" height="5" rx="1" fill="#f59e0b" />
                <path d="M 34 37 L 27 52 L 93 52 L 86 37 Z" />
                <rect x="22" y="52" width="76" height="6" rx="1" fill="#f59e0b" />
                <rect x="18" y="58" width="84" height="12" rx="2" fill="currentColor" />
                <path d="M 52 70 L 52 61 A 8 8 0 0 1 68 61 L 68 70 Z" fill="#0f1e3d" />
              </svg>
            </div>

            <p className="text-[11px] font-bold text-amber-300 tracking-wide uppercase mb-0.5">Tamil Nadu Pride</p>
            <p className="text-[11px] font-semibold text-slate-200 leading-snug">
              {t('nav.prideTagline')}
            </p>
            
            <div className="mt-2.5 pt-2 border-t border-slate-700/60 w-full flex items-center justify-center gap-1 text-[10px] text-blue-200/90 font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified NGO Network
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
