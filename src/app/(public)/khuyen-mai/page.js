import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

import { getSeoMetadata, SchemaMarkup } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata() {
  return await getSeoMetadata('promotions', 'Khuyến mãi HaloPadel')
}

async function getPromotions() {
  return prisma.promotion.findMany({
    where: { venueId: VENUE_ID, isActive: true, isDeleted: false },
    orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
  })
}

export default async function PromotionsPage() {
  const promotions = await getPromotions()
  const now = new Date()

  // For UI purposes, we define fallback images if the DB banner is an abstract default
  const getBanner = (promo, index) => {
    if (promo.banner && !promo.banner.includes('default')) return promo.banner;
    return index === 0 ? '/images/gallery/gallery_action.png' : '/images/amenities/lounge.png';
  }

  // Define hardcoded badges for the UI demo based on promotion index/type
  const getBadges = (index) => {
    if (index === 0) return ['GIẢM 30%', 'Tặng nước uống', 'Cho mượn vợt miễn phí'];
    return ['Tiết kiệm 25%', 'Nhóm bạn / Hội nhóm'];
  }

  return (
    <>
      <SchemaMarkup pageKey="promotions" />
      <div className="py-12 md:py-20 bg-[#FFFDF6] min-h-screen">
      <div className="w-full px-4 md:px-8 max-w-[1200px] mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[13px] font-semibold text-[#D45A2A] uppercase tracking-[0.2em] mb-3">
            HaloPadel
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] font-bold text-[#111111] mb-4">
            Khuyến mãi & <span className="text-[#D45A2A]">Ưu đãi</span>
          </h1>
          <p className="text-[#555555] text-lg">Cập nhật các chương trình ưu đãi hấp dẫn nhất hiện có</p>
        </div>

        {promotions.length > 0 ? (
          <div className="flex flex-col gap-10">
            {promotions.map((promo, index) => {
              const isExpired = promo.endDate && new Date(promo.endDate) < now
              const isFeatured = index === 0 // Force first item to be featured campaign
              const badges = getBadges(index)
              const bannerSrc = getBanner(promo, index)

              if (isFeatured) {
                return (
                  <div key={promo.id} className={`group bg-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#E8E2D2] transition-all hover:shadow-[0_20px_60px_rgba(212,90,42,0.15)] hover:border-[#D45A2A]/30 flex flex-col lg:flex-row ${isExpired ? 'opacity-70 grayscale-[50%]' : ''}`}>
                    {/* Image Area */}
                    <div className="relative w-full lg:w-[55%] h-[300px] lg:h-auto overflow-hidden">
                      <Image src={bannerSrc} alt={promo.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" priority sizes="(max-width: 1024px) 100vw, 60vw" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
                      {/* Main Badge */}
                      {!isExpired && (
                        <div className="absolute top-6 left-6 bg-[#D45A2A] text-white px-5 py-2 rounded-[12px] font-heading font-bold text-[18px] shadow-lg transform -rotate-2">
                          GIẢM 30%
                        </div>
                      )}
                      {isExpired && (
                        <div className="absolute top-6 left-6 bg-red-600 text-white px-5 py-2 rounded-[12px] font-bold text-sm shadow-lg">
                          Đã kết thúc
                        </div>
                      )}
                    </div>
                    
                    {/* Content Area */}
                    <div className="w-full lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="bg-[#FFF9EE] text-[#D45A2A] border border-[#D45A2A]/20 px-3 py-1 rounded-lg text-[13px] font-semibold">🔥 Khai trương</span>
                        {promo.startDate && promo.endDate && (
                          <span className="bg-[#F8F5E4] text-[#555555] px-3 py-1 rounded-lg text-[13px] font-semibold">
                            Đến {formatDate(promo.endDate)}
                          </span>
                        )}
                      </div>

                      <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#111111] mb-4 leading-tight group-hover:text-[#D45A2A] transition-colors">
                        {promo.title}
                      </h2>
                      
                      {promo.shortDesc && (
                        <p className="text-[#555555] text-lg mb-6 leading-relaxed">
                          {promo.shortDesc}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 mb-10">
                        {badges.slice(1).map((badge, i) => (
                          <div key={i} className="flex items-center gap-2 text-[14px] font-medium text-[#111111]">
                            <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {badge}
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                        <Link href={`/khuyen-mai/${promo.slug}`} className="flex-1 text-center bg-[#D45A2A] hover:bg-[#B8431D] text-white px-8 py-4 rounded-[16px] font-bold text-[16px] transition-transform hover:-translate-y-1 shadow-[0_12px_30px_rgba(212,90,42,0.25)]">
                          Nhận ưu đãi ngay
                        </Link>
                        <Link href={`/khuyen-mai/${promo.slug}`} className="flex-1 text-center bg-transparent border-2 border-[#111111] hover:border-[#D45A2A] hover:bg-[#D45A2A]/5 text-[#111111] hover:text-[#D45A2A] px-8 py-4 rounded-[16px] font-bold text-[16px] transition-colors">
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              }

              // Secondary Promotions
              return (
                <Link
                  key={promo.id}
                  href={`/khuyen-mai/${promo.slug}`}
                  className={`group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300 border border-[#E8E2D2] hover:border-[#D45A2A]/30 flex flex-col md:flex-row ${isExpired ? 'opacity-60' : ''}`}
                >
                  <div className="relative w-full md:w-[35%] h-[240px] md:h-auto overflow-hidden">
                    <Image src={bannerSrc} alt={promo.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 35vw" />
                    {isExpired && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md">Đã kết thúc</div>
                    )}
                  </div>
                  
                  <div className="w-full md:w-[65%] p-6 md:p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-block bg-[#FFF9EE] text-[#D45A2A] px-3 py-1 rounded-lg text-[12px] font-bold tracking-wide uppercase mb-3">
                          {badges[0]}
                        </span>
                        <h2 className="font-heading text-2xl font-bold text-[#111111] group-hover:text-[#D45A2A] transition-colors mb-2">
                          {promo.title}
                        </h2>
                      </div>
                    </div>
                    
                    {promo.shortDesc && <p className="text-[#555555] text-[15px] mb-6 line-clamp-2 leading-relaxed">{promo.shortDesc}</p>}
                    
                    <div className="mt-auto pt-6 border-t border-[#E8E2D2] flex flex-wrap items-center justify-between gap-4">
                      {promo.startDate && promo.endDate ? (
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#888888]">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Áp dụng đến {formatDate(promo.endDate)}
                        </div>
                      ) : <div/>}
                      <span className="inline-flex items-center gap-2 text-[#D45A2A] font-bold text-[14px]">
                        Tư vấn gói tháng
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[24px] border border-[#E8E2D2]">
            <span className="text-6xl mb-4 block">🎁</span>
            <p className="text-[#888888] text-lg">Chưa có chương trình khuyến mãi nào</p>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
