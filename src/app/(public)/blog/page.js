import BlogClient from '@/components/public/BlogClient'
import { getSeoMetadata, SchemaMarkup } from '@/lib/seo'
import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'

export const revalidate = 60

export async function generateMetadata() {
  return await getSeoMetadata('blog', 'Blog HaloPadel')
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { venueId: VENUE_ID, status: 'PUBLISHED', isDeleted: false },
    include: { category: true, author: true },
    orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
  })

  return (
    <>
      <SchemaMarkup pageKey="blog" />
      <BlogClient posts={posts} />
    </>
  )
}
