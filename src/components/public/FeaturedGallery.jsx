'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function FeaturedGallery({ images = [], section }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const { t } = useLanguage()

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const openLightbox = useCallback((img, index) => {
    setSelectedImage(img)
    setSelectedIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setSelectedImage(null)
  }, [])

  const navigateLightbox = useCallback((direction) => {
    const displayImages = images.slice(0, 5)
    const newIndex = (selectedIndex + direction + displayImages.length) % displayImages.length
    setSelectedIndex(newIndex)
    setSelectedImage(displayImages[newIndex])
  }, [selectedIndex, images])

  useEffect(() => {
    if (!selectedImage) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') navigateLightbox(-1)
      if (e.key === 'ArrowRight') navigateLightbox(1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, closeLightbox, navigateLightbox])

  const displayImages = images.slice(0, 5)

  // Each image flies in from a different direction
  // 0: from left, 1: from top, 2: from right, 3: from bottom-left, 4: from bottom-right
  const flyInStyles = [
    { hidden: 'translate(-120px, 40px) scale(0.92) rotate(-3deg)', delay: 0 },
    { hidden: 'translate(0, -100px) scale(0.92) rotate(2deg)', delay: 100 },
    { hidden: 'translate(120px, -40px) scale(0.92) rotate(3deg)', delay: 180 },
    { hidden: 'translate(-80px, 100px) scale(0.92) rotate(-2deg)', delay: 260 },
    { hidden: 'translate(100px, 100px) scale(0.92) rotate(2deg)', delay: 340 },
  ]

  return (
    <section id="gallery" className="py-16 md:py-28 bg-[#FFFDF6] overflow-hidden" ref={sectionRef}>
      <div className="w-full px-4 md:px-8 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div
          className="text-center mb-14 md:mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="block w-12 h-[2px] bg-gradient-to-r from-transparent to-[#D45A2A]/60 rounded-full" />
            <span className="text-[#D45A2A] text-xs md:text-sm font-semibold uppercase tracking-[0.3em]">
              {t.gallery?.subtitle || 'Trải nghiệm đẳng cấp'}
            </span>
            <span className="block w-12 h-[2px] bg-gradient-to-l from-transparent to-[#D45A2A]/60 rounded-full" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-[3rem] font-bold text-[#111111] leading-tight uppercase tracking-[0.15em]">
            {t.gallery.sectionTitle}
          </h2>
          <p className="mt-4 text-[#666] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.gallery?.description || 'Khám phá không gian sân Padel hiện đại, được thiết kế theo tiêu chuẩn quốc tế'}
          </p>
        </div>

        {/* Bento Grid — gap-0 for flush/tight layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-[3px] md:gap-[3px] md:h-[680px] rounded-[20px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.10)]">
          {displayImages.map((img, index) => {
            const fly = flyInStyles[index] || flyInStyles[0]

            let gridClass = ''
            let heightClass = 'h-[280px] md:h-full'

            if (index === 0) {
              gridClass = 'md:col-span-2 md:row-span-2'
              heightClass = 'h-[400px] md:h-full'
            } else {
              gridClass = 'md:col-span-1 md:row-span-1'
              heightClass = 'h-[260px] md:h-full'
            }

            return (
              <div
                key={img.id}
                className={`relative overflow-hidden group cursor-pointer ${gridClass} ${heightClass}`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translate(0,0) scale(1) rotate(0deg)' : fly.hidden,
                  transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${fly.delay}ms, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${fly.delay}ms`,
                }}
                onClick={() => openLightbox(img, index)}
              >
                {/* Image */}
                <Image
                  src={img.url}
                  alt={img.caption}
                  fill
                  className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
                  sizes={index === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 25vw'}
                  priority={index === 0}
                />

                {/* Shine sweep effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
                  <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg] group-hover:animate-[shine_0.8s_ease-in-out_forwards]" />
                </div>

                {/* Bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500 z-10" />

                {/* Badge for hero image */}
                {index === 0 && (
                  <div className="absolute top-5 left-5 z-20">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D45A2A] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-[#D45A2A]/30">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Nổi bật
                    </span>
                  </div>
                )}

                {/* Caption + zoom on hover */}
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 z-20 flex items-end justify-between">
                  <div className="translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <p className={`text-white font-bold tracking-tight leading-snug ${index === 0 ? 'text-lg md:text-xl' : 'text-sm md:text-base'}`}>
                      {img.caption}
                    </p>
                  </div>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 delay-100 shrink-0 ml-3 hover:bg-white/30">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Button */}
        <div
          className="text-center mt-12 md:mt-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s',
          }}
        >
          <Link
            href="/hinh-anh"
            className="group/btn inline-flex items-center gap-2.5 h-[52px] px-8 bg-transparent hover:bg-[#D45A2A] text-[#D45A2A] hover:text-white border-2 border-[#D45A2A]/40 hover:border-[#D45A2A] rounded-full font-bold text-[15px] transition-all duration-400 hover:shadow-[0_12px_28px_rgba(212,90,42,0.25)] hover:-translate-y-1"
          >
            <svg className="w-[18px] h-[18px] transition-transform duration-300 group-hover/btn:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {t.gallery.exploreAll}
            <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
          onClick={closeLightbox}
        >
          <button
            className="absolute top-5 right-5 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 z-50 hover:rotate-90"
            onClick={closeLightbox}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {displayImages.length > 1 && (
            <>
              <button
                className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 z-50 hover:scale-110"
                onClick={(e) => { e.stopPropagation(); navigateLightbox(-1) }}
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 z-50 hover:scale-110"
                onClick={(e) => { e.stopPropagation(); navigateLightbox(1) }}
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-5xl h-[70vh] md:h-[82vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.url}
              alt={selectedImage.caption}
              fill
              className="object-contain bg-black/60"
              sizes="100vw"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 px-6 py-5 md:px-8 md:py-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex items-end justify-between">
                <h3 className="text-white text-lg md:text-xl font-bold tracking-tight">
                  {selectedImage.caption}
                </h3>
                <span className="text-white/50 text-sm font-medium shrink-0 ml-4">
                  {selectedIndex + 1} / {displayImages.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  )
}
