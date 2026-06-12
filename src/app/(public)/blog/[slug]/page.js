import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await prisma.blogPost.findFirst({
    where: { venueId: VENUE_ID, slug, status: 'PUBLISHED', isDeleted: false },
    include: { category: true },
  })
  if (!post) return { title: 'Không tìm thấy' }
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  }
}

async function getBlogPost(slug) {
  const post = await prisma.blogPost.findFirst({
    where: { venueId: VENUE_ID, slug, status: 'PUBLISHED', isDeleted: false },
    include: { category: true, author: { select: { fullName: true, avatar: true } } },
  })
  if (post) {
    // Increment view count
    await prisma.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } })
  }
  return post
}

async function getRelatedPosts(postId, categoryId) {
  return prisma.blogPost.findMany({
    where: {
      venueId: VENUE_ID, status: 'PUBLISHED', isDeleted: false,
      id: { not: postId },
      ...(categoryId ? { categoryId } : {}),
    },
    include: { category: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  })
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  const relatedPosts = await getRelatedPosts(post.id, post.categoryId)

  return (
    <div className="py-8 md:py-12">
      <div className="section-container">
        <article className="max-w-4xl mx-auto">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative h-60 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-card mb-8">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="100vw" priority />
              {post.category && (
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-sm text-primary text-sm font-semibold rounded-full">{post.category.name}</div>
              )}
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-text-main mb-4">{post.title}</h1>
            <div className="flex items-center flex-wrap gap-4 text-sm text-text-light">
              {post.author && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary font-bold text-sm">
                    {post.author.fullName?.charAt(0)}
                  </div>
                  <span>{post.author.fullName}</span>
                </div>
              )}
              <span>📅 {formatDate(post.publishedAt || post.createdAt, 'dd/MM/yyyy')}</span>
              <span>👁️ {post.viewCount} lượt xem</span>
            </div>
          </div>

          {/* Content */}
          {post.content && (
            <div className="rich-content bg-card-white rounded-2xl p-6 md:p-8 lg:p-10 shadow-card border border-border-light mb-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {/* Share */}
          <div className="flex items-center gap-3 mb-12 p-4 bg-cream rounded-xl">
            <span className="text-sm text-text-sub font-medium">Chia sẻ:</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${post.slug}`)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-[#1877F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-xl font-bold text-text-main mb-6">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group bg-card-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all border border-border-light">
                  {rp.coverImage && (
                    <div className="relative h-32 overflow-hidden">
                      <Image src={rp.coverImage} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="33vw" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-text-main group-hover:text-primary transition-colors line-clamp-2">{rp.title}</h3>
                    <p className="text-xs text-text-light mt-1">{formatDate(rp.publishedAt || rp.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
