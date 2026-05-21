'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { strings, Language } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof strings.en, replacements?: Record<string, string>) => string;
  isPidgin: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read from localStorage on mount
    const savedLanguage = localStorage.getItem('trustscan_language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pidgin')) {
      setLanguageState(savedLanguage);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('trustscan_language', lang);
    }
  };

  const t = (key: keyof typeof strings.en, replacements?: Record<string, string>): string => {
    // If not mounted, default to English to prevent hydration mismatch
    const currentLang = mounted ? language : 'en';
    const dict = strings[currentLang] || strings.en;
    let text = dict[key] || strings.en[key] || '';
    
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  const isPidgin = mounted && language === 'pidgin';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isPidgin }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
