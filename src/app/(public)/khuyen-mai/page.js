import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export const revalidate = 60

export async function generateMetadata() {
  const seo = await prisma.seoSetting.findUnique({
    where: { venueId_pageKey: { venueId: VENUE_ID, pageKey: 'promotions' } },
  })
  return {
    title: seo?.metaTitle || 'Khuyến mãi',
    description: seo?.metaDescription || 'Các chương trình khuyến mãi tại HaloPadel',
  }
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

  return (
    <div className="py-8 md:py-12">
      <div className="section-container mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-main mb-4">
            Khuyến mãi <span className="text-primary">& Ưu đãi</span>
          </h1>
          <p className="text-lg text-text-sub">Cập nhật các chương trình ưu đãi hấp dẫn nhất</p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>
      </div>

      <div className="section-container">
        {promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promotions.map((promo) => {
              const isExpired = promo.endDate && new Date(promo.endDate) < now
              return (
                <Link
                  key={promo.id}
                  href={`/khuyen-mai/${promo.slug}`}
                  className={`group bg-card-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border-light hover:border-primary/20 ${isExpired ? 'opacity-60' : ''}`}
                >
                  {promo.banner && (
                    <div className="relative h-52 md:h-60 overflow-hidden">
                      <Image src={promo.banner} alt={promo.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
                      {isExpired && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">Đã kết thúc</span>
                        </div>
                      )}
                      {promo.isFeatured && !isExpired && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">🔥 Nổi bật</div>
                      )}
                    </div>
                  )}
                  <div className="p-5 md:p-6">
                    <h2 className="font-heading text-lg md:text-xl font-bold text-text-main group-hover:text-primary transition-colors mb-2">{promo.title}</h2>
                    {promo.shortDesc && <p className="text-sm text-text-sub mb-3 line-clamp-2">{promo.shortDesc}</p>}
                    <div className="flex items-center justify-between text-xs text-text-light">
                      {promo.startDate && promo.endDate && (
                        <span>📅 {formatDate(promo.startDate)} - {formatDate(promo.endDate)}</span>
                      )}
                      <span className="text-primary font-semibold">Xem chi tiết →</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🎁</span>
            <p className="text-text-light text-lg">Chưa có chương trình khuyến mãi nào</p>
          </div>
        )}
      </div>
    </div>
  )
}
