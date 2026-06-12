'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { formatDate } from '@/lib/utils'

export default function PromotionsSection({ section, promotions = [] }) {
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

  if (!promotions || promotions.length === 0) return null;

  const promo1 = promotions[0];
  const promo2 = promotions.length > 1 ? promotions[1] : null;

  return (
    <section id="promotions" className="py-14 md:py-28 bg-white" ref={sectionRef}>
      <div className="w-full px-4 md:px-8 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-[13px] font-semibold text-[#D45A2A] uppercase tracking-[0.2em] mb-3">
            Khuyến mãi sân padel
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-4">
            {section?.title || 'Ưu đãi tại HaloPadel'}
          </h2>
          <p className="text-[#555555] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {section?.subtitle || 'Ưu đãi khai trương và gói chơi tiết kiệm dành cho khách hàng.'}
          </p>
        </div>

        {/* Featured Promotions Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          
          {/* Left: Featured Large Card (7/12) */}

          {promo1 && (
            <div className="lg:col-span-7">
              <div className="group relative bg-[#FFFDF6] rounded-2xl overflow-hidden border border-[#E8E2D2] hover:border-[#D45A2A]/40 transition-all duration-700 hover:shadow-[0_24px_50px_rgba(212,90,42,0.15)] hover:-translate-y-1 h-full flex flex-col">
                
                {/* Image Area */}
                <div className="relative h-[250px] md:h-[350px] lg:h-[400px] overflow-hidden">
                  <Image
                    src={promo1.banner || "/images/gallery/gallery_action.png"}
                    alt={promo1.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                  
                  {/* Badge */}
                  {promo1.isFeatured && (
                    <div className="absolute top-5 left-5 md:top-6 md:left-6 px-4 md:px-5 py-2 bg-[#D45A2A] text-white text-[13px] md:text-[15px] font-extrabold uppercase tracking-widest rounded-lg shadow-xl shadow-[#D45A2A]/30 flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      KHUYẾN MÃI ĐẶC BIỆT
                    </div>
                  )}
                </div>


                {/* Content Area */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between bg-white relative z-10">
                  <div>
                    <h3 className="font-heading text-2xl md:text-[28px] font-bold text-[#111111] group-hover:text-[#D45A2A] transition-colors mb-4 leading-tight">
                      {promo1.title}
                    </h3>
                    <p className="text-[#555555] text-[15px] md:text-[16px] leading-relaxed mb-6 max-w-xl">
                      {promo1.shortDesc}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mt-auto pt-6 border-t border-[#E8E2D2]">
                    {/* Deadline */}
                    {promo1.endDate ? (
                      <div className="flex items-center gap-2.5 text-[#D45A2A] bg-[#FFF4E8] px-4 py-2 rounded-lg font-semibold text-[14px]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Áp dụng đến: {formatDate(promo1.endDate)}
                      </div>
                    ) : <div/>}
                    
                    {/* CTA */}
                    <Link 
                      href={`/khuyen-mai/${promo1.slug}`}
                      className="inline-flex items-center justify-center gap-2 h-[48px] px-8 bg-[#111111] hover:bg-[#D45A2A] text-white rounded-xl font-bold text-[15px] transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
                    >
                      {promo1.ctaText || 'Nhận ưu đãi ngay'}
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right: Small Card (5/12) */}
          {promo2 && (
            <div className="lg:col-span-5 flex flex-col h-full">
              <div className="group relative bg-[#FFFDF6] rounded-2xl overflow-hidden border border-[#E8E2D2] hover:border-[#D45A2A]/40 transition-all duration-700 hover:shadow-[0_24px_50px_rgba(212,90,42,0.12)] hover:-translate-y-1 h-full flex flex-col">
                
                {/* Image Area */}
                <div className="relative h-[200px] lg:h-[250px] overflow-hidden">
                  <Image
                    src={promo2.banner || "/images/amenities/lounge.png"}
                    alt={promo2.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70" />
                  
                  {/* Badge */}
                  {promo2.isFeatured && (
                    <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-[#111111] text-white text-[12px] font-bold uppercase tracking-widest rounded-lg shadow-lg">
                      ƯU ĐÃI THÊM
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between bg-white relative z-10">
                  <div>
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-[#111111] group-hover:text-[#D45A2A] transition-colors mb-3 leading-tight">
                      {promo2.title}
                    </h3>
                    <p className="text-[#555555] text-[14px] md:text-[15px] leading-relaxed mb-6">
                      {promo2.shortDesc}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-5 mt-auto pt-5 border-t border-[#E8E2D2]">
                    {/* Deadline */}
                    {promo2.endDate && (
                      <div className="flex items-center gap-2.5 text-[#555555] bg-[#F8F5E4] px-4 py-2 rounded-lg font-medium text-[13px] self-start">
                        <svg className="w-4 h-4 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Áp dụng đến: {formatDate(promo2.endDate)}
                      </div>
                    )}
                    
                    {/* CTA */}
                    <Link 
                      href={`/khuyen-mai/${promo2.slug}`}
                      className="inline-flex items-center justify-center gap-2 h-[44px] px-6 bg-transparent border-2 border-[#111111] hover:border-[#D45A2A] text-[#111111] hover:text-[#D45A2A] hover:bg-[#D45A2A]/5 rounded-xl font-bold text-[14px] transition-all w-full"
                    >
                      {promo2.ctaText || 'Xem chi tiết'}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
