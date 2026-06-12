import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import GoogleMap from '@/components/public/GoogleMap'

import { getSeoMetadata, SchemaMarkup } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata() {
  return await getSeoMetadata('contact', 'Liên hệ HaloPadel')
}

async function getVenueData() {
  return prisma.venue.findUnique({
    where: { id: VENUE_ID },
  })
}

export default async function ContactPage() {
  const venue = await getVenueData()

  return (
    <>
      <SchemaMarkup pageKey="contact" />
      <div className="pt-24 pb-12 md:pb-20 bg-[#FFFDF6] min-h-screen">
      <div className="w-full px-4 md:px-8 max-w-[1200px] mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <p className="text-[13px] font-semibold text-[#D45A2A] uppercase tracking-[0.2em] mb-3">
            HaloPadel Sports Club
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] font-bold text-[#111111] mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-[#555555] text-lg">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Vui lòng liên hệ qua các kênh dưới đây hoặc trực tiếp đến sân.
          </p>
        </div>

        {/* Map & Contact Info Component */}
        <div className="mt-[-40px]">
          <GoogleMap venue={venue} section={{ title: 'Vị trí sân', subtitle: 'Tìm đường đi ngắn nhất đến với HaloPadel Đà Nẵng' }} />
        </div>
      </div>
    </div>
    </>
  )
}
