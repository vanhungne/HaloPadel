import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import GalleryShowcase from '@/components/public/GalleryShowcase'
import GalleryPageHeader from '@/components/public/GalleryPageHeader'
import Image from 'next/image'

import { getSeoMetadata, SchemaMarkup } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata() {
  return await getSeoMetadata('gallery', 'Hình ảnh HaloPadel')
}

async function getGalleryData() {
  return prisma.mediaFile.findMany({
    where: {
      venueId: VENUE_ID,
      category: { in: ['GALLERY', 'COURT', 'HERO', 'AMENITY', 'LOUNGE'] },
      isActive: true,
      isDeleted: false,
    },
    orderBy: [{ category: 'asc' }, { displayOrder: 'asc' }],
  })
}

export default async function GalleryPage() {
  const images = await getGalleryData()

  // Find a hero image to feature at the top
  const heroImage = images.find(img => img.category === 'HERO') || images.find(img => img.category === 'GALLERY') || images[0]

  return (
    <>
      <SchemaMarkup pageKey="gallery" />
      <div className="py-12 md:py-20 bg-[#FFFDF6] min-h-screen">
      <div className="w-full px-4 md:px-8 max-w-[1200px] mx-auto">
        
        {/* Page Header */}
        <GalleryPageHeader />

        {/* Hero Section */}
        {heroImage && (
          <div className="mb-16 md:mb-20">
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
              <Image 
                src={heroImage.url} 
                alt={heroImage.altText || 'HaloPadel Premium Space'} 
                fill 
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </div>
          </div>
        )}

        {/* Interactive Gallery Showcase (Tabs + Grid + Lightbox) */}
        <GalleryShowcase images={images} />
        
      </div>
    </div>
    </>
  )
}
