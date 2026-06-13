'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { localize, localizeStrict } from '@/lib/i18n/localize'

const PHOTO_AMENITIES = [
  {
    id: 1,
    name: 'Bãi xe tiện lợi',
    description: 'Bãi đỗ rộng rãi, an ninh, thuận tiện đỗ xe ô tô và xe máy ngay tại khu vực cổng vào.',
    image: '/images/amenities/parking.png',
  },
  {
    id: 2,
    name: 'Nước uống & Cafe',
    description: 'Phục vụ nước suối, nước điện giải và các thức uống năng lượng tại quầy bar thể thao.',
    image: '/images/amenities/cafe.png',
  },
  {
    id: 3,
    name: 'Khu vực chờ & Lounge',
    description: 'Không gian nghỉ ngơi thoải mái, có điều hoà và tầm nhìn trực diện ra sân thi đấu.',
    image: '/images/amenities/lounge.png',
  },
  {
    id: 4,
    name: 'Thuê vợt Padel',
    description: 'Cung cấp và cho thuê dụng cụ, vợt Padel chính hãng chất lượng cao cho người mới bắt đầu.',
    image: '/images/amenities/rackets.png',
  },
  {
    id: 5,
    name: 'Hệ thống Đèn LED',
    description: 'Hệ thống đèn chiếu sáng chuyên nghiệp đạt chuẩn thi đấu, hỗ trợ chơi tốt nhất vào buổi tối.',
    image: '/images/amenities/lights.png',
  },
  {
    id: 6,
    name: 'Phòng thay đồ',
    description: 'Khu vực thay đồ và tủ locker sạch sẽ, tiện nghi cao cấp, đảm bảo riêng tư tuyệt đối.',
    image: '/images/amenities/locker.png',
  }
]

  const FALLBACK_IMAGES = [
    '/images/amenities/parking.png',
    '/images/amenities/cafe.png',
    '/images/amenities/lounge.png',
    '/images/amenities/rackets.png',
    '/images/amenities/lights.png',
    '/images/amenities/locker.png',
  ]

export default function AmenitiesSection({ amenities, section }) {
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

  const displayList = amenities?.length > 0 ? amenities : PHOTO_AMENITIES;

  return (
    <section id="amenities" className="py-14 md:py-28 bg-[#FFFDF6]" ref={sectionRef}>
      <div className="w-full px-4 md:px-8 max-w-[1500px] mx-auto">
        {/* Header */}
        <div
          className="text-center mb-10 md:mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <p className="text-[13px] font-semibold text-[#D45A2A] uppercase tracking-[0.2em] mb-3">
            {t.amenities.sectionLabel}
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-3 md:mb-4">
            {localizeStrict(section, 'title', locale) || t.amenities.sectionTitle}
          </h2>
          <p className="text-[#555555] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {localizeStrict(section, 'subtitle', locale) || t.amenities.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
          {/* Left Hero Image */}
          <div 
            className="lg:col-span-5 relative rounded-2xl overflow-hidden min-h-[280px] sm:min-h-[400px] lg:min-h-full shadow-lg"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(-80px) scale(0.95)',
              transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }}
          >
            <Image
              src="/images/gallery/gallery_lounge.png"
              alt="Không gian tiện nghi đầy đủ"
              fill
              className="object-cover hover:scale-105 transition-transform duration-[1.5s]"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#D45A2A] text-white text-[11px] font-bold uppercase tracking-widest mb-4">
                Premium Club
              </span>
              <h3 className="font-heading text-3xl md:text-[2.5rem] font-bold !text-white leading-tight">
                {t.amenities.heroOverlayTitle} <br/>{t.amenities.heroOverlayTitleBr}
              </h3>
            </div>
          </div>

          {/* Right Cards Grid */}

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {displayList.map((item, index) => {
              const imageSrc = item.image || '/images/gallery/gallery_lounge.png';
              return (
                <div 
                  key={item.id}
                  className="group bg-white rounded-xl overflow-hidden border border-[#E8E2D2] hover:border-[#D45A2A]/40 hover:shadow-[0_20px_40px_rgba(212,90,42,0.12)] hover:-translate-y-1.5 transition-[border-color,box-shadow,transform] duration-500"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0) translateY(0) scale(1)' : 'translateX(60px) translateY(30px) scale(0.94)',
                    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 120 + 300}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 120 + 300}ms`,
                  }}
                >
                  {/* Image Half */}
                  <div className="relative h-[220px] overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-[1.08] transition-transform duration-[1s] ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                    />
                    {/* Subtle Light Sweep */}
                    <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:animate-[shine_1s_ease-in-out_forwards] z-10 pointer-events-none" />
                  </div>
                  
                  {/* Content Half */}
                  <div className="p-7">
                    <h4 className="text-[18px] font-bold text-[#111111] mb-2 group-hover:text-[#D45A2A] transition-colors">
                      {localize(item, 'name', locale)}
                    </h4>
                    <p className="text-[#555555] text-[14px] leading-relaxed">
                      {localize(item, 'description', locale)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
