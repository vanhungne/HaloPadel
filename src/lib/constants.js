// App-wide constants

export const VENUE_ID = parseInt(process.env.NEXT_PUBLIC_VENUE_ID || '1')
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Media categories
export const MEDIA_CATEGORIES = {
  LOGO: 'LOGO',
  HERO: 'HERO',
  GALLERY: 'GALLERY',
  COURT: 'COURT',
  AMENITY: 'AMENITY',
  PROMOTION: 'PROMOTION',
  BLOG: 'BLOG',
  SEO: 'SEO',
  OTHER: 'OTHER',
}

// Blog post statuses
export const POST_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  HIDDEN: 'HIDDEN',
}

// Announcement types
export const ANNOUNCEMENT_TYPES = {
  INFO: 'INFO',
  PROMOTION: 'PROMOTION',
  EVENT: 'EVENT',
  MAINTENANCE: 'MAINTENANCE',
  WARNING: 'WARNING',
}

// Contact statuses
export const CONTACT_STATUS = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  RESOLVED: 'RESOLVED',
  SPAM: 'SPAM',
}

// Landing section keys
export const SECTION_KEYS = [
  'hero',
  'quickinfo',
  'about',
  'gallery',
  'amenities',
  'pricing',
  'promotions',
  'announcements',
  'blog',
  'map',
  'contact',
]

// Default section titles (Vietnamese)
export const SECTION_DEFAULTS = {
  hero: { title: 'Chào mừng đến với', subtitle: 'Sân thể thao chuyên nghiệp' },
  quickinfo: { title: 'Thông tin liên hệ', subtitle: 'Liên hệ ngay để đặt sân' },
  about: { title: 'Giới thiệu', subtitle: 'Tìm hiểu thêm về chúng tôi' },
  gallery: { title: 'Hình ảnh sân', subtitle: 'Không gian tập luyện đẳng cấp' },
  amenities: { title: 'Tiện ích', subtitle: 'Đầy đủ tiện nghi cho bạn' },
  pricing: { title: 'Bảng giá', subtitle: 'Giá cả hợp lý, nhiều ưu đãi' },
  promotions: { title: 'Khuyến mãi', subtitle: 'Ưu đãi hấp dẫn dành cho bạn' },
  announcements: { title: 'Thông báo', subtitle: 'Cập nhật tin tức mới nhất' },
  blog: { title: 'Blog', subtitle: 'Kiến thức & Tin tức thể thao' },
  map: { title: 'Bản đồ', subtitle: 'Tìm đường đến với chúng tôi' },
  contact: { title: 'Liên hệ', subtitle: 'Gửi yêu cầu cho chúng tôi' },
}

// Amenity default icons (emoji-based)
export const AMENITY_ICONS = {
  'Bãi xe': '🅿️',
  'Nước uống': '🥤',
  'Thuê vợt': '🏸',
  'Huấn luyện viên': '👨‍🏫',
  'Phòng thay đồ': '🚪',
  'Nhà vệ sinh': '🚻',
  'WiFi': '📶',
  'Khu vực chờ': '🪑',
  'Đèn ban đêm': '💡',
  'Quán cafe': '☕',
  'Khăn tắm': '🧺',
  'Tủ đồ': '🗄️',
}

// Navigation items
export const NAV_ITEMS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  { label: 'Hình ảnh', href: '/hinh-anh' },
  { label: 'Khuyến mãi', href: '/khuyen-mai' },
  { label: 'Thông báo', href: '/thong-bao' },
  { label: 'Blog', href: '/blog' },
  { label: 'Liên hệ', href: '/lien-he' },
]

// Admin navigation items
export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Thông tin sân', href: '/admin/venue', icon: '🏟️' },
  { label: 'Landing Page', href: '/admin/landing', icon: '🏠' },
  { label: 'Hình ảnh', href: '/admin/media', icon: '🖼️' },
  { label: 'Blog', href: '/admin/blog', icon: '📝' },
  { label: 'Khuyến mãi', href: '/admin/promotions', icon: '🎁' },
  { label: 'Thông báo', href: '/admin/announcements', icon: '📢' },
  { label: 'Tiện ích', href: '/admin/amenities', icon: '⭐' },
  { label: 'Bảng giá', href: '/admin/pricing', icon: '💰' },
  { label: 'Liên hệ', href: '/admin/contacts', icon: '📬' },
  { label: 'SEO', href: '/admin/seo', icon: '🔍' },
]
