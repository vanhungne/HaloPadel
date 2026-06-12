'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function GalleryShowcase({ images }) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('ALL')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const tabs = [
    { id: 'ALL', label: t.gallery.tabAll },
    { id: 'GALLERY', label: t.gallery.tabSpace },
    { id: 'COURT', label: t.gallery.tabCourt },
    { id: 'AMENITY', label: t.gallery.tabAmenity },
    { id: 'HERO', label: t.gallery.tabBanner },
  ]

  // Filter images based on active tab
  const filteredImages = activeTab === 'ALL' ? images : images.filter(img => {
    // Group Lounge and Amenity together if needed, but the original data has AMENITY
    if (activeTab === 'AMENITY' && (img.category === 'AMENITY' || img.category === 'LOUNGE')) return true;
    return img.category === activeTab;
  })

  // Lightbox handlers
  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const nextImage = (e) => {
    e.stopPropagation()
    setLightboxIndex((prev) => (prev + 1) % filteredImages.length)
  }
  const prevImage = (e) => {
    e.stopPropagation()
    setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)
  }

  // Layout Generator based on Category
  const renderCollage = () => {
    if (filteredImages.length === 0) return (
      <div className="text-center py-20">
        <span className="text-6xl mb-4 block">🖼️</span>
        <p className="text-[#888888] text-lg">{t.gallery.updating}</p>
      </div>
    )

    // For "ALL" or Categories, we build a staggered masonry/collage
    // Simple collage strategy: chunk into groups of 3 or 4 based on index to create variety
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[240px]">
        {filteredImages.map((img, i) => {
          let spanClasses = 'md:col-span-4' // default
          // Pattern: 1 large, 2 small, 1 wide, etc.
          if (i % 5 === 0) spanClasses = 'md:col-span-8 row-span-2' // Large featured
          else if (i % 5 === 1) spanClasses = 'md:col-span-4 row-span-1' // Small
          else if (i % 5 === 2) spanClasses = 'md:col-span-4 row-span-1' // Small
          else if (i % 5 === 3) spanClasses = 'md:col-span-6 row-span-1' // Wide
          else if (i % 5 === 4) spanClasses = 'md:col-span-6 row-span-1' // Wide

          return (
            <div 
              key={img.id} 
              onClick={() => openLightbox(i)}
              className={`${spanClasses} relative rounded-[20px] overflow-hidden group cursor-pointer border border-[#E8E2D2] shadow-sm`}
            >
              <Image 
                src={img.url} 
                alt={img.altText || img.caption || 'HaloPadel Gallery'} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
                {img.caption && (
                  <p className="text-white font-medium text-[15px] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {img.caption}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          const count = tab.id === 'ALL' ? images.length : images.filter(img => img.category === tab.id || (tab.id === 'AMENITY' && img.category === 'LOUNGE')).length
          
          if (count === 0 && tab.id !== 'ALL') return null;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-300 flex items-center gap-2 ${
                isActive 
                  ? 'bg-[#D45A2A] text-white shadow-md' 
                  : 'bg-[#FFFDF6] text-[#555555] hover:bg-[#F8F5E4] border border-[#E8E2D2]'
              }`}
            >
              {tab.label}
              <span className={`text-[12px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-[#E8E2D2] text-[#888888]'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Gallery Grid */}
      {renderCollage()}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
            onClick={closeLightbox}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev Button */}
          <button 
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
            onClick={prevImage}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button 
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50"
            onClick={nextImage}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image */}
          <div 
            className="relative w-full max-w-6xl h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[80vh]">
              <Image 
                src={filteredImages[lightboxIndex].url} 
                alt={filteredImages[lightboxIndex].altText || 'Gallery Image'}
                fill
                className="object-contain"
              />
            </div>
            {/* Caption */}
            {filteredImages[lightboxIndex].caption && (
              <p className="text-white/80 text-lg mt-6 text-center">
                {filteredImages[lightboxIndex].caption}
              </p>
            )}
            <div className="text-white/50 text-sm mt-2 font-medium tracking-widest">
              {lightboxIndex + 1} / {filteredImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
