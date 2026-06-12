import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import AboutClient from '@/components/public/AboutClient'

import { getSeoMetadata, SchemaMarkup } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata() {
  return await getSeoMetadata('about', 'Giới thiệu HaloPadel')
}

async function getAboutData() {
  const venue = await prisma.venue.findFirst({ where: { id: VENUE_ID, isActive: true } })
  return { venue }
}

export default async function AboutPage() {
  const { venue } = await getAboutData()

  return (
    <>
      <SchemaMarkup pageKey="about" />
      <AboutClient venue={venue} />
    </>
  )
}
