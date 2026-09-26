import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Search, Mic, MicOff, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { ALL_TN_DISTRICTS } from '../data/mockData';

export default function HeroBanner({ selectedDistrict: propDistrict, setSelectedDistrict: propSetDistrict }) {
  const { t } = useTranslation();
  const [district, setDistrict] = useState(propDistrict || 'All Districts');
  const [searchText, setSearchText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const recognitionRef = useRef(null);

  const navigate = useNavigate();

  const handleDistrictSearchSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (propSetDistrict) {
      propSetDistrict(district);
    }

    const searchParams = new URLSearchParams();
    if (district && district !== 'All Districts') {
      searchParams.set('district', district);
    }
    if (searchText.trim()) {
      searchParams.set('q', searchText.trim());
    }

    const queryStr = searchParams.toString();
    navigate(`/ngo-directory${queryStr ? `?${queryStr}` : ''}`);
  };

  const handleVoiceSearch = () => {
    setVoiceError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Voice search is not supported in this browser.');
      setTimeout(() => setVoiceError(''), 4000);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSearchText(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setVoiceError('Could not recognize voice. Please try again.');
          setTimeout(() => setVoiceError(''), 4000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition exception:', err);
      setIsListening(false);
      setVoiceError('Voice search initialization failed.');
      setTimeout(() => setVoiceError(''), 4000);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0f1e3d] via-[#16284e] to-[#1e3461] text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-blue-900/40">
      
      {/* Background Graphic Patterns & Gopuram Motif */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

      {/* Gopuram Watermark Background */}
      <div className="absolute right-4 bottom-0 opacity-10 pointer-events-none hidden md:block">
        <svg className="w-72 h-72 text-amber-300 fill-current" viewBox="0 0 100 100">
          <path d="M 50 5 L 42 20 L 58 20 Z" />
          <path d="M 38 22 L 30 40 L 70 40 L 62 22 Z" />
          <path d="M 28 42 L 18 65 L 82 65 L 72 42 Z" />
          <rect x="12" y="67" width="76" height="30" rx="2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl">
        
        {/* Handwritten caption top-right */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Statewide Social Impact Platform</span>
          </div>

          <div className="hidden sm:block text-right">
            <span className="font-handwriting text-amber-300 text-lg sm:text-xl font-bold tracking-wide transform -rotate-1 inline-block drop-shadow">
              {t('common.tagline')}
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight mb-3">
          {t('home.heroTitle')}
        </h1>

        {/* Subtext */}
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal mb-6 max-w-2xl">
          {t('home.heroSubtitle')}
        </p>

        {/* Search by District Bar Form */}
        <form 
          onSubmit={handleDistrictSearchSubmit}
          className="bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-2 relative"
        >
          {/* District Select Dropdown */}
          <div className="flex items-center gap-2 px-3 w-full sm:w-auto text-slate-700">
            <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="text-xs font-bold whitespace-nowrap hidden md:inline">District:</span>
            
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full sm:w-48 py-2 bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All Districts">All 38 Districts</option>
              {ALL_TN_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div className="h-6 w-px bg-slate-300 hidden sm:block" />

          {/* Free-text input with Microphone button */}
          <div className="flex-1 w-full relative flex items-center">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by district, city, or service (e.g., Chennai, Eye Camp)..."
              className="w-full pl-3 pr-10 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
            />

            {/* Microphone Voice Search Button */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              aria-label={isListening ? "Listening for voice search input" : "Search by voice"}
              title={isListening ? "Listening... Speak now" : "Click to speak search query"}
              className={`absolute right-2 p-1.5 rounded-full transition-all ${
                isListening 
                  ? 'bg-rose-100 text-rose-600 animate-pulse ring-2 ring-rose-500' 
                  : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              {isListening ? (
                <div className="relative flex items-center justify-center">
                  <MicOff className="w-4 h-4 text-rose-600" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                </div>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Search District Button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>{t('home.searchNgo')}</span>
          </button>
        </form>

        {/* Voice Search Fallback Error Toast */}
        {voiceError && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/90 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{voiceError}</span>
          </div>
        )}

        {/* Quick Stats Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-blue-200">
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Government Registered NGOs
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Updates Across 38 TN Districts
          </div>
        </div>

      </div>
    </div>
  );
}
