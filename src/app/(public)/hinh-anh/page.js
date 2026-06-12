import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import Image from 'next/image'

export const revalidate = 60

export async function generateMetadata() {
  const seo = await prisma.seoSetting.findUnique({
    where: { venueId_pageKey: { venueId: VENUE_ID, pageKey: 'gallery' } },
  })
  return {
    title: seo?.metaTitle || 'Hình ảnh',
    description: seo?.metaDescription || 'Hình ảnh sân thể thao HaloPadel',
  }
}

async function getGalleryData() {
  return prisma.mediaFile.findMany({
    where: {
      venueId: VENUE_ID,
      category: { in: ['GALLERY', 'COURT', 'HERO', 'AMENITY'] },
      isActive: true,
      isDeleted: false,
    },
    orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }],
  })
}

export default async function GalleryPage() {
  const images = await getGalleryData()

  // Group by category
  const categories = {}
  images.forEach((img) => {
    if (!categories[img.category]) categories[img.category] = []
    categories[img.category].push(img)
  })

  const categoryLabels = {
    HERO: 'Banner',
    COURT: 'Sân chơi',
    GALLERY: 'Không gian',
    AMENITY: 'Tiện ích',
  }

  return (
    <div className="py-8 md:py-12">
      {/* Page Header */}
      <div className="section-container mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-main mb-4">
            Hình ảnh <span className="text-primary">sân</span>
          </h1>
          <p className="text-lg text-text-sub">
            Khám phá không gian tập luyện đẳng cấp tại HaloPadel
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>
      </div>

      {/* Gallery */}
      <div className="section-container">
        {Object.entries(categories).map(([cat, imgs]) => (
          <div key={cat} className="mb-12">
            <h2 className="font-heading text-xl font-bold text-text-main mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              {categoryLabels[cat] || cat}
              <span className="text-sm font-normal text-text-light ml-2">({imgs.length} ảnh)</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {imgs.map((img) => (
                <div
                  key={img.id}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer h-40 md:h-52"
                >
                  <Image
                    src={img.url}
                    alt={img.altText || img.caption || 'HaloPadel'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-xs font-medium">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🖼️</span>
            <p className="text-text-light text-lg">Hình ảnh đang được cập nhật...</p>
          </div>
        )}
      </div>
    </div>
  )
}
