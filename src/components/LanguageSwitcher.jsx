import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const langCode = e.target.value;
    i18n.changeLanguage(langCode);
    localStorage.setItem('app_lang', langCode);
  };

  const currentLanguage = i18n.language ? i18n.language.split('-')[0] : 'en';

  return (
    <div className={`relative flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/90 px-2.5 py-1.5 rounded-xl transition shadow-sm ${className}`}>
      <Globe className="w-4 h-4 text-teal-600 shrink-0" />
      <select
        value={currentLanguage}
        onChange={handleLanguageChange}
        aria-label="Select Language"
        className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer pr-1"
      >
        <option value="en">English</option>
        <option value="ta">தமிழ்</option>
        <option value="hi">हिंदी</option>
      </select>
    </div>
  );
}
