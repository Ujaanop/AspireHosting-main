'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import languageConfig from '../config/sections/language.json';
import type { LanguageConfig, Language } from '../types/language';

const config = languageConfig as LanguageConfig;

interface Translations {
  [key: string]: any;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Language detection based on browser locale and config mappings
const detectUserLanguage = (): Language => {
  if (typeof window === 'undefined') return config.settings.defaultLanguage as Language;

  // Get browser language
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  const locale = browserLang.toLowerCase();

  // Check against locale mappings from config
  for (const [langCode, locales] of Object.entries(config.localeMapping)) {
    if (locales.some(supportedLocale => 
      locale === supportedLocale.toLowerCase() || 
      locale.startsWith(supportedLocale.toLowerCase() + '-')
    )) {
      // Check if this language is enabled
      const languageInfo = config.availableLanguages.find(lang => lang.code === langCode);
      if (languageInfo && languageInfo.enabled) {
        return langCode as Language;
      }
    }
  }

  // Default to configured default language
  return config.settings.defaultLanguage as Language;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations function
  const loadTranslations = async (lang: Language) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/lang/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang} translations`);
      }
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      
      // Try to load English as fallback if current language fails
      if (lang !== 'en') {
        try {
          const fallbackResponse = await fetch('/lang/en.json');
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setTranslations(fallbackData);
            console.warn(`Loaded English translations as fallback for ${lang}`);
          }
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError);
          setTranslations({});
        }
      } else {
        setTranslations({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      let initialLanguage: Language = config.settings.defaultLanguage as Language;
      
      // Check localStorage first for saved preference
      if (typeof window !== 'undefined') {
        // Check if preference cookies are accepted
        const cookieConsent = localStorage.getItem('cookie-consent');
        const cookiePreferences = localStorage.getItem('cookie-preferences');
        
        let canUseSavedPreferences = false;
        if (cookieConsent && cookiePreferences) {
          try {
            const prefs = JSON.parse(cookiePreferences);
            canUseSavedPreferences = prefs.preferences === true;
          } catch {
            canUseSavedPreferences = false;
          }
        }
        
        const enabledLanguageCodes = config.availableLanguages
          .filter(lang => lang.enabled)
          .map(lang => lang.code);
        
        // Only use saved language if cookies are accepted
        if (canUseSavedPreferences) {
          const savedLanguage = localStorage.getItem('language') as Language;
          if (savedLanguage && enabledLanguageCodes.includes(savedLanguage)) {
            initialLanguage = savedLanguage;
          }
        }
        
        // If no saved preference or cookies not accepted, try auto-detection
        if (initialLanguage === config.settings.defaultLanguage && config.settings.autoDetection.enabled) {
          initialLanguage = detectUserLanguage();
        }
      }

      setLanguage(initialLanguage);
      await loadTranslations(initialLanguage);
    };

    initializeLanguage();
  }, []);

  // Handle language changes
  const handleSetLanguage = async (lang: Language) => {
    setLanguage(lang);
    
    // Save to localStorage and update document language
    if (typeof window !== 'undefined') {
      // Check if preference cookies are accepted before saving
      const cookieConsent = localStorage.getItem('cookie-consent');
      const cookiePreferences = localStorage.getItem('cookie-preferences');
      
      let canSavePreferences = false;
      if (cookieConsent && cookiePreferences) {
        try {
          const prefs = JSON.parse(cookiePreferences);
          canSavePreferences = prefs.preferences === true;
        } catch {
          canSavePreferences = false;
        }
      }
      
      // Only save language preference if cookies are accepted
      if (canSavePreferences) {
        localStorage.setItem('language', lang);
      }
      
      // Always update document language and direction (this doesn't require cookies)
      document.documentElement.lang = lang;
      
      // Update text direction for RTL languages based on config
      const languageInfo = config.availableLanguages.find(l => l.code === lang);
      document.documentElement.dir = languageInfo?.rtl ? 'rtl' : 'ltr';
    }
    
    // Load new translations
    await loadTranslations(lang);
  };

  // Translation function with nested key support
  const t = (key: string): string => {
    // Return empty string while translations are loading to prevent flash
    if (isLoading || Object.keys(translations).length === 0) {
      return '';
    }

    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return the key itself if translation not found
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        translations,
        t,
        isLoading,
      }}
    >
      {/* Only render children when translations are loaded to prevent flash */}
      {!isLoading && Object.keys(translations).length > 0 ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};