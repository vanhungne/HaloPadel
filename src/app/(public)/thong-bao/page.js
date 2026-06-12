import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import Link from 'next/link'
import { formatRelativeTime, getStatusColor } from '@/lib/utils'

export const revalidate = 60

const typeIcons = { INFO: 'ℹ️', PROMOTION: '🎁', EVENT: '🏆', MAINTENANCE: '🔧', WARNING: '⚠️' }

export async function generateMetadata() {
  const seo = await prisma.seoSetting.findUnique({
    where: { venueId_pageKey: { venueId: VENUE_ID, pageKey: 'announcements' } },
  })
  return {
    title: seo?.metaTitle || 'Thông báo',
    description: seo?.metaDescription || 'Thông báo từ HaloPadel',
  }
}

async function getAnnouncements() {
  return prisma.announcement.findMany({
    where: { venueId: VENUE_ID, isActive: true, isDeleted: false },
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
  })
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements()

  return (
    <div className="py-8 md:py-12">
      <div className="section-container mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text-main mb-4">
            Thông báo
          </h1>
          <p className="text-lg text-text-sub">Cập nhật tin tức và thông báo mới nhất</p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>
      </div>

      <div className="section-container">
        {announcements.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {announcements.map((ann) => (
              <Link
                key={ann.id}
                href={`/thong-bao/${ann.slug}`}
                className="block bg-card-white rounded-xl p-5 md:p-6 border border-border-light hover:border-primary/30 hover:shadow-card transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl shrink-0">{typeIcons[ann.type] || 'ℹ️'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {ann.isPinned && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">📌 Ghim</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(ann.type)}`}>{ann.type}</span>
                    </div>
                    <h2 className="font-semibold text-lg text-text-main group-hover:text-primary transition-colors mb-1">{ann.title}</h2>
                    <p className="text-sm text-text-light">{formatRelativeTime(ann.createdAt)}</p>
                  </div>
                  <svg className="w-5 h-5 text-text-light group-hover:text-primary shrink-0 mt-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">📢</span>
            <p className="text-text-light text-lg">Chưa có thông báo nào</p>
          </div>
        )}
      </div>
    </div>
  )
}
