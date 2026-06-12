import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export default function PromotionsSection({ promotions, section }) {
  if (!promotions || promotions.length === 0) return null

  return (
    <section id="promotions" className="py-20 md:py-28">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-[#BE4F24] uppercase tracking-[0.2em] mb-3">
            Ưu đãi
          </p>
          <h2 className="font-heading text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-3">
            {section?.title || 'Khuyến mãi'}
          </h2>
          <p className="text-[#555555] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {section?.subtitle || 'Ưu đãi hấp dẫn dành cho bạn'}
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {promotions.map((promo) => (
            <Link
              key={promo.id}
              href={`/khuyen-mai/${promo.slug}`}
              className="group bg-[#FFFDF6] rounded-2xl overflow-hidden border border-[#E8E2D2] hover:border-[#BE4F24]/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              {/* Banner */}
              {promo.banner && (
                <div className="relative h-48 md:h-52 overflow-hidden">
                  <Image
                    src={promo.banner}
                    alt={promo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {promo.isFeatured && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-[#BE4F24] text-white text-[11px] font-bold uppercase tracking-wider rounded-full">
                      Nổi bật
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="font-heading text-[17px] md:text-lg font-bold text-[#111111] group-hover:text-[#BE4F24] transition-colors mb-2 leading-snug">
                  {promo.title}
                </h3>
                {promo.shortDesc && (
                  <p className="text-[13px] text-[#555555] mb-4 line-clamp-2 leading-relaxed">
                    {promo.shortDesc}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {promo.startDate && promo.endDate && (
                    <span className="text-[12px] text-[#888888]">
                      {formatDate(promo.startDate)} – {formatDate(promo.endDate)}
                    </span>
                  )}
                  <span className="text-[13px] font-semibold text-[#BE4F24]">
                    Xem chi tiết →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            href="/khuyen-mai"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#BE4F24] hover:text-[#A9411D] transition-colors"
          >
            Xem tất cả khuyến mãi
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
