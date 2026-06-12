'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function FeaturedGallery({ images = [], section }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const gridRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 } // Trigger when 15% of the grid is visible
    )
    
    if (gridRef.current) {
      observer.observe(gridRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  return (
    <section id="gallery" className="py-14 md:py-28 bg-[#FFFDF6]">
      <div className="w-full px-4 md:px-8 max-w-[1500px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight uppercase tracking-widest">
            {t.gallery.sectionTitle}
          </h2>
        </div>

        {/* Premium Collage Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[380px] gap-2.5 md:gap-4 mx-auto"
        >
          {images.slice(0, 4).map((img, index) => {
            const gridClass = index === 0 ? 'md:col-span-2 md:row-span-2 h-[400px] md:h-full' : (index === 3 ? 'md:col-span-2 md:row-span-1 h-[280px] md:h-full' : 'md:col-span-1 md:row-span-1 h-[250px] md:h-full');
            return (
            <div 
              key={img.id} 
              className={`relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-32 scale-[0.98]'
              } ${img.gridClass}`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img.url}
                alt={img.caption}
                fill
                className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Shine Effect */}
              <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:animate-[shine_1s_ease-in-out_forwards] z-10 pointer-events-none" />

              {/* Gradient Overlay for Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500 z-10" />

              {/* Hover Zoom Icon & Caption */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-20">
                <div className="flex items-end justify-between">
                  <p className="text-white font-semibold text-lg md:text-xl tracking-tight translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    {img.caption}
                  </p>
                  
                  {/* Zoom Icon */}
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 delay-75 shrink-0 ml-4">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/hinh-anh"
            className="inline-flex items-center gap-2.5 h-[52px] px-8 bg-transparent hover:bg-[#D45A2A]/5 text-[#D45A2A] border-2 border-[#D45A2A]/30 hover:border-[#D45A2A] rounded-full font-bold text-[15px] transition-all duration-300 hover:shadow-[0_8px_20px_rgba(212,90,42,0.15)] hover:-translate-y-1"
          >
            <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {t.gallery.exploreAll}
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-[#111111]/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            onClick={() => setSelectedImage(null)}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className="relative w-full max-w-6xl h-[80vh] md:h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.url}
              alt={selectedImage.caption}
              fill
              className="object-contain bg-black/50"
              sizes="100vw"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-[#111111]/90 via-[#111111]/40 to-transparent">
              <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight">{selectedImage.caption}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
