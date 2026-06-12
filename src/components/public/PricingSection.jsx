'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { localize } from '@/lib/i18n/localize'

export default function PricingSection({ plans = [], section }) {
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

  const tablePlans = plans.filter(p => !p.name.toLowerCase().includes('gói tháng')).sort((a, b) => a.displayOrder - b.displayOrder)
  const monthPlan = plans.find(p => p.name.toLowerCase().includes('gói tháng'))

  return (
    <section id="pricing" className="py-14 md:py-28 bg-[#FFFDF6]" ref={sectionRef}>
      <div className="w-full px-4 md:px-8 max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-[13px] font-semibold text-[#D45A2A] uppercase tracking-[0.2em] mb-3">
            {t.pricing.sectionLabel}
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-4">
            {t.pricing.sectionTitle}
          </h2>
        </div>

        {/* Pricing Layout (Table + Card) */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          
          {/* Left: Table (7/12) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-[#E8E2D2] overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-[1fr_120px_140px_1fr] gap-0 bg-[#2A1A12] px-6 py-4 text-[13px] font-bold text-white uppercase tracking-wider">
                <span>{t.pricing.tableHeaderSlot}</span>
                <span className="text-center">{t.pricing.tableHeaderTime}</span>
                <span className="text-center">{t.pricing.tableHeaderPrice}</span>
                <span>{t.pricing.tableHeaderNotes}</span>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-[#E8E2D2]">
                {tablePlans.map((plan, index) => (
                  <div 
                    key={index}
                    className={`p-5 md:px-6 md:py-5 transition-colors ${plan.name.toLowerCase().includes('cao điểm') ? 'bg-[#FFF4E8]' : 'hover:bg-[#F8F5E4]/50'}`}
                  >
                    {/* Mobile View */}
                    <div className="md:hidden">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-[16px] text-[#111111]">{localize(plan, 'name', locale)}</h3>
                        <span className="text-[18px] font-bold text-[#D45A2A]">{plan.price}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-[#555555] font-medium">{plan.timeSlot}</span>
                        <span className="text-[#888888]">{localize(plan, 'notes', locale)}</span>
                      </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-[1fr_120px_140px_1fr] gap-0 items-center">
                      <h3 className="font-bold text-[15px] text-[#111111]">{localize(plan, 'name', locale)}</h3>
                      <span className="text-center text-[14px] text-[#555555] font-medium">{plan.timeSlot}</span>
                      <span className="text-center text-[18px] font-bold text-[#D45A2A]">{plan.price}</span>
                      <span className="text-[13px] text-[#888888]">{localize(plan, 'notes', locale)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Membership Card (5/12) */}
          <div className="lg:col-span-5">

            {monthPlan && (
              <div 
                className="relative p-8 md:p-10 text-center transition-transform hover:-translate-y-2 duration-500"
                style={{
                  background: 'linear-gradient(180deg, #FFF9EE 0%, #FBEAD8 100%)',
                  border: '1px solid rgba(212, 90, 42, 0.22)',
                  boxShadow: '0 24px 70px rgba(212, 90, 42, 0.14)',
                  borderRadius: '28px'
                }}
              >
                {/* Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-[#D45A2A] text-white text-[12px] font-bold uppercase tracking-widest rounded-full shadow-lg whitespace-nowrap">
                  {t.pricing.mostPopular}
                </div>

                <h3 className="font-heading text-2xl md:text-3xl font-bold text-[#111111] mb-3 mt-2">
                  {localize(monthPlan, 'name', locale)}
                </h3>
                <p className="text-[#555555] text-[14px] leading-relaxed mb-6">
                  {localize(monthPlan, 'description', locale) || t.pricing.defaultMonthDesc}
                </p>
                
                <div className="mb-6 flex justify-center items-end gap-1">
                  <span className="text-4xl md:text-5xl font-bold text-[#D45A2A]">{monthPlan.price?.split('/')[0] || monthPlan.price}</span>
                  <span className="text-[#888888] font-medium text-lg mb-1">{t.pricing.perMonth}</span>
                </div>

                <ul className="text-left space-y-4 mb-8 max-w-[260px] mx-auto">
                  <li className="flex items-center gap-3 text-[#111111] font-medium">
                    <svg className="w-5 h-5 text-[#D45A2A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {localize(monthPlan, 'notes', locale) || t.pricing.feature1Default}
                  </li>
                  <li className="flex items-center gap-3 text-[#111111] font-medium">
                    <svg className="w-5 h-5 text-[#D45A2A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t.pricing.feature2}
                  </li>
                  <li className="flex items-center gap-3 text-[#111111] font-medium">
                    <svg className="w-5 h-5 text-[#D45A2A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t.pricing.feature3}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-10 md:mt-16 max-w-2xl mx-auto">
          <p className="text-[15px] font-medium text-[#111111] mb-6">
            {t.pricing.ctaText}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Zalo Button */}
            <a
              href="https://zalo.me/0909123456"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-[52px] px-8 bg-white border-2 border-[#0068FF] text-[#0068FF] rounded-2xl font-bold text-[15px] transition-all duration-300 hover:bg-[#0068FF]/5 hover:shadow-[0_8px_20px_rgba(0,104,255,0.15)] hover:-translate-y-1"
            >
              <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.384 10.536C21.384 6.223 17.518 2.5 12.5 2.5S3.616 6.223 3.616 10.536c0 2.227 1.056 4.296 2.872 5.753-.16.924-.623 2.535-1.026 3.428-.15.334.204.608.528.455 1.765-.836 3.606-1.572 4.417-1.854.673.13 1.384.2 2.115.2 5.018 0 8.862-3.723 8.862-8.036zM11.666 12.392h-1.928v-.54h1.365v-.444h-1.365v-.54h1.928v-.517H9.2v2.558h2.466v-.517zm2.935 0h-.551v-2.558h.551v2.558zm-1.127 0h-.518L12.33 11.23v1.162h-.517v-2.558h.518L12.956 11V9.834h.517v2.558zm3.626-2.023c0 .243-.166.452-.416.518.25.066.416.275.416.518v.47H16.55v-.47c0-.184-.131-.323-.323-.323h-.517v.793h-.517v-2.558h1.034c.192 0 .323.14.323.323v.47c0 .213-.153.376-.356.415.203.04.356.203.356.415v-.06h.55z" />
              </svg>
              {t.common.chatZaloNow}
            </a>
            
            {/* Phone Button */}
            <a
              href="tel:0909123456"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-[52px] px-8 bg-[#D45A2A] hover:bg-[#B8431D] text-white rounded-2xl font-bold text-[15px] transition-all duration-300 hover:shadow-[0_8px_20px_rgba(212,90,42,0.25)] hover:-translate-y-1"
            >
              <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {t.common.callConsultShort}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
