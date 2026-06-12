import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import PromotionsPageClient from '@/components/public/PromotionsPageClient'

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

  return (
    <>
      <SchemaMarkup pageKey="promotions" />
      <PromotionsPageClient promotions={promotions} />
    </>
  )
}
