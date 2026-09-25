import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  LogIn,
  ShieldCheck,
  ShieldAlert,
  UserPlus
} from 'lucide-react';
import { INITIAL_NOTIFICATIONS, getCombinedSearchData } from '../data/mockData';

export default function TopBar({ 
  searchQuery, 
  setSearchQuery, 
  setMobileOpen,
  unreadNotificationsCount,
  onOpenDonateModal,
  onClearNotifications
}) {
  const user = {
    name: 'Dharshini Raj',
    email: 'dharshini@ngo-tn.org',
    district: 'Chennai',
    badge: 'Verified Volunteer Lead'
  };
  
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const blurTimeoutRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const toggleMic = () => {
    setSpeechError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Voice search not supported in this browser.');
      setTimeout(() => setSpeechError(''), 4000);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setIsFocused(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setSearchQuery(transcript);
          setIsFocused(true);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setSpeechError('Could not recognize voice. Please try again.');
          setTimeout(() => setSpeechError(''), 4000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
      setSpeechError('Voice search failed to start.');
      setTimeout(() => setSpeechError(''), 4000);
    }
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
    if (item.type === 'ngo') {
      navigate('/ngo-directory');
    } else if (item.type === 'camp') {
      navigate('/camps-events');
    } else if (item.type === 'category') {
      navigate(`/search?q=${encodeURIComponent(item.title)}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(item.title)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  // Live filter combined search data on keystroke or voice input
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
              placeholder="Search NGOs, camps, services, or keywords..."
              className="w-full pl-10 pr-16 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-2xl text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
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
                title={isListening ? "Listening... Speak search query" : "Voice search"}
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
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 z-50 max-h-96 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-150">
                {filteredItems.length === 0 ? (
                  <div className="px-5 py-4 text-center text-xs font-semibold text-slate-500">
                    No results found for <span className="text-slate-800 font-bold">"{searchQuery}"</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    
                    {/* Section 1: NGOs */}
                    {ngoMatches.length > 0 && (
                      <div>
                        <div className="px-4 py-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50/60 border-y border-blue-100">
                          <Building2 className="w-3 h-3 text-blue-600" />
                          <span>NGOs ({ngoMatches.length})</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                          {ngoMatches.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleSelectResult(item)}
                              className="px-4 py-2.5 hover:bg-blue-50/80 transition cursor-pointer flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                  <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition leading-snug">{item.title}</p>
                                  <p className="text-[10px] font-medium text-slate-500">{item.subtext}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition">View →</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 2: Camps & Events */}
                    {campMatches.length > 0 && (
                      <div>
                        <div className="px-4 py-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50/60 border-y border-emerald-100">
                          <Calendar className="w-3 h-3 text-emerald-600" />
                          <span>Camps & Events ({campMatches.length})</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                          {campMatches.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleSelectResult(item)}
                              className="px-4 py-2.5 hover:bg-emerald-50/80 transition cursor-pointer flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                  <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition leading-snug">{item.title}</p>
                                  <p className="text-[10px] font-medium text-slate-500">{item.subtext}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition">Register →</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 3: Categories */}
                    {categoryMatches.length > 0 && (
                      <div>
                        <div className="px-4 py-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50/60 border-y border-amber-100">
                          <Tag className="w-3 h-3 text-amber-600" />
                          <span>Categories ({categoryMatches.length})</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                          {categoryMatches.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleSelectResult(item)}
                              className="px-4 py-2.5 hover:bg-amber-50/80 transition cursor-pointer flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                  <Tag className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition leading-snug">{item.title}</p>
                                  <p className="text-[10px] font-medium text-slate-500">{item.subtext}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition">Explore →</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="px-4 pt-2 pb-1 border-t border-slate-100 text-center">
                      <span className="text-[10px] font-semibold text-slate-400">
                        Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border text-slate-700 font-mono font-bold text-[9px]">Enter ↵</kbd> for full search results
                      </span>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* Speech Toast Alert */}
            {speechError && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Donate Button, Notification Bell, User/Admin Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          <button
            onClick={onOpenDonateModal}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition shadow-sm active:scale-95"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
            <span>Donate Now</span>
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notification Menu Card */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-90 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-800">Notifications</h3>
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                      {unreadNotificationsCount} New
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      if (onClearNotifications) onClearNotifications();
                    }}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                  {INITIAL_NOTIFICATIONS.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/notifications');
                      }}
                      className="p-3 hover:bg-slate-50 transition cursor-pointer flex gap-2.5"
                    >
                      <div className={`w-2 h-2 rounded-full ${notif.unread && unreadNotificationsCount > 0 ? 'bg-blue-600' : 'bg-slate-300'} mt-1.5 shrink-0`} />
                      <div>
                        <p className="text-xs font-medium text-slate-700 leading-snug">{notif.text}</p>
                        <span className="text-[10px] font-semibold text-slate-400 mt-1 inline-block">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 pt-2.5 border-t border-slate-100 text-center">
                  <Link 
                    to="/notifications" 
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                  >
                    View All Notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* USER PROFILE DISPLAY */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition group"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                  {user.name[0]}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
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
                    Verified Volunteer Lead
                  </span>
                </div>

                <div className="py-1 text-xs">
                  <Link 
                    to="/my-activity" 
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <User className="w-4 h-4 text-slate-400" /> My Profile & Activity
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-slate-400" /> Account Settings
                  </Link>
                  <Link 
                    to="/admin" 
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-500" /> Admin Console
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
