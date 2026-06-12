'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function HeroSection({ venue, heroImage }) {
  const { t } = useLanguage()

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden flex items-center min-h-[100svh]"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {heroImage ? (
          <Image
            src={heroImage.url}
            alt={heroImage.altText || venue?.name || 'HaloPadel'}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#933212] via-[#D45A2A] to-[#E87A4F]" />
        )}

        {/* Overlay Gradients */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(18, 12, 8, 0.3) 0%, rgba(18, 12, 8, 0.6) 40%, rgba(18, 12, 8, 0.85) 100%)',
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: 'linear-gradient(90deg, rgba(18, 12, 8, 0.85) 0%, rgba(18, 12, 8, 0.5) 45%, rgba(18, 12, 8, 0) 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full -mt-[4vh] md:-mt-[12vh]" style={{ paddingTop: '72px' }}>
        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-10">
            
            {/* Left Content Area */}
            <div className="w-full lg:w-[65%] max-w-[720px] pt-4 sm:pt-8 lg:pt-0">
              
              {/* Top row: Brand & Badge */}
              <div className="flex items-center gap-4 mb-[28px]">
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold text-white uppercase tracking-wide"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  {t.hero.badge}
                </div>
                
                {/* Brand text */}
                <span className="text-white/80 text-[13px] font-bold tracking-[0.2em] uppercase hidden sm:block">
                  HaloPadel Sports Club
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-heading font-extrabold leading-[1.05] mb-[24px] tracking-tight"
                style={{
                  fontSize: 'clamp(2.375rem, 5vw, 4.5rem)',
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #F7E6C8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
                }}
              >
                {t.hero.headline} <br className="hidden md:block" />
                {t.hero.headlineSub}
              </h1>

              {/* Description */}
              <p
                className="text-white/90 leading-[1.7] mb-[34px] max-w-[580px] font-medium"
                style={{
                  fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
                  textShadow: '0 2px 12px rgba(0,0,0,0.3)',
                }}
              >
                {t.hero.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pb-6 sm:pb-0">
                {/* Primary CTA */}
                {venue?.hotline && (
                  <a
                    href={`tel:${venue.hotline}`}
                    className="hidden sm:inline-flex items-center justify-center gap-2.5 text-white font-bold transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      height: '52px',
                      padding: '0 24px',
                      borderRadius: '14px',
                      fontSize: '15px',
                      background: '#D45A2A',
                      boxShadow: '0 8px 24px rgba(212, 90, 42, 0.35)',
                    }}
                  >
                    <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {t.common.callConsult}
                  </a>
                )}

                {/* Secondary CTA: Zalo */}
                {venue?.zalo && (
                  <a
                    href={`https://zalo.me/${venue.zalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center justify-center gap-2.5 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
                    style={{
                      height: '48px',
                      padding: '0 22px',
                      borderRadius: '14px',
                      fontSize: '14px',
                      background: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.28)',
                    }}
                  >
                    <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    {t.common.chatZalo}
                  </a>
                )}

                {/* Tertiary CTA: Image Gallery */}
                <Link
                  href="/hinh-anh"
                  className="inline-flex items-center justify-center gap-2.5 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
                  style={{
                    height: '48px',
                    padding: '0 22px',
                    borderRadius: '14px',
                    fontSize: '14px',
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.28)',
                  }}
                >
                  <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t.common.viewGallery}
                </Link>
              </div>
            </div>

            {/* Right Content Area: Quick Info Glass Card (Desktop/Tablet only) */}
            <div className="hidden lg:block w-[35%] max-w-[360px]">
              <div 
                className="w-full rounded-[24px] p-7 text-white"
                style={{
                  background: 'rgba(255, 249, 238, 0.16)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  boxShadow: '0 24px 70px rgba(0,0,0,0.22)',
                }}
              >
                <h3 className="font-heading font-bold text-xl mb-6 flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#D45A2A]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  {t.hero.courtInfoTitle}
                </h3>
                
                <ul className="space-y-4 mb-7 text-[#FFFDF6]">
                  <li className="flex items-center gap-3 text-[15px] font-medium">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span></span>
                    </div>
                    {t.common.openNow}
                  </li>
                  <li className="flex items-center gap-3 text-[15px] font-medium">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    {t.hero.dailyHours}
                  </li>
                  <li className="flex items-center gap-3 text-[15px] font-medium">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    {t.hero.city}
                  </li>
                  <li className="flex items-center gap-3 text-[15px] font-medium">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-[#FFF9EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {t.hero.beginnerSupport}
                  </li>
                </ul>

                {venue?.googleMapsUrl && (
                  <a 
                    href={venue.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-[48px] bg-[#FFFDF6] text-[#111111] rounded-xl font-bold text-[14px] transition-all hover:bg-white hover:-translate-y-0.5"
                  >
                    {t.hero.directionsToCourtCta}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
