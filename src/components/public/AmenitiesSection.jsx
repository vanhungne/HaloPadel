'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

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

export default function AmenitiesSection({ section }) {
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

  return (
    <section id="amenities" className="py-14 md:py-28 bg-[#FFFDF6]" ref={sectionRef}>
      <div className="w-full px-4 md:px-8 max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-[13px] font-semibold text-[#D45A2A] uppercase tracking-[0.2em] mb-3">
            Tiện ích sân
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-3 md:mb-4">
            {section?.title || 'Dịch vụ & Tiện ích'}
          </h2>
          <p className="text-[#555555] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {section?.subtitle || 'Trải nghiệm không gian thể thao cao cấp với đầy đủ tiện nghi, đáp ứng mọi nhu cầu của bạn từ lúc đến cho tới khi kết thúc trận đấu.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
          {/* Left Hero Image */}
          <div 
            className={`lg:col-span-5 relative rounded-2xl overflow-hidden min-h-[280px] sm:min-h-[400px] lg:min-h-full transition-all duration-1000 ease-out shadow-lg ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
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
                Không gian <br/>tiện nghi trọn vẹn
              </h3>
            </div>
          </div>

          {/* Right Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {PHOTO_AMENITIES.map((item, index) => (
              <div 
                key={item.id}
                className={`group bg-white rounded-xl overflow-hidden border border-[#E8E2D2] hover:border-[#D45A2A]/40 transition-all duration-700 hover:shadow-[0_20px_40px_rgba(212,90,42,0.12)] hover:-translate-y-1.5 ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-[0.98]'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Image Half */}
                <div className="relative h-[180px] sm:h-[220px] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-[1.08] transition-transform duration-[1s] ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                  />
                  {/* Subtle Light Sweep */}
                  <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:animate-[shine_1s_ease-in-out_forwards] z-10 pointer-events-none" />
                </div>
                
                {/* Content Half */}
                <div className="p-5 sm:p-7">
                  <h4 className="text-[18px] font-bold text-[#111111] mb-2 group-hover:text-[#D45A2A] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[#555555] text-[14px] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
