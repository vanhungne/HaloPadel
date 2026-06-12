// Premium SVG icon set for amenities
// Each icon is a clean, consistent 24x24 SVG

export const amenityIcons = {
  // Parking
  '🅿️': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </svg>
  ),
  // Drinks
  '🥤': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8H7l1.5 13h7L17 8z" />
      <path d="M6 8h12" />
      <path d="M12 4v4" />
      <path d="M10 4h4" />
    </svg>
  ),
  // Racket
  '🏸': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="14" cy="8" rx="5" ry="6" />
      <line x1="9.5" y1="13" x2="4" y2="20" />
      <path d="M11 5v6M17 5v6M14 3v10M11 8h6" />
    </svg>
  ),
  // Coach
  '👨‍🏫': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="3" />
      <path d="M5.5 21v-2a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  // Locker room
  '🚪': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M12 3v18" />
      <circle cx="8" cy="12" r="0.5" fill="currentColor" />
      <circle cx="16" cy="12" r="0.5" fill="currentColor" />
      <path d="M7 7h2M15 7h2M7 17h2M15 17h2" />
    </svg>
  ),
  // WiFi
  '📶': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
    </svg>
  ),
  // Waiting area / Seating
  '🪑': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 11a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2H5v-2z" />
      <path d="M19 13v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5" />
      <path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
    </svg>
  ),
  // Night lights
  '💡': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
    </svg>
  ),
  // Cafe
  '☕': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a3 3 0 0 1 0 6h-1" />
      <path d="M3 8h14v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8z" />
      <path d="M6 2v3M10 2v3M14 2v3" />
    </svg>
  ),
  // Default star
  '⭐': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
}

/**
 * Get SVG icon component for an amenity emoji
 * Falls back to the emoji itself if no SVG mapping exists
 */
export function getAmenityIcon(emoji) {
  return amenityIcons[emoji] || amenityIcons['⭐']
}
