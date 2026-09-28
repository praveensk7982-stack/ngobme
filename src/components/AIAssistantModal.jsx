import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  RotateCcw, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Siren, 
  MapPin, 
  Clock, 
  Users, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVoiceSearch } from '../utils/useVoiceSearch';
import { UPCOMING_EVENTS, FEATURED_NGOS } from '../data/mockData';
import { getVolunteerOpenings } from '../lib/volunteerOpenings';
import { getApprovedNGOs } from '../lib/ngoData';

export default function AIAssistantModal({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const userDistrict = authUser?.district || 'Chennai';
  const chatEndRef = useRef(null);

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [lastPrompt, setLastPrompt] = useState('');

  // Voice Search Hook
  const { isListening, speechError, toggleVoiceSearch } = useVoiceSearch((transcript) => {
    setInputMessage(transcript);
  });

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const handleNewChat = () => {
    setMessages([]);
    setApiError(null);
    setInputMessage('');
  };

  // Local fallback smart recommendation engine if server backend is unconfigured or offline
  const generateLocalSmartRecommendation = async (userQuery, history, district) => {
    const q = userQuery.toLowerCase().trim();
    const isTa = i18n.language === 'ta' || /[அ-ஹ]/.test(userQuery);
    
    // Check Emergency keywords
    const isEmergency = q.includes('emergency') || q.includes('accident') || q.includes('heart attack') || q.includes('blood urgent') || q.includes('critical') || q.includes('108') || q.includes('அவசரம்');

    let replyMessage = '';
    const recs = [];

    if (isEmergency) {
      replyMessage = isTa 
        ? "🚨 அவசர உதவி அறிவிப்பு: உடனடி ஆபத்து அல்லது மருத்துவ அவசரநிலைகளுக்கு, உடனடியாக 108 தமிழ்நாடு ஆம்புலன்ஸ் உதவி எண்ணை அழைக்கவும். கீழே உள்ள நேரடி அவசர அறிவிப்புகளைப் பார்க்கவும்:"
        : "🚨 EMERGENCY NOTICE: For immediate life-threatening medical emergencies, dial the 108 Tamil Nadu Ambulance Emergency Helpline immediately. Below are live statewide public alerts:";

      recs.push({
        id: 'emg-alert-1',
        type: 'Emergency Alert',
        title: 'Urgent O-Negative Blood Required for Surgery at GH Madurai',
        date: 'Immediate / Urgent',
        venue: 'GH Madurai, Ward 4',
        district: 'Madurai',
        spotsLeft: 'Critical Urgency • Hotline: +91 9342637020'
      });
    }

    // Search Camps
    const matchedCamps = UPCOMING_EVENTS.filter(evt => {
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.category.toLowerCase().includes(q) ||
        evt.district.toLowerCase().includes(q) ||
        (q.includes('eye') && evt.category === 'Medical') ||
        (q.includes('health') && (evt.category === 'Medical' || evt.category === 'Health')) ||
        (q.includes('blood') && evt.category === 'Blood') ||
        (q.includes('diabetes') && evt.category === 'Health')
      );
    });

    matchedCamps.slice(0, 3).forEach(c => {
      recs.push({
        id: c.id,
        type: c.camp_type === 'government' ? 'Govt Camp' : 'Private Health Camp',
        title: c.title,
        date: c.date,
        venue: c.location,
        district: c.district,
        spotsLeft: c.spots || `${c.spots_available || 100} spots left`
      });
    });

    // Search NGOs
    if (recs.length < 3) {
      let approvedNGOList = FEATURED_NGOS;
      try {
        approvedNGOList = await getApprovedNGOs();
      } catch (e) {
        console.warn('AIAssistant getApprovedNGOs fallback:', e);
      }

      const matchedNGOs = approvedNGOList.filter(ngo => {
        return (
          ngo.name.toLowerCase().includes(q) ||
          ngo.category.toLowerCase().includes(q) ||
          (ngo.district && ngo.district.toLowerCase().includes(q))
        );
      });

      matchedNGOs.slice(0, 3 - recs.length).forEach(ngo => {
        recs.push({
          id: ngo.id,
          type: 'NGO Drive',
          title: ngo.name,
          date: 'Ongoing Community Service',
          venue: `${ngo.category} Center`,
          district: ngo.district,
          spotsLeft: `${ngo.volunteers}`
        });
      });
    }

    // Search Volunteer Openings
    if (q.includes('volunteer') || q.includes('work') || q.includes('teaching')) {
      const openings = await getVolunteerOpenings();
      openings.filter(o => o.status === 'active').slice(0, 2).forEach(op => {
        recs.push({
          id: op.id,
          type: 'Volunteer Opening',
          title: op.title,
          date: op.time_commitment,
          venue: op.ngo_name,
          district: op.district,
          spotsLeft: 'Direct Recruitment'
        });
      });
    }

    if (!isEmergency) {
      if (recs.length > 0) {
        replyMessage = isTa
          ? `${recs.length} உங்களுக்கான சிறந்த சமூக மருத்துவ மற்றும் தன்னார்வ முகாம்கள் கண்டறியப்பட்டன:`
          : `I found ${recs.length} verified camps and community services matching your request in ${district} & surrounding districts:`;
      } else {
        replyMessage = isTa
          ? `மன்னிக்கவும், உங்கள் குறிப்பிட்ட தேடலுக்குத் துல்லியமான முகாம்கள் எதுவும் தற்போது கிடைக்கவில்லை. ${district} அல்லது அருகிலுள்ள சென்னை/மதுரை மாவட்டங்களில் உள்ள பொது சுகாதார முகாம்களைப் பார்க்கவும்.`
          : `No exact upcoming camps matched "${userQuery}" in ${district} right now. Here are active general health and blood donation drives across Tamil Nadu.`;

        // Fallback default recommendations
        UPCOMING_EVENTS.slice(0, 2).forEach(c => {
          recs.push({
            id: c.id,
            type: 'Govt Camp',
            title: c.title,
            date: c.date,
            venue: c.location,
            district: c.district,
            spotsLeft: c.spots
          });
        });
      }
    }

    // Append medical disclaimer for medical queries
    const isMedicalQuery = q.includes('eye') || q.includes('health') || q.includes('doctor') || q.includes('diabetes') || q.includes('check') || q.includes('hospital');
    if (isMedicalQuery) {
      replyMessage += isTa
        ? "\n\n(குறிப்பு: இது மருத்துவ ஆலோசனை அல்ல. பரிசோதனைகளுக்கு மருத்துவ நிபுணரை அணுகவும்.)"
        : "\n\n(Note: This is not medical advice. For diagnostic evaluation, please consult a certified medical professional.)";
    }

    return {
      message: replyMessage,
      recommendations: recs
    };
  };

  const handleSendMessage = async (customPrompt = null) => {
    const textToSend = customPrompt || inputMessage.trim();
    if (!textToSend || isThinking) return;

    setLastPrompt(textToSend);
    setInputMessage('');
    setApiError(null);

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      let aiResult = null;

      // Primary: Try Vercel Serverless Function or HTTPS Backend API Endpoint
      // Note: Must use full HTTPS URL if environment endpoint defined
      const apiEndpoint = import.meta.env.VITE_AI_ASSISTANT_URL || '/api/ai-assistant';
      
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend,
            history: messages.slice(-4).map(m => ({ sender: m.sender, text: m.text })),
            district: userDistrict
          })
        });

        if (response.ok) {
          aiResult = await response.json();
        }
      } catch (backendErr) {
        console.warn('Backend /api/ai-assistant connection notice, switching to smart local engine:', backendErr);
      }

      // Fallback: Smart local matching engine
      if (!aiResult || !aiResult.message) {
        aiResult = await generateLocalSmartRecommendation(textToSend, messages, userDistrict);
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResult.message || 'I have analyzed your request across Tamil Nadu camps and NGO services.',
        recommendations: aiResult.recommendations || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI Assistant Error:', err);
      setApiError('Unable to process request right now. Please check your connection and try again.');
    } finally {
      setIsThinking(false);
    }
  };

  const handleCardClick = (rec) => {
    onClose();
    if (rec.type === 'Emergency Alert') {
      navigate('/emergency');
    } else if (rec.type === 'Volunteer Opening') {
      navigate('/volunteer');
    } else if (rec.type === 'NGO Drive') {
      navigate(`/ngo-directory?q=${encodeURIComponent(rec.title)}`);
    } else {
      navigate(`/camps-events?id=${rec.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      
      {/* Slide-Over Panel (Desktop: Right Drawer, Mobile: Full-Screen Bottom Sheet) */}
      <div className="w-full sm:w-[460px] bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0f1e3d] via-indigo-950 to-blue-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                CampVexi AI Assistant
                <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[9px] font-bold border border-blue-400/30">Smart Finder</span>
              </h2>
              <p className="text-[11px] text-blue-200/80 font-medium">Camps, NGOs & Emergency Help in TN</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleNewChat}
              className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition text-xs flex items-center gap-1 cursor-pointer"
              title="New Chat"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">New</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
          
          {/* Welcome Message & Suggestion Chips */}
          {messages.length === 0 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Welcome, {authUser?.name || 'Volunteer'}!</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  I am your AI assistant for Tamil Nadu. Ask me about free eye check-ups, blood donation camps, health screenings near {userDistrict}, or volunteer drives.
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Quick Suggestions:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    "Free eye check-up",
                    "Blood donation camps",
                    "Health camps near me",
                    "Volunteer opportunities"
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendMessage(chip)}
                      className="p-3 rounded-2xl bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-900 font-bold text-left shadow-xs transition flex items-center justify-between cursor-pointer group"
                    >
                      <span>{chip}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-br-none shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none shadow-sm font-medium'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[9px] mt-1 block font-semibold text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                  {msg.time}
                </span>
              </div>

              {/* Recommendation Cards */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="w-full space-y-2 pt-1 animate-in fade-in">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recommended Services:</p>
                  {msg.recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-blue-300 transition"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          rec.type.includes('Govt') ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                          rec.type.includes('Emergency') ? 'bg-rose-600 text-white font-black' :
                          rec.type.includes('Volunteer') ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {rec.type}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">📍 {rec.district}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{rec.title}</h4>
                      <div className="text-[11px] text-slate-600 font-semibold space-y-0.5">
                        <p className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-600 shrink-0" /> {rec.date}</p>
                        <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {rec.venue}</p>
                        {rec.spotsLeft && <p className="text-emerald-700 font-bold text-[10px]">👥 {rec.spotsLeft}</p>}
                      </div>

                      <button
                        onClick={() => handleCardClick(rec)}
                        className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1 cursor-pointer mt-1"
                      >
                        <span>View & Register</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Thinking Indicator */}
          {isThinking && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs font-semibold w-fit animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Analyzing camps & services across Tamil Nadu...</span>
            </div>
          )}

          {/* Error Message */}
          {apiError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold space-y-2">
              <p className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{apiError}</span>
              </p>
              <button
                onClick={() => handleSendMessage(lastPrompt)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Search</span>
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2">
          {speechError && (
            <p className="text-[10px] text-rose-600 font-bold px-1">{speechError}</p>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleVoiceSearch}
              className={`p-2.5 rounded-xl transition cursor-pointer shrink-0 ${
                isListening 
                  ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Voice Search"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask about camps, eye check-ups, blood, or NGOs..."
              className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
            />

            <button
              type="button"
              disabled={!inputMessage.trim() || isThinking}
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition cursor-pointer shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
