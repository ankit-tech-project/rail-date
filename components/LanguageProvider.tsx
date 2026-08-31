"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { translations, type Language } from "@/lib/translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export default function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("en");

  /*
   * Load the user's previously selected language.
   * English remains the default for first-time visitors.
   */
  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("raildate-language");

    if (savedLanguage === "en" || savedLanguage === "bn") {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);

    window.localStorage.setItem("raildate-language", nextLanguage);
  };

  const t = useMemo(() => {
    return (key: keyof typeof translations.en) => {
      return translations[language][key];
    };
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
