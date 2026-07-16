import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Locale,
  TranslateVars,
  TranslationKey,
  translations,
} from '../i18n/translations';

const STORAGE_KEY = 'locale';

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: TranslateVars) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const getNestedValue = (tree: unknown, path: string): string | undefined => {
  const value = path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, tree);

  return typeof value === 'string' ? value : undefined;
};

const getInitialLocale = (): Locale => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'en' || saved === 'es') {
    return saved;
  }
  return 'es';
};

const interpolate = (template: string, vars?: TranslateVars) => {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`,
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: TranslationKey, vars?: TranslateVars) => {
      const fromLocale = getNestedValue(translations[locale], key);
      const fallback = getNestedValue(translations.en, key);
      return interpolate(fromLocale || fallback || key, vars);
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};
