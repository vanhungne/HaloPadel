import AnnouncementsClient from '@/components/public/AnnouncementsClient'
import { getSeoMetadata, SchemaMarkup } from '@/lib/seo'
import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'

export const revalidate = 60

export async function generateMetadata() {
  return await getSeoMetadata('announcements', 'Thông báo HaloPadel')
}

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    where: { venueId: VENUE_ID, isActive: true, isDeleted: false },
    orderBy: [{ isPinned: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <>
      <SchemaMarkup pageKey="announcements" />
      <AnnouncementsClient announcements={announcements} />
    </>
  )
}
