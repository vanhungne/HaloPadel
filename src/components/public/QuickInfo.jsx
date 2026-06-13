'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function QuickInfo({ venue }) {
  const { t } = useLanguage()
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
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  if (!venue) return null

  let hoursValue = `06:00 – 22:00 ${t.common.everyDay}`
  try {
    if (venue.openingHours) {
      const parsed = JSON.parse(venue.openingHours)
      if (parsed.length > 0) {
        hoursValue = `${parsed[0].open} – ${parsed[0].close} ${t.common.everyDay}`
      }
    }
  } catch (e) {}

  const items = [
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: t.quickInfo.address,
      value: venue.address,
      description: t.quickInfo.addressDesc,
      href: venue.googleMapsUrl,
      target: '_blank',
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: 'Hotline',
      value: venue.hotline,
      description: t.quickInfo.hotlineDesc,
      href: venue.hotline ? `tel:${venue.hotline}` : null,
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
      label: 'Zalo',
      value: venue.zalo ? `Zalo: ${venue.zalo}` : null,
      description: t.quickInfo.zaloDesc,
      href: venue.zalo ? `https://zalo.me/${venue.zalo}` : null,
      target: '_blank',
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: t.quickInfo.openingHours,
      value: hoursValue,
      description: t.quickInfo.openingHoursDesc,
    },
  ].filter((item) => item.value)

  return (
    <section id="quickinfo" className="relative z-20 -mt-[4rem] sm:-mt-[6rem] md:-mt-[12rem]" ref={sectionRef}>
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-[#FFF9EE] rounded-[18px] sm:rounded-[22px] p-4 sm:p-6 group hover:-translate-y-1 transition-[transform,box-shadow] duration-300"
              style={{
                border: '1px solid rgba(58, 36, 24, 0.08)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
                transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D45A2A]/10 group-hover:bg-[#D45A2A]/15 flex items-center justify-center shrink-0 text-[#D45A2A] transition-colors duration-300">
                  {item.icon}
                </div>
                <div className="min-w-0 pt-1">
                  <p className="text-[11px] text-[#888888] font-bold uppercase tracking-[0.12em] mb-1.5">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.target}
                      rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className="text-[14px] font-bold text-[#111111] hover:text-[#D45A2A] transition-colors break-words leading-snug block mb-1"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-[14px] font-bold text-[#111111] break-words leading-snug block mb-1">
                      {item.value}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-[12.5px] text-[#555555] leading-snug">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
