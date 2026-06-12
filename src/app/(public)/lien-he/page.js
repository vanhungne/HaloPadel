import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import GoogleMap from '@/components/public/GoogleMap'
import ContactPageHeader from '@/components/public/ContactPageHeader'

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
        <ContactPageHeader />

        {/* Map & Contact Info Component */}
        <div className="mt-[-40px]">
          <GoogleMap venue={venue} />
        </div>
      </div>
    </div>
    </>
  )
}
