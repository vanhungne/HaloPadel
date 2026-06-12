import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export default function BlogSection({ posts, section }) {
  if (!posts || posts.length === 0) return null

  return (
    <section id="blog" className="py-20 md:py-28">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-[#BE4F24] uppercase tracking-[0.2em] mb-3">
            Tin tức
          </p>
          <h2 className="font-heading text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-3">
            {section?.title || 'Blog'}
          </h2>
          <p className="text-[#555555] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {section?.subtitle || 'Kiến thức & tin tức thể thao'}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-[#FFFDF6] rounded-2xl overflow-hidden border border-[#E8E2D2] hover:border-[#BE4F24]/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1"
            >
              {/* Cover Image */}
              {post.coverImage && (
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {post.category && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#BE4F24] text-[11px] font-semibold rounded-lg">
                      {post.category.name}
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <h3 className="font-heading text-[15px] font-bold text-[#111111] group-hover:text-[#BE4F24] transition-colors mb-2 line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-[12.5px] text-[#555555] mb-3 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-[11.5px] text-[#888888]">
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  <span className="text-[#BE4F24] font-semibold">
                    Đọc tiếp →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#BE4F24] hover:text-[#A9411D] transition-colors"
          >
            Xem tất cả bài viết
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
