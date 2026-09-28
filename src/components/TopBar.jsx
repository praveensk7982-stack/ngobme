import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Mic, 
  MicOff, 
  Bell, 
  ChevronDown, 
  Menu, 
  User, 
  Heart, 
  LogOut, 
  SlidersHorizontal,
  CheckCircle2,
  Building2,
  Calendar,
  Tag,
  X,
  AlertCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { INITIAL_NOTIFICATIONS, getCombinedSearchData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import AIAssistantModal from './AIAssistantModal';

import { useVoiceSearch } from '../utils/useVoiceSearch';

export default function TopBar({ 
  searchQuery, 
  setSearchQuery, 
  setMobileOpen,
  unreadNotificationsCount,
  onOpenDonateModal,
  onClearNotifications
}) {
  const { t } = useTranslation();
  const { user: authUser, role, logout } = useAuth();
  
  const user = authUser || {
    name: 'Dharshini Raj',
    email: 'dharshini@ngo-tn.org',
    district: 'Chennai',
    badge: 'Verified Volunteer Lead'
  };
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const blurTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Use reusable Voice Search Hook
  const { isListening, speechError, toggleVoiceSearch } = useVoiceSearch((transcript) => {
    setSearchQuery(transcript);
    setIsFocused(true);
  });

  const toggleMic = () => {
    toggleVoiceSearch();
    setIsFocused(true);
  };

  const handleFocus = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    setIsFocused(true);
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 0) {
      setIsFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectResult = (item) => {
    setIsFocused(false);
    setSearchQuery('');

    if (item.type === 'ngo') {
      navigate(`/ngo-directory?q=${encodeURIComponent(item.title)}&id=${item.id}`);
    } else if (item.type === 'camp') {
      navigate(`/camps-events?id=${item.id}&campId=${item.id}`);
    } else if (item.type === 'category') {
      navigate(`/ngo-directory?category=${encodeURIComponent(item.title)}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(item.title)}`);
    }
  };

  // Live filter combined search data
  const allSearchData = getCombinedSearchData();
  const trimmedQuery = searchQuery.trim().toLowerCase();

  const filteredItems = trimmedQuery.length > 0
    ? allSearchData.filter(item => 
        item.title.toLowerCase().includes(trimmedQuery) ||
        item.category.toLowerCase().includes(trimmedQuery) ||
        item.district.toLowerCase().includes(trimmedQuery) ||
        (item.description && item.description.toLowerCase().includes(trimmedQuery))
      )
    : [];

  const ngoMatches = filteredItems.filter(i => i.type === 'ngo');
  const campMatches = filteredItems.filter(i => i.type === 'camp');
  const categoryMatches = filteredItems.filter(i => i.type === 'category');

  const showDropdown = isFocused && trimmedQuery.length > 0;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Mobile Menu Toggle & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl relative">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Input Container */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition">
              <Search className="w-4 h-4" />
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={t('common.searchPlaceholder')}
              className="w-full pl-10 pr-16 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-2xl text-xs sm:text-sm text-slate-900 focus:text-slate-900 placeholder:text-slate-400 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
            />

            {/* Right Icons: Clear Button + Voice Mic Icon */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
              {searchQuery.length > 0 && (
                <button
                  onClick={handleClear}
                  title="Clear search"
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={toggleMic}
                aria-label="Voice search"
                title={isListening ? "Listening..." : "Voice search"}
                className={`p-1 rounded-full transition-all ${
                  isListening 
                    ? 'text-rose-500 animate-pulse ring-2 ring-rose-400/40 bg-rose-50' 
                    : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4 text-rose-500" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Search Results Dropdown Panel */}
            {showDropdown && (
              <div className="absolute -left-12 sm:left-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-full min-w-[calc(100vw-2rem)] sm:min-w-full bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 max-h-96 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-150 box-border">
                {filteredItems.length === 0 ? (
                  <div className="px-5 py-4 text-center text-xs font-semibold text-slate-500">
                    No results found for <span className="text-slate-800 font-bold">"{searchQuery}"</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Section 1: NGOs */}
                    {ngoMatches.length > 0 && (
                      <div>
                        <div className="px-3.5 sm:px-4 py-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50/60 border-y border-blue-100">
                          <Building2 className="w-3 h-3 text-blue-600 shrink-0" />
                          <span>NGOs ({ngoMatches.length})</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                          {ngoMatches.map((item) => (
                            <div
                              key={item.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectResult(item);
                              }}
                              onClick={() => handleSelectResult(item)}
                              className="px-3.5 sm:px-4 py-2.5 hover:bg-blue-50/80 transition cursor-pointer flex items-center gap-3 group w-full text-left"
                            >
                              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Building2 className="w-4 h-4 shrink-0" />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition leading-snug whitespace-normal break-normal text-left">{item.title}</p>
                                <p className="text-[10px] sm:text-xs font-medium text-slate-500 truncate text-left mt-0.5">{item.subtext}</p>
                              </div>
                              <span className="text-[10px] sm:text-xs font-bold text-blue-600 shrink-0 opacity-0 group-hover:opacity-100 transition hidden sm:block ml-auto">View →</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 2: Camps & Events */}
                    {campMatches.length > 0 && (
                      <div>
                        <div className="px-3.5 sm:px-4 py-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50/60 border-y border-emerald-100">
                          <Calendar className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Camps & Events ({campMatches.length})</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                          {campMatches.map((item) => (
                            <div
                              key={item.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectResult(item);
                              }}
                              onClick={() => handleSelectResult(item)}
                              className="px-3.5 sm:px-4 py-2.5 hover:bg-emerald-50/80 transition cursor-pointer flex items-center gap-3 group w-full text-left"
                            >
                              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Calendar className="w-4 h-4 shrink-0" />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition leading-snug whitespace-normal break-normal text-left">{item.title}</p>
                                <p className="text-[10px] sm:text-xs font-medium text-slate-500 truncate text-left mt-0.5">{item.subtext}</p>
                              </div>
                              <span className="text-[10px] sm:text-xs font-bold text-emerald-600 shrink-0 opacity-0 group-hover:opacity-100 transition hidden sm:block ml-auto">View Details →</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 3: Categories */}
                    {categoryMatches.length > 0 && (
                      <div>
                        <div className="px-3.5 sm:px-4 py-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50/60 border-y border-amber-100">
                          <Tag className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Categories ({categoryMatches.length})</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                          {categoryMatches.map((item) => (
                            <div
                              key={item.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectResult(item);
                              }}
                              onClick={() => handleSelectResult(item)}
                              className="px-3.5 sm:px-4 py-2.5 hover:bg-amber-50/80 transition cursor-pointer flex items-center gap-3 group w-full text-left"
                            >
                              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Tag className="w-4 h-4 shrink-0" />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-600 transition leading-snug whitespace-normal break-normal text-left">{item.title}</p>
                                <p className="text-[10px] sm:text-xs font-medium text-slate-500 truncate text-left mt-0.5">{item.subtext}</p>
                              </div>
                              <span className="text-[10px] sm:text-xs font-bold text-amber-600 shrink-0 opacity-0 group-hover:opacity-100 transition hidden sm:block ml-auto">Explore →</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {speechError && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Language Switcher, Admin Badge/Donate Button, Notification Bell, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Global Language Switcher */}
          <LanguageSwitcher />

          {user && role === 'admin' ? (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-sm active:scale-95 shrink-0"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span className="hidden md:inline">Admin Console</span>
            </Link>
          ) : (
            <button
              onClick={onOpenDonateModal}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition shadow-sm active:scale-95 shrink-0"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
              <span>{t('common.donateNow')}</span>
            </button>
          )}

          {/* AI Assistant Button (Replaces Notification Bell) */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowAIAssistant(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-blue-600/20 border border-blue-400/30 transition active:scale-95 cursor-pointer"
              aria-label="Open AI Assistant"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </div>

          <AIAssistantModal 
            isOpen={showAIAssistant} 
            onClose={() => setShowAIAssistant(false)} 
          />

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* USER PROFILE DISPLAY */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition group"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md ring-2 ring-white">
                  {user.name[0]}
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
              </div>

              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1 group-hover:text-blue-600 transition">
                  {user.name}
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-[10px] text-slate-500 font-medium block -mt-0.5">{user.badge}</span>
              </div>

              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    {t('common.verifiedVolunteerLead')}
                  </span>
                </div>

                <div className="py-1 text-xs">
                  <Link 
                    to="/my-activity" 
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <User className="w-4 h-4 text-slate-400" /> {t('nav.myActivity')}
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-slate-400" /> {t('nav.settings')}
                  </Link>
                  {user && role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-500" /> {t('nav.adminConsole')}
                    </Link>
                  )}
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button 
                    onClick={async () => {
                      try {
                        setShowUserMenu(false);
                        if (logout) {
                          await logout();
                        }
                      } catch (err) {
                        console.error('Sign out error:', err);
                      } finally {
                        navigate('/login');
                      }
                    }}
                    className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-xs font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" /> {t('common.signOut')}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
