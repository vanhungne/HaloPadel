'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { localize, localizeStrict } from '@/lib/i18n/localize'

export default function BlogSection({ section, posts: dbPosts }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const { t, locale } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Use real DB posts if available, otherwise use hardcoded fallback
  const posts = (dbPosts && dbPosts.length > 0)
    ? dbPosts.map(p => ({
        slug: p.slug,
        title: localize(p, 'title', locale),
        excerpt: localize(p, 'excerpt', locale),
        category: p.category?.name || 'Tin tức',
        readTime: String(Math.ceil((p.content?.length || 1000) / 1000)),
        image: p.coverImage || '/images/gallery/gallery_action.png',
        author: p.author?.fullName || 'HaloPadel Team',
        date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('vi-VN') : new Date(p.createdAt).toLocaleDateString('vi-VN'),
      }))
    : [
        {
          slug: 'padel-la-gi',
          title: t.blog.featuredTitle,
          excerpt: t.blog.featuredExcerpt,
          category: t.blog.featuredCategory,
          readTime: '5',
          image: '/images/gallery/gallery_action.png',
          author: 'HaloPadel Team',
          date: '12/06/2026',
        },
        {
          slug: '5-loi-ich-suc-khoe',
          title: t.blog.post1Title,
          category: t.blog.post1Category,
          readTime: '4',
          image: '/images/amenities/lounge.png',
          date: '10/06/2026',
        },
        {
          slug: 'luat-choi-co-ban',
          title: t.blog.post2Title,
          category: t.blog.post2Category,
          readTime: '6',
          image: '/images/gallery/gallery_hero.png',
          date: '08/06/2026',
        },
        {
          slug: 'thue-hay-mua-vot',
          title: t.blog.post3Title,
          category: t.blog.post3Category,
          readTime: '3',
          image: '/images/amenities/parking.png',
          date: '05/06/2026',
        },
      ]

  const FEATURED_POST = posts[0]
  const SMALL_POSTS = posts.slice(1)

  return (
    <section id="blog" className="py-14 md:py-24 bg-white" ref={sectionRef}>
      <div className="w-full px-4 md:px-8 max-w-[1300px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-10 md:mb-16">
          <div className="max-w-2xl">
            <p className="text-[13px] font-semibold text-[#D45A2A] uppercase tracking-[0.2em] mb-3">
              {t.blog.sectionLabel}
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-3 md:mb-4">
              {localizeStrict(section, 'title', locale) || t.blog.sectionTitle}
            </h2>
            <p className="text-[#555555] text-base md:text-lg leading-relaxed">
              {localizeStrict(section, 'subtitle', locale) || t.blog.sectionSubtitle}
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-1.5 text-[15px] font-bold text-[#111111] hover:text-[#D45A2A] transition-colors border-b-2 border-[#111111] hover:border-[#D45A2A] pb-1"
          >
            {t.common.viewAllArticles}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Blog Grid (Featured + List) */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          
          {/* Left: Featured Post (7/12) */}
          <div className="lg:col-span-7">
            <Link 
              href={`/blog/${FEATURED_POST.slug}`}
              className="group block h-full rounded-3xl overflow-hidden bg-[#FFFDF6] border border-[#E8E2D2] hover:border-[#D45A2A]/30 transition-all duration-500 hover:shadow-[0_24px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1"
            >
              <div className="relative h-[220px] sm:h-[300px] md:h-[400px] w-full overflow-hidden">
                <Image
                  src={FEATURED_POST.image}
                  alt={FEATURED_POST.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute top-5 left-5 px-3 py-1.5 bg-white/90 backdrop-blur-md text-[#D45A2A] text-[12px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                  {FEATURED_POST.category}
                </div>
              </div>
              
              <div className="p-5 sm:p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#888888] font-medium mb-4">
                  <span className="flex items-center gap-1.5 text-[#111111]">
                    <svg className="w-4 h-4 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {FEATURED_POST.author}
                  </span>
                  <span>•</span>
                  <span>{FEATURED_POST.date}</span>
                  <span>•</span>
                  <span>{`${FEATURED_POST.readTime} ${t.common.minuteRead}`}</span>
                </div>
                
                <h3 className="font-heading text-2xl md:text-[32px] font-bold text-[#111111] group-hover:text-[#D45A2A] transition-colors leading-tight mb-4">
                  {FEATURED_POST.title}
                </h3>
                
                <p className="text-[#555555] text-[15px] md:text-[16px] leading-relaxed mb-8 line-clamp-3">
                  {FEATURED_POST.excerpt}
                </p>
                
                <span className="inline-flex items-center gap-2 text-[15px] font-bold text-[#D45A2A] group-hover:text-[#B8431D] transition-colors">
                  {t.common.readArticle}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          {/* Right: List of smaller posts (5/12) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {SMALL_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row items-stretch gap-5 p-4 rounded-2xl border border-transparent hover:border-[#E8E2D2] hover:bg-[#FFFDF6] transition-all duration-300 hover:shadow-sm"
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-[160px] md:w-[180px] shrink-0 h-[180px] sm:h-[140px] rounded-xl overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                    sizes="(max-width: 640px) 100vw, 180px"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-md text-[#D45A2A] text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {post.category}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 py-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-x-2 text-[12px] text-[#888888] font-medium mb-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{`${post.readTime} ${t.common.minuteRead}`}</span>
                  </div>
                  
                  <h3 className="font-heading text-[16px] md:text-[18px] font-bold text-[#111111] group-hover:text-[#D45A2A] transition-colors leading-snug line-clamp-3">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile View All CTA */}
        <div className="text-center mt-10 md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[#111111] hover:text-[#D45A2A] transition-colors border-b-2 border-[#111111] hover:border-[#D45A2A] pb-1"
          >
            {t.common.viewAllArticles}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
