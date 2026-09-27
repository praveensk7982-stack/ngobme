import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Reusable Voice Search Hook using Web Speech API
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

  const toggleVoiceSearch = () => {
    setSpeechError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Voice search is not supported in this browser.');
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
