import vi from './vi'
import en from './en'

export const dictionaries = { vi, en }

export function getDictionary(locale = 'vi') {
  return dictionaries[locale] || dictionaries.vi
}

export const supportedLocales = ['vi', 'en']
export const defaultLocale = 'vi'
