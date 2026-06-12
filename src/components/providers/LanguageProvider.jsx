'use client'

import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { getDictionary, defaultLocale } from '@/lib/i18n/index'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'halopadel-locale'

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Read from localStorage on mount
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'vi') {
        setLocaleState(saved)
      }
    } catch (e) {}
    setMounted(true)
  }, [])

  const setLocale = (newLocale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem(STORAGE_KEY, newLocale)
      // Also set cookie for server components
      document.cookie = `halopadel-locale=${newLocale};path=/;max-age=31536000`
    } catch (e) {}
    // Update html lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
    }
  }

  const t = useMemo(() => getDictionary(locale), [locale])

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    mounted,
  }), [locale, t, mounted])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Fallback for components outside provider (e.g., admin pages)
    return {
      locale: defaultLocale,
      setLocale: () => {},
      t: getDictionary(defaultLocale),
      mounted: true,
    }
  }
  return context
}
