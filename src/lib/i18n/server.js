import { cookies } from 'next/headers'
import { getDictionary, defaultLocale } from '@/lib/i18n/index'

/**
 * Get the current locale from cookies (for Server Components)
 * @returns {Promise<string>}
 */
export async function getServerLocale() {
  try {
    const cookieStore = await cookies()
    const localeCookie = cookieStore.get('halopadel-locale')
    const locale = localeCookie?.value
    if (locale === 'en' || locale === 'vi') return locale
  } catch (e) {}
  return defaultLocale
}

/**
 * Get translation dictionary for server components
 * @returns {Promise<Object>}
 */
export async function getServerT() {
  const locale = await getServerLocale()
  return { t: getDictionary(locale), locale }
}
