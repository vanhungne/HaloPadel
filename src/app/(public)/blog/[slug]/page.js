import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import { getServerT } from '@/lib/i18n/server'
import { localize } from '@/lib/i18n/localize'

export default async function BlogDetailPage({ params }) {
  const { slug } = await params
  const { t, locale } = await getServerT()

  if (!slug) notFound()

  const post = await prisma.blogPost.findUnique({
    where: { 
      venueId_slug: { venueId: VENUE_ID, slug }
    },
    include: {
      author: true,
      category: true
    }
  })

  if (!post || post.status !== 'PUBLISHED' || post.isDeleted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FFFDF6]">
        <h1 className="text-4xl font-bold text-[#111111] mb-4">404</h1>
        <p className="text-[#555555] mb-8">{locale === 'en' ? 'The article you are looking for does not exist or has been removed.' : 'Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.'}</p>
        <Link href="/blog" className="px-6 py-3 bg-[#D45A2A] text-white rounded-full font-bold">
          {locale === 'en' ? 'Back to Blog' : 'Quay lại danh sách Blog'}
        </Link>
      </div>
    )
  }

  const relatedPosts = await prisma.blogPost.findMany({
    where: { 
      venueId: VENUE_ID, 
      status: 'PUBLISHED', 
      isDeleted: false,
      id: { not: post.id }
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 3
  })

  const readTime = Math.ceil((post.content?.length || 1000) / 1000)

  return (
    <div className="py-12 md:py-24 bg-[#FFFDF6] min-h-screen">
      <div className="w-full px-4 md:px-8 max-w-[900px] mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-semibold mb-8 text-[#888888]">
          <Link href="/blog" className="hover:text-[#D45A2A] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[#D45A2A] uppercase tracking-wider">{post.category?.name || 'Blog'}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#111111] mb-6 leading-[1.15]">
            {localize(post, 'title', locale)}
          </h1>
          
          <div className="flex items-center gap-6 pt-6 border-t border-[#E8E2D2]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#111111] flex items-center justify-center text-white font-bold text-lg">
                H
              </div>
              <div>
                <p className="text-[#111111] font-bold text-[15px]">{post.author?.fullName || 'HaloPadel Team'}</p>
                <div className="flex items-center gap-3 text-[13px] text-[#888888] font-medium mt-0.5">
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  <span className="w-1 h-1 rounded-full bg-[#E8E2D2]" />
                  <span>{readTime} {t.common.minuteRead}</span>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="ml-auto flex gap-2">
              <button className="w-10 h-10 rounded-full border border-[#E8E2D2] flex items-center justify-center text-[#555555] hover:bg-[#D45A2A] hover:text-white hover:border-[#D45A2A] transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button className="w-10 h-10 rounded-full border border-[#E8E2D2] flex items-center justify-center text-[#555555] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13v-3h3v3h-3zm0 4h3v-3h-3v3zm-4-4h3v-3H8v3zm0 4h3v-3H8v3zm0-8h3V6H8v3zm4-4v3h3V6h-3zM8 2H6v2H4v2H2v14h20V6h-2V4h-2V2h-2v2h-4V2z" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-[32px] overflow-hidden shadow-sm border border-[#E8E2D2] mb-12">
          <Image 
            src={post.coverImage || '/images/gallery/gallery_action.png'} 
            alt={localize(post, 'title', locale)} 
            fill 
            className="object-cover"
            priority
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-[#111111] prose-p:text-[#555555] prose-p:leading-[1.8] prose-a:text-[#D45A2A] prose-blockquote:border-l-4 prose-blockquote:border-[#D45A2A] prose-blockquote:bg-[#FFF9EE] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:font-medium prose-blockquote:text-[#111111] prose-blockquote:not-italic">
          <p className="text-xl md:text-2xl text-[#111111] font-medium leading-relaxed mb-10">
            {localize(post, 'excerpt', locale)}
          </p>
          <div dangerouslySetInnerHTML={{ __html: locale === 'en' ? (post.contentEn || post.content) : post.content }} />
        </div>

      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="w-full px-4 md:px-8 max-w-[1200px] mx-auto mt-24">
          <div className="flex items-center justify-between mb-10 border-t border-[#E8E2D2] pt-12">
            <h2 className="font-heading text-3xl font-bold text-[#111111]">
              {locale === 'en' ? 'Related Articles' : 'Bài viết cùng chủ đề'}
            </h2>
            <Link href="/blog" className="hidden sm:inline-flex items-center gap-2 text-[#D45A2A] font-bold hover:gap-3 transition-all">
              {t.common.viewAll} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((blog) => (
              <Link 
                key={blog.id} 
                href={`/blog/${blog.slug}`}
                className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-[#E8E2D2] transition-all duration-300 flex flex-col"
              >
                <div className="relative w-full h-[220px] overflow-hidden">
                  <Image 
                    src={blog.coverImage || '/images/gallery/gallery_action.png'} 
                    alt={localize(blog, 'title', locale)} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#111111] px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    {blog.category?.name || 'Blog'}
                  </div>
                </div>
                
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <h3 className="font-heading text-xl font-bold text-[#111111] mb-3 leading-snug group-hover:text-[#D45A2A] transition-colors line-clamp-2">
                    {localize(blog, 'title', locale)}
                  </h3>
                  <p className="text-[#555555] text-[15px] mb-6 line-clamp-3 leading-relaxed flex-1">
                    {localize(blog, 'excerpt', locale)}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-[#E8E2D2] pt-5">
                    <span className="text-[#888888] text-[12px] font-medium">
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </span>
                    <span className="text-[#D45A2A] font-bold text-[13px] flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t.common.readMore} <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
