import Image from 'next/image'
import Link from 'next/link'

export default function FeaturedGallery({ images, section }) {
  if (!images || images.length === 0) return null

  return (
    <section id="gallery" className="py-20 md:py-28 bg-[#FFFDF6]">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-[#BE4F24] uppercase tracking-[0.2em] mb-3">
            Không gian
          </p>
          <h2 className="font-heading text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-3">
            {section?.title || 'Hình ảnh sân'}
          </h2>
          <p className="text-[#555555] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {section?.subtitle || 'Không gian tập luyện đẳng cấp'}
          </p>
        </div>

        {/* Gallery Grid - Masonry style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
          {images.slice(0, 8).map((image, index) => {
            // First image spans 2 cols + 2 rows for masonry effect
            const isLarge = index === 0
            return (
              <div
                key={image.id}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                  isLarge ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <div className={`relative ${isLarge ? 'h-[280px] md:h-[420px]' : 'h-[140px] md:h-[200px]'}`}>
                  <Image
                    src={image.url}
                    alt={image.altText || image.caption || 'HaloPadel'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes={isLarge ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#111111]/0 group-hover:bg-[#111111]/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#111111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Caption on large image */}
                {image.caption && isLarge && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-[#111111]/60 to-transparent">
                    <p className="text-white text-sm font-medium">{image.caption}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-10">
          <Link
            href="/hinh-anh"
            className="inline-flex items-center gap-2.5 h-[48px] px-7 bg-transparent hover:bg-[#BE4F24]/5 text-[#BE4F24] border-2 border-[#BE4F24]/30 hover:border-[#BE4F24] rounded-2xl font-semibold text-[14px] transition-all duration-200"
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Xem tất cả hình ảnh
          </Link>
        </div>
      </div>
    </section>
  )
}
