'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

export default function BlogSection({ section }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

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

  const FEATURED_POST = {
    title: 'Padel là gì? Tổng quan về môn thể thao đang hot nhất 2026',
    excerpt: 'Tìm hiểu về Padel - môn thể thao kết hợp hoàn hảo giữa Tennis và Squash đang tạo nên cơn sốt trên toàn cầu. Khám phá luật chơi, dụng cụ và lý do tại sao bộ môn này lại dễ tiếp cận đến vậy.',
    image: '/images/gallery/gallery_hero.png',
    category: 'Kiến thức chung',
    date: '12/06/2026',
    readTime: '5 phút đọc',
    author: 'HaloPadel Team',
    slug: 'padel-la-gi'
  }

  const SMALL_POSTS = [
    {
      id: 1,
      title: '5 lợi ích sức khỏe tuyệt vời khi chơi Padel thường xuyên',
      image: '/images/gallery/gallery_action.png',
      category: 'Sức khỏe',
      date: '10/06/2026',
      readTime: '3 phút đọc',
      slug: '5-loi-ich-suc-khoe'
    },
    {
      id: 2,
      title: 'Luật chơi Padel cơ bản dành cho người mới bắt đầu',
      image: '/images/gallery/gallery_macro.png',
      category: 'Hướng dẫn',
      date: '08/06/2026',
      readTime: '4 phút đọc',
      slug: 'luat-choi-co-ban'
    },
    {
      id: 3,
      title: 'Nên thuê hay mua vợt Padel khi mới chơi? Lời khuyên từ HLV',
      image: '/images/amenities/rackets.png',
      category: 'Kinh nghiệm',
      date: '05/06/2026',
      readTime: '4 phút đọc',
      slug: 'thue-hay-mua-vot'
    }
  ]

  return (
    <section id="blog" className="py-24 bg-white" ref={sectionRef}>
      <div className="w-full px-4 md:px-8 max-w-[1300px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <p className="text-[13px] font-semibold text-[#D45A2A] uppercase tracking-[0.2em] mb-3">
              Kiến thức Padel
            </p>
            <h2 className="font-heading text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-4">
              {section?.title || 'Blog Padel'}
            </h2>
            <p className="text-[#555555] text-base md:text-lg leading-relaxed">
              {section?.subtitle || 'Cập nhật hướng dẫn, kinh nghiệm chơi và tin tức cộng đồng từ HaloPadel'}
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-1.5 text-[15px] font-bold text-[#111111] hover:text-[#D45A2A] transition-colors border-b-2 border-[#111111] hover:border-[#D45A2A] pb-1"
          >
            Xem tất cả bài viết
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
              <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
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
              
              <div className="p-6 md:p-8">
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
                  <span>{FEATURED_POST.readTime}</span>
                </div>
                
                <h3 className="font-heading text-2xl md:text-[32px] font-bold text-[#111111] group-hover:text-[#D45A2A] transition-colors leading-tight mb-4">
                  {FEATURED_POST.title}
                </h3>
                
                <p className="text-[#555555] text-[15px] md:text-[16px] leading-relaxed mb-8 line-clamp-3">
                  {FEATURED_POST.excerpt}
                </p>
                
                <span className="inline-flex items-center gap-2 text-[15px] font-bold text-[#D45A2A] group-hover:text-[#B8431D] transition-colors">
                  Đọc bài viết
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          {/* Right: List of 3 smaller posts (5/12) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {SMALL_POSTS.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row items-center sm:items-stretch gap-5 p-4 rounded-2xl border border-transparent hover:border-[#E8E2D2] hover:bg-[#FFFDF6] transition-all duration-300 hover:shadow-sm h-full"
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-[140px] md:w-[160px] shrink-0 h-[180px] sm:h-full min-h-[120px] rounded-xl overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                    sizes="(max-width: 640px) 100vw, 160px"
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-md text-[#D45A2A] text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {post.category}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 py-2 flex flex-col justify-center">
                  <div className="flex items-center gap-x-2 text-[12px] text-[#888888] font-medium mb-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
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
            Xem tất cả bài viết
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
