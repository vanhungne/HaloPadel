import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://halopadel.vn'

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/gioi-thieu',
    '/hinh-anh',
    '/khuyen-mai',
    '/thong-bao',
    '/blog',
    '/lien-he',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 2. Fetch Dynamic Data from DB
  const [blogPosts, promotions, announcements] = await Promise.all([
    prisma.blogPost.findMany({
      where: { venueId: VENUE_ID, status: 'PUBLISHED', isDeleted: false },
      select: { slug: true, updatedAt: true },
    }),
    prisma.promotion.findMany({
      where: { venueId: VENUE_ID, isActive: true, isDeleted: false },
      select: { slug: true, updatedAt: true },
    }),
    prisma.announcement.findMany({
      where: { venueId: VENUE_ID, isActive: true, isDeleted: false },
      select: { slug: true, updatedAt: true },
    }),
  ])

  // 3. Map to Sitemap format
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const promotionRoutes = promotions.map((promo) => ({
    url: `${baseUrl}/khuyen-mai/${promo.slug}`,
    lastModified: promo.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const announcementRoutes = announcements.map((ann) => ({
    url: `${baseUrl}/thong-bao/${ann.slug}`,
    lastModified: ann.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes, ...promotionRoutes, ...announcementRoutes]
}
