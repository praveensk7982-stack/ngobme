import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ta from './locales/ta.json';
import hi from './locales/hi.json';

const resources = {
  en: { translation: en },
  ta: { translation: ta },
  hi: { translation: hi }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ta', 'hi'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'app_lang',
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

// Async function to fetch admin-configured default language from Supabase if user hasn't set one yet
export const fetchAdminDefaultLanguage = async (supabase) => {
  const userChosenLang = localStorage.getItem('app_lang');
  if (userChosenLang) return; // User already picked a language

  if (!supabase) return;

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'default_language')
      .maybeSingle();

    if (!error && data && data.value && ['en', 'ta', 'hi'].includes(data.value)) {
      i18n.changeLanguage(data.value);
    }
  } catch (err) {
    console.warn('Could not fetch default site language from Supabase:', err);
  }
};

export default i18n;
