'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { localize, localizeStrict } from '@/lib/i18n/localize'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

export default function GoogleMap({ venue, section }) {
  const { t, locale } = useLanguage()
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
      { threshold: 0.08 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="map" className="py-12 md:py-24 bg-white" ref={sectionRef}>
      <div className="w-full px-4 md:px-8 max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div
          className="text-center mb-8 md:mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <p className="text-[13px] font-semibold text-[#D45A2A] uppercase tracking-[0.2em] mb-3">
            {t.map.sectionLabel}
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-3 md:mb-4">
            {localizeStrict(section, 'title', locale) || t.map.sectionTitle}
          </h2>
          <p className="text-[#555555] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {localizeStrict(section, 'subtitle', locale) || t.map.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10">
          {/* Map (8/12) */}
          <div
            className="lg:col-span-8 relative rounded-[20px] sm:rounded-[28px] overflow-hidden border border-[#D45A2A]/20 h-[280px] sm:h-[360px] lg:h-[500px] shadow-[0_24px_70px_rgba(212,90,42,0.12)]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(-60px) scale(0.96)',
              transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.15s',
            }}
          >
            {/* Map Iframe */}
            {venue?.googleMapsEmbed ? (
              <div
                dangerouslySetInnerHTML={{ __html: venue.googleMapsEmbed }}
                className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
              />
            ) : (
              <div className="w-full h-full bg-[#F8F5E4] flex items-center justify-center">
                <div className="text-center text-[#888888]">
                  <svg className="w-12 h-12 mx-auto mb-3 text-[#CCCCCC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-sm">{t.map.mapUpdating}</p>
                </div>
              </div>
            )}
            
            {/* Map Overlay Top Left */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-xl shadow-lg border border-[#E8E2D2] pointer-events-none hidden sm:block">
              <h4 className="font-bold text-[#111111] text-[15px] mb-0.5">HaloPadel Sports Club</h4>
              <p className="text-[#555555] text-[12.5px] font-medium">{t.map.addressPlaceholder}</p>
            </div>
            
            {/* Map Overlay Bottom Right Button */}
            {venue?.googleMapsUrl && (
              <a
                href={venue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-[#111111] hover:bg-[#D45A2A] text-white px-5 py-2.5 rounded-xl font-bold text-[13.5px] transition-all shadow-xl flex items-center gap-2 group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t.common.openGoogleMaps}
              </a>
            )}
          </div>

          {/* Info Card (4/12) */}
          <div
            className="lg:col-span-4 bg-[#FFFDF6] rounded-[20px] sm:rounded-[28px] p-5 sm:p-6 md:p-8 border border-[#E8E2D2] shadow-sm flex flex-col hover:shadow-md transition-shadow duration-300"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(60px) scale(0.96)',
              transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.3s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.3s',
            }}
          >
            {/* Thumbnail Header */}
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-[#D45A2A]/20">
                <Image src="/images/amenities/lounge.png" alt="HaloPadel" fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-[#111111] text-[16px]">HaloPadel Sports Club</h4>
                <p className="text-[#D45A2A] text-[13px] font-medium">{t.map.courtSubtitle}</p>
              </div>
            </div>

            <h3 className="font-heading text-xl font-bold text-[#111111] mb-6">
              {t.map.contactInfoTitle}
            </h3>
            
            <div className="space-y-4 sm:space-y-6 flex-1">
              {[
                { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', icon2: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: t.map.addressLabel, value: venue?.address || t.map.defaultAddress, href: venue?.googleMapsUrl, target: '_blank' },
                { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: t.map.hotlineLabel, value: venue?.hotline || '0909 123 456', href: venue?.hotline ? `tel:${venue.hotline}` : 'tel:0909123456' },
                { icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', label: t.map.zaloLabel, value: venue?.zalo || '0909123456', href: venue?.zalo ? `https://zalo.me/${venue.zalo}` : 'https://zalo.me/0909123456', target: '_blank' },
                { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: t.map.emailLabel, value: venue?.email || 'info@halopadel.vn', href: venue?.email ? `mailto:${venue.email}` : 'mailto:info@halopadel.vn' },
                { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: t.map.hoursLabel, value: t.map.defaultHours },
              ].filter(i => i.value).map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF9EE] flex items-center justify-center shrink-0 text-[#D45A2A] border border-[#D45A2A]/10">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                      {item.icon2 && <path d={item.icon2} />}
                    </svg>
                  </div>
                  <div className="pt-0.5">
                    <p className="text-[11px] text-[#888888] uppercase tracking-wider font-semibold mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target={item.target} rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                        className="text-[14px] font-bold text-[#111111] hover:text-[#D45A2A] transition-colors leading-snug">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-[14px] font-bold text-[#111111] leading-snug">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Dual CTAs */}
            <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#E8E2D2]">
              <a
                href={venue?.googleMapsUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-[48px] px-3 lg:px-2 xl:px-4 bg-[#D45A2A] hover:bg-[#B8431D] text-white rounded-[14px] font-bold text-[14px] transition-transform hover:-translate-y-0.5 shadow-md hover:shadow-lg text-center whitespace-nowrap"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t.common.viewDirections}
              </a>
              <a
                href={venue?.hotline ? `tel:${venue.hotline}` : 'tel:0909123456'}
                className="flex items-center justify-center gap-2 h-[48px] px-3 lg:px-2 xl:px-4 bg-transparent border-2 border-[#111111] hover:border-[#D45A2A] hover:bg-[#D45A2A]/5 text-[#111111] hover:text-[#D45A2A] rounded-[14px] font-bold text-[14px] transition-transform hover:-translate-y-0.5 text-center whitespace-nowrap"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t.common.callNow}
              </a>
            </div>
          </div>
        </div>

        {/* Quick Info Badges */}
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s',
          }}
        >
          <div className="flex items-center gap-2 bg-[#FFF9EE] px-4 py-2 rounded-xl border border-[#D45A2A]/10 text-[13px] font-semibold text-[#111111]">
            <svg className="w-4 h-4 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            {t.common.freeParking}
          </div>
          <div className="flex items-center gap-2 bg-[#FFF9EE] px-4 py-2 rounded-xl border border-[#D45A2A]/10 text-[13px] font-semibold text-[#111111]">
            <svg className="w-4 h-4 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t.map.defaultHours}
          </div>
          <div className="flex items-center gap-2 bg-[#FFF9EE] px-4 py-2 rounded-xl border border-[#D45A2A]/10 text-[13px] font-semibold text-[#111111]">
            <svg className="w-4 h-4 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            {t.common.zaloDirectionSupport}
          </div>
        </div>

      </div>
    </section>
  )
}
