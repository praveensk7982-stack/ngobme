import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Reusable Voice Search Hook using Web Speech API & Capacitor Native Plugin Support
 * Automatically detects active i18n language ('en-IN', 'ta-IN', 'hi-IN')
 */
export function useVoiceSearch(onTranscriptReceived) {
  const { i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const getRecognitionLang = () => {
    const lang = i18n.language || 'en';
    if (lang.startsWith('ta')) return 'ta-IN';
    if (lang.startsWith('hi')) return 'hi-IN';
    return 'en-IN';
  };

  const toggleVoiceSearch = async () => {
    setSpeechError('');

    // Check if running inside Capacitor with native SpeechRecognition plugin
    if (window.Capacitor?.isPluginAvailable('SpeechRecognition')) {
      const { SpeechRecognition } = window.Capacitor.Plugins;
      try {
        if (isListening) {
          await SpeechRecognition.stop();
          setIsListening(false);
          return;
        }

        const { hasPermission } = await SpeechRecognition.hasPermission();
        if (!hasPermission) {
          const { permission } = await SpeechRecognition.requestPermission();
          if (!permission) {
            setSpeechError('Microphone permission denied on device.');
            setTimeout(() => setSpeechError(''), 4000);
            return;
          }
        }

        setIsListening(true);
        await SpeechRecognition.start({
          language: getRecognitionLang(),
          maxResults: 2,
          prompt: 'Speak now to search...',
          partialResults: true,
          popup: false
        });

        SpeechRecognition.addListener('partialResults', (data) => {
          if (data.matches && data.matches.length > 0 && onTranscriptReceived) {
            onTranscriptReceived(data.matches[0]);
          }
        });
        return;
      } catch (nativeErr) {
        console.warn('Capacitor native speech error:', nativeErr);
        setIsListening(false);
      }
    }

    // Standard Web Speech API Fallback
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Voice search is not supported on this browser or WebView. Install Android Speech Plugin for APK support.');
      setTimeout(() => setSpeechError(''), 5000);
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
      recognition.lang = getRecognitionLang();

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript && onTranscriptReceived) {
          onTranscriptReceived(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            setSpeechError('Microphone permission denied. Enable microphone access in settings.');
            break;
          case 'audio-capture':
            setSpeechError('No microphone hardware detected.');
            break;
          case 'service-not-allowed':
            setSpeechError('Speech recognition service unavailable on Android WebView.');
            break;
          case 'network':
            setSpeechError('Network connection required for voice recognition.');
            break;
          case 'no-speech':
            setSpeechError('No speech detected. Please speak clearly.');
            break;
          default:
            setSpeechError('Could not recognize voice. Please try again.');
        }
        setTimeout(() => setSpeechError(''), 4500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition exception:', err);
      setIsListening(false);
      setSpeechError('Voice search initialization failed.');
      setTimeout(() => setSpeechError(''), 4000);
    }
  };

  return {
    isListening,
    speechError,
    toggleVoiceSearch,
    activeLanguage: getRecognitionLang()
  };
}
