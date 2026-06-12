/**
 * Get the localized value of a field based on current locale
 * 
 * @param {Object} item - Database record (e.g. pricing plan, promotion)
 * @param {string} field - Base field name (e.g. 'name', 'title', 'description')
 * @param {string} locale - Current locale ('vi' or 'en')
 * @returns {string} - The localized value
 * 
 * @example
 * localize(plan, 'name', 'en')  // returns plan.nameEn if exists, else plan.name
 * localize(plan, 'name', 'vi')  // returns plan.name
 */
export function localize(item, field, locale) {
  if (!item) return ''
  if (locale === 'en') {
    const enField = `${field}En`
    return item[enField] || item[field] || ''
  }
  return item[field] || ''
}

/**
 * Get the localized value with a strict fallback for English.
 * If locale is 'en' and the En field is empty, returns null
 * so the caller can fall back to a dictionary value instead of the VN text.
 * 
 * Use this for section titles where you want:
 * - EN mode + titleEn exists → show titleEn
 * - EN mode + titleEn empty → show t.xxx.sectionTitle (dictionary)
 * - VI mode → show title (VN)
 * 
 * @example
 * localizeStrict(section, 'title', 'en') || t.amenities.sectionTitle
 */
export function localizeStrict(item, field, locale) {
  if (!item) return null
  if (locale === 'en') {
    const enField = `${field}En`
    return item[enField] || null  // Don't fall back to VN field
  }
  return item[field] || null
}
