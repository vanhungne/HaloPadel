import { format, formatDistanceToNow, isAfter, isBefore, isValid, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

/**
 * Format date to Vietnamese locale
 */
export function formatDate(date, pattern = 'dd/MM/yyyy') {
  if (!date) return ''
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return ''
  return format(d, pattern, { locale: vi })
}

/**
 * Format relative time (e.g., "2 ngày trước")
 */
export function formatRelativeTime(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return ''
  return formatDistanceToNow(d, { addSuffix: true, locale: vi })
}

/**
 * Check if a date range is currently active
 */
export function isDateRangeActive(startDate, endDate) {
  const now = new Date()
  const start = startDate ? (typeof startDate === 'string' ? parseISO(startDate) : startDate) : null
  const end = endDate ? (typeof endDate === 'string' ? parseISO(endDate) : endDate) : null

  if (start && isBefore(now, start)) return false
  if (end && isAfter(now, end)) return false
  return true
}

/**
 * Format price display
 */
export function formatPrice(price) {
  if (!price) return 'Liên hệ'
  return price
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Parse JSON safely
 */
export function safeJsonParse(json, fallback = null) {
  if (!json) return fallback
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * Generate CSS class string from conditionals
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Get status badge color
 */
export function getStatusColor(status) {
  const colors = {
    // Blog
    DRAFT: 'bg-gray-100 text-gray-700',
    PUBLISHED: 'bg-green-100 text-green-700',
    HIDDEN: 'bg-yellow-100 text-yellow-700',
    // Contact
    NEW: 'bg-blue-100 text-blue-700',
    CONTACTED: 'bg-yellow-100 text-yellow-700',
    RESOLVED: 'bg-green-100 text-green-700',
    SPAM: 'bg-red-100 text-red-700',
    // Announcement
    INFO: 'bg-blue-100 text-blue-700',
    PROMOTION: 'bg-orange-100 text-orange-700',
    EVENT: 'bg-purple-100 text-purple-700',
    MAINTENANCE: 'bg-yellow-100 text-yellow-700',
    WARNING: 'bg-red-100 text-red-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

/**
 * Strip HTML tags from rich text
 */
export function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

/**
 * Parse opening hours JSON to display text
 */
export function formatOpeningHours(json) {
  const hours = safeJsonParse(json, [])
  if (!Array.isArray(hours) || hours.length === 0) return 'Liên hệ để biết giờ mở cửa'
  return hours.map(h => `${h.day}: ${h.open} - ${h.close}`).join('\n')
}
