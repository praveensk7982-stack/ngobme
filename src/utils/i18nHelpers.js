/**
 * Helper function to retrieve localized database column fields dynamically.
 * Example: getLocalizedField(camp, 'title', i18n.language)
 * Returns record.title_ta if current language is 'ta', falling back to title_en or title.
 */
export function getLocalizedField(record, fieldName, currentLang = 'en') {
  if (!record) return '';

  const lang = (currentLang || 'en').split('-')[0].toLowerCase();
  
  const localizedKey = `${fieldName}_${lang}`;
  const englishKey = `${fieldName}_en`;

  // 1. Return specific localized language field if available
  if (record[localizedKey] && String(record[localizedKey]).trim()) {
    return record[localizedKey];
  }

  // 2. Fall back to English localized field
  if (record[englishKey] && String(record[englishKey]).trim()) {
    return record[englishKey];
  }

  // 3. Fall back to base field name
  if (record[fieldName] && String(record[fieldName]).trim()) {
    return record[fieldName];
  }

  return '';
}

/**
 * Helper function to format date/time strings natively per active locale.
 * Uses Intl.DateTimeFormat with ta-IN, hi-IN, or en-IN.
 */
export function formatDate(dateInput, currentLang = 'en') {
  if (!dateInput) return '';

  const langMap = {
    en: 'en-IN',
    ta: 'ta-IN',
    hi: 'hi-IN'
  };

  const lang = (currentLang || 'en').split('-')[0].toLowerCase();
  const targetLocale = langMap[lang] || 'en-IN';

  try {
    const dateObj = new Date(dateInput);
    
    // Check for valid Date object
    if (!isNaN(dateObj.getTime())) {
      return new Intl.DateTimeFormat(targetLocale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(dateObj);
    }
  } catch (err) {
    // ignore parsing failure
  }

  // Fallback for custom relative date strings like "Tomorrow, Sep 24 • 9:00 AM"
  return String(dateInput);
}
