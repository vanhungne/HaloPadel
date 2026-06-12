import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export const revalidate = 60

export async function generateMetadata() {
  const seo = await prisma.seoSetting.findUnique({
    where: { venueId_pageKey: { venueId: VENUE_ID, pageKey: 'blog' } },
  })
  return {
    title: seo?.metaTitle || 'Blog',
    description: seo?.metaDescription || 'Blog HaloPadel - Kiến thức & Tin tức',
  }
}

async function getBlogData() {
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: { venueId: VENUE_ID, status: 'PUBLISHED', isDeleted: false },
      include: { category: true, author: { select: { fullName: true } } },
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
    }),
    prisma.blogCategory.findMany({
      where: { venueId: VENUE_ID, isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ])
  return { posts, categories }
}

export default async function BlogPage() {
  const { posts, categories } = await getBlogData()

  return (
    <div className="py-8 md:py-12">
      <div className="section-container mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-main mb-4">
            Blog <span className="text-primary">HaloPadel</span>
          </h1>
          <p className="text-lg text-text-sub">Kiến thức, tin tức và chia sẻ về thể thao</p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="section-container mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/blog" className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium">
              Tất cả
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/danh-muc/${cat.slug}`}
                className="px-4 py-2 rounded-full bg-card-white border border-border-brand text-text-sub text-sm font-medium hover:border-primary hover:text-primary transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="section-container">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-card-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border-light hover:border-primary/20 hover:-translate-y-1"
              >
                {post.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    {post.category && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold rounded-full">{post.category.name}</div>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <h2 className="font-heading text-lg font-bold text-text-main group-hover:text-primary transition-colors mb-2 line-clamp-2">{post.title}</h2>
                  {post.excerpt && <p className="text-sm text-text-sub mb-3 line-clamp-2">{post.excerpt}</p>}
                  <div className="flex items-center justify-between text-xs text-text-light">
                    <div className="flex items-center gap-3">
                      <span>📅 {formatDate(post.publishedAt || post.createdAt)}</span>
                      {post.author && <span>✍️ {post.author.fullName}</span>}
                    </div>
                    <span className="text-primary font-semibold">Đọc tiếp →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">📝</span>
            <p className="text-text-light text-lg">Chưa có bài viết nào</p>
          </div>
        )}
      </div>
    </div>
  )
}
