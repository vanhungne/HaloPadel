'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { formatDate } from '@/lib/utils'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { localize, localizeStrict } from '@/lib/i18n/localize'

export default function AnnouncementsSection({ section, announcements = [] }) {
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

  if (!announcements || announcements.length === 0) return null;

  const featured = announcements.find(a => a.isPinned) || announcements[0]
  const listAnnouncements = announcements.filter(a => a.id !== featured?.id).slice(0, 4)

  const getTypeStyle = (type) => {
    switch (type) {
      case 'INFO': return { bg: 'bg-blue-100', text: 'text-blue-700', label: t.announcements.typeInfo }
      case 'EVENT': return { bg: 'bg-amber-50', text: 'text-amber-600', label: t.announcements.typeEvent }
      case 'PROMO': return { bg: 'bg-[#D45A2A]/10', text: 'text-[#D45A2A]', label: t.announcements.typePromo }
      case 'MAINTENANCE': return { bg: 'bg-gray-100', text: 'text-gray-600', label: t.announcements.typeMaintenance }
      default: return { bg: 'bg-blue-50', text: 'text-blue-600', label: t.announcements.typeDefault }
    }
  }

  return (
    <section id="announcements" className="py-14 md:py-24 bg-[#FFFDF6]" ref={sectionRef}>
      <div className="w-full px-4 md:px-8 max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-[13px] font-semibold text-[#D45A2A] uppercase tracking-[0.2em] mb-3">
            {t.announcements.sectionLabel}
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-4">
            {localizeStrict(section, 'title', locale) || t.announcements.sectionTitle}
          </h2>
          <p className="text-[#555555] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {localizeStrict(section, 'subtitle', locale) || t.announcements.sectionSubtitle}
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          
          {/* Left: Featured Announcement */}

          {featured && (
            <div 
              className="flex flex-col p-8 md:p-10 transition-transform duration-500 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #FFF9EE 0%, #FBEAD8 100%)',
                border: '1px solid rgba(212, 90, 42, 0.18)',
                borderRadius: '28px',
                boxShadow: '0 24px 70px rgba(212, 90, 42, 0.12)'
              }}
            >
              {featured.image && (
                <div className="w-full h-[220px] relative rounded-[20px] mb-6 overflow-hidden">
                  <Image src={featured.image} alt={featured.title} fill className="object-cover" />
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-6">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-[#D45A2A] text-white text-[12px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  {t.common.pinned}
                </span>
                <span className="px-3 py-1 bg-[#111111] text-white text-[12px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                  {t.common.important}
                </span>
              </div>
              
              <h3 className="font-heading text-2xl md:text-[28px] font-bold text-[#111111] mb-4 leading-snug">
                {localize(featured, 'title', locale)}
              </h3>
              
              <p className="text-[#555555] text-[15px] md:text-[16px] leading-relaxed mb-8 flex-1 line-clamp-3">
                {(localize(featured, 'content', locale))?.substring(0, 150)}...
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-[#D45A2A]/20 mt-auto">
                <div className="text-[14px] text-[#888888] font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {featured.startDate ? `${t.common.validFrom} ${formatDate(featured.startDate)}` : `${t.common.postedOn} ${formatDate(featured.createdAt)}`}
                </div>
                
                <Link 
                  href={`/thong-bao/${featured.slug}`}
                  className="inline-flex items-center justify-center gap-2 h-[44px] px-6 bg-transparent border-2 border-[#D45A2A] hover:bg-[#D45A2A] text-[#D45A2A] hover:text-white rounded-xl font-bold text-[14px] transition-colors w-full sm:w-auto"
                >
                  {t.common.viewDetails}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Right: List of small announcements */}
          <div className="flex flex-col justify-between space-y-4">
            {listAnnouncements.map((ann) => {
              const style = getTypeStyle(ann.type)
              return (
                <Link
                  key={ann.id}
                  href={`/thong-bao/${ann.slug}`}
                  className="group flex items-center gap-4 p-5 transition-all duration-300"
                  style={{
                    background: '#FFFDF7',
                    border: '1px solid rgba(58, 36, 24, 0.1)',
                    borderRadius: '20px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(58, 36, 24, 0.08)'
                    e.currentTarget.style.borderColor = 'rgba(212, 90, 42, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = 'rgba(58, 36, 24, 0.1)'
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold ${style.text} ${style.bg} px-2 py-0.5 rounded uppercase tracking-wider`}>
                        {style.label}
                      </span>
                      <span className="text-[12px] text-[#888888] flex items-center gap-1">
                        • {formatDate(ann.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-[#111111] group-hover:text-[#D45A2A] transition-colors truncate">
                      {localize(ann, 'title', locale)}
                    </h3>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-[#FFF9EE] flex items-center justify-center shrink-0 group-hover:bg-[#D45A2A] group-hover:text-white text-[#D45A2A] transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* View all CTA */}
        <div className="text-center mt-12">
          <Link
            href="/thong-bao"
            className="inline-flex items-center gap-2 text-[15px] font-bold text-[#D45A2A] hover:text-[#B8431D] transition-colors"
          >
            {t.common.viewAllAnnouncements}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
