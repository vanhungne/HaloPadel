export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Chặn Google Bot vào khu vực quản trị và API
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Trỏ đến file sitemap.js vừa tạo
  }
}
