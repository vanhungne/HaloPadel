import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import Image from 'next/image'

export const revalidate = 60

export async function generateMetadata() {
  const seo = await prisma.seoSetting.findUnique({
    where: { venueId_pageKey: { venueId: VENUE_ID, pageKey: 'about' } },
  })
  return {
    title: seo?.metaTitle || 'Giới thiệu',
    description: seo?.metaDescription || 'Tìm hiểu về sân thể thao HaloPadel',
  }
}

async function getAboutData() {
  const [venue, galleryImages] = await Promise.all([
    prisma.venue.findFirst({ where: { id: VENUE_ID, isActive: true } }),
    prisma.mediaFile.findMany({
      where: { venueId: VENUE_ID, category: 'GALLERY', isActive: true, isDeleted: false },
      orderBy: { displayOrder: 'asc' },
      take: 4,
    }),
  ])
  return { venue, galleryImages }
}

export default async function AboutPage() {
  const { venue, galleryImages } = await getAboutData()

  return (
    <div className="py-8 md:py-12">
      {/* Page Header */}
      <div className="section-container mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-main mb-4">
            Giới thiệu <span className="text-primary">HaloPadel</span>
          </h1>
          <p className="text-lg text-text-sub">
            {venue?.shortDesc || 'Sân thể thao chuyên nghiệp, không gian tập luyện đẳng cấp'}
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>
      </div>

      {/* Image + Content Grid */}
      <div className="section-container mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Images */}
          <div className="grid grid-cols-2 gap-3">
            {galleryImages.length > 0 ? (
              galleryImages.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative rounded-2xl overflow-hidden shadow-card ${
                    i === 0 ? 'col-span-2 h-56 md:h-72' : 'h-36 md:h-44'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || 'HaloPadel'}
                    fill
                    className="object-cover"
                    sizes={i === 0 ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-2 h-56 md:h-72 rounded-2xl bg-cream flex items-center justify-center">
                <span className="text-5xl">🏟️</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            {venue?.longDesc ? (
              <div
                className="rich-content"
                dangerouslySetInnerHTML={{ __html: venue.longDesc }}
              />
            ) : (
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>HaloPadel tự hào là một trong những sân Padel chuyên nghiệp hàng đầu, được thiết kế và xây dựng theo tiêu chuẩn quốc tế.</p>
                <p>Chúng tôi cam kết mang đến trải nghiệm tập luyện tốt nhất cho khách hàng với cơ sở vật chất hiện đại và dịch vụ chuyên nghiệp.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="section-container">
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">
            Sẵn sàng trải nghiệm?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Liên hệ ngay để được tư vấn và đặt sân tập luyện
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {venue?.hotline && (
              <a
                href={`tel:${venue.hotline}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-full font-semibold hover:bg-cream transition-all shadow-lg"
              >
                📞 {venue.hotline}
              </a>
            )}
            {venue?.zalo && (
              <a
                href={`https://zalo.me/${venue.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-full font-semibold hover:bg-white/30 transition-all border border-white/30"
              >
                💬 Chat Zalo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
