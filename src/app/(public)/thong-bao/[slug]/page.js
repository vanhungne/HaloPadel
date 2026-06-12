import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params
  const ann = await prisma.announcement.findFirst({
    where: { venueId: VENUE_ID, slug, isActive: true, isDeleted: false },
  })
  if (!ann) return { title: 'Không tìm thấy' }
  return { title: ann.title, description: ann.title }
}

export default async function AnnouncementDetailPage({ params }) {
  const { slug } = await params
  const ann = await prisma.announcement.findFirst({
    where: { venueId: VENUE_ID, slug, isActive: true, isDeleted: false },
  })
  if (!ann) notFound()

  return (
    <div className="py-8 md:py-12">
      <div className="section-container">
        <article className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-text-main mb-3">{ann.title}</h1>
            <div className="flex items-center gap-3 text-sm text-text-light">
              <span>📅 {formatDate(ann.createdAt, 'dd/MM/yyyy HH:mm')}</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{ann.type}</span>
            </div>
          </div>
          {ann.content && (
            <div className="rich-content bg-card-white rounded-2xl p-6 md:p-8 shadow-card border border-border-light"
              dangerouslySetInnerHTML={{ __html: ann.content }}
            />
          )}
        </article>
      </div>
    </div>
  )
}
