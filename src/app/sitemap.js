import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

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
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 2. Fetch Dynamic Blog Posts from DB
  const blogPosts = await prisma.blogPost.findMany({
    where: { 
      venueId: VENUE_ID, 
      status: 'PUBLISHED', 
      isDeleted: false 
    },
    select: { slug: true, updatedAt: true },
  })

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // MOCK BLOGS (For Demo/SEO completeness since we used mock data in UI)
  const mockBlogSlugs = [
    'padel-la-gi', 
    '5-loi-ich-suc-khoe-choi-padel', 
    'luat-choi-padel-co-ban', 
    'nguoi-moi-choi-padel-can-chuan-bi-gi', 
    'choi-padel-o-da-nang', 
    'kinh-nghiem-chon-khung-gio-choi-padel', 
    'cac-loi-thuong-gap-khi-choi-padel'
  ]
  const mockBlogRoutes = mockBlogSlugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // MOCK ANNOUNCEMENTS (For Demo/SEO completeness)
  const mockAnnouncementIds = ['1', '2', '3', '4', '5', '6']
  const announcementRoutes = mockAnnouncementIds.map(id => ({
    url: `${baseUrl}/thong-bao/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes, ...mockBlogRoutes, ...announcementRoutes]
}
