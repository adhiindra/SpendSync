"use client";

import React, { createContext, useContext, ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type I18nContextType = {
  dictionary: Dictionary;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ dictionary }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation(namespace?: keyof Dictionary) {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }

  const { dictionary } = context;

  // A simple function to get a string using dot notation (e.g. "header.dashboard")
  const t = (key: string): string => {
    // If a namespace was provided, prepend it
    const fullKey = namespace ? `${String(namespace)}.${key}` : key;
    
    const keys = fullKey.split(".");
    let current: any = dictionary;

    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation missing for key: ${fullKey}`);
        return fullKey; // fallback to key
      }
      current = current[k];
    }

    return typeof current === "string" ? current : fullKey;
  };

  return { t, dictionary };
}
