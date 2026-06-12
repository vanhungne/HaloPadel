import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import { getServerT } from '@/lib/i18n/server'
import { localize } from '@/lib/i18n/localize'

const getTypeStyle = (type, t) => {
  switch (type) {
    case 'INFO': return { bg: 'bg-blue-100', text: 'text-blue-700', label: t.announcements.typeInfo, icon: 'ℹ️' }
    case 'EVENT': return { bg: 'bg-purple-100', text: 'text-purple-700', label: t.announcements.typeEvent, icon: '🏆' }
    case 'PROMO': return { bg: 'bg-green-100', text: 'text-green-700', label: t.announcements.typePromo, icon: '🎁' }
    case 'RULE': return { bg: 'bg-red-100', text: 'text-red-700', label: t.announcements.typeDefault, icon: '⚠️' }
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: t.announcements.typeDefault, icon: '📌' }
  }
}

export default async function AnnouncementDetailPage({ params }) {
  const { slug } = await params
  const { t, locale } = await getServerT()

  if (!slug) notFound()

  const post = await prisma.announcement.findUnique({
    where: { 
      venueId_slug: { venueId: VENUE_ID, slug }
    }
  })

  if (!post || !post.isActive || post.isDeleted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FFFDF6]">
        <h1 className="text-4xl font-bold text-[#111111] mb-4">404</h1>
        <p className="text-[#555555] mb-8">{locale === 'en' ? 'The announcement you are looking for does not exist or has been removed.' : 'Thông báo bạn đang tìm không tồn tại hoặc đã bị gỡ.'}</p>
        <Link href="/thong-bao" className="px-6 py-3 bg-[#111111] text-white rounded-full font-bold">
          {locale === 'en' ? 'Back to News' : 'Quay lại Bảng tin'}
        </Link>
      </div>
    )
  }

  const typeStyle = getTypeStyle(post.type, t)

  return (
    <div className="py-12 md:py-24 bg-[#FFFDF6] min-h-screen">
      <div className="w-full px-4 md:px-8 max-w-[800px] mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-semibold mb-10 text-[#888888]">
          <Link href="/thong-bao" className="hover:text-[#D45A2A] transition-colors">{t.nav.announcements}</Link>
          <span>/</span>
          <span className="text-[#111111]">{typeStyle.label}</span>
        </div>

        {/* Paper Card */}
        <div className="bg-white rounded-[32px] p-8 md:p-14 shadow-sm border border-[#E8E2D2]">
          
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider ${typeStyle.bg} ${typeStyle.text} flex items-center gap-2`}>
              <span>{typeStyle.icon}</span>
              {typeStyle.label}
            </span>
            {post.isPinned && (
              <span className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                {t.common.important}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl md:text-[40px] font-bold text-[#111111] leading-tight mb-8">
            {localize(post, 'title', locale)}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pb-8 border-b border-[#E8E2D2] mb-10">
            <div className="flex items-center gap-2 text-[14px] text-[#555555]">
              <svg className="w-4 h-4 text-[#888888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t.common.postedOn} <strong>{formatDate(post.createdAt)}</strong></span>
            </div>
            
            {post.effectiveDate && (
              <div className="flex items-center gap-2 text-[14px] text-[#111111] bg-[#F8F5E4] px-4 py-2 rounded-lg font-medium">
                <svg className="w-4 h-4 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{t.common.validFrom} <strong className="text-[#D45A2A]">{formatDate(post.effectiveDate)}</strong></span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-[#111111] prose-p:text-[#555555] prose-p:leading-[1.8] prose-li:text-[#555555] prose-strong:text-[#111111]">
            <div dangerouslySetInnerHTML={{ __html: locale === 'en' ? (post.contentEn || post.content) : post.content }} />
          </div>

          {/* Footer Signature */}
          <div className="mt-16 pt-8 border-t border-[#E8E2D2] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="font-heading font-bold text-lg text-[#111111]">{locale === 'en' ? 'HaloPadel Management' : 'Ban Quản Lý HaloPadel'}</p>
              <p className="text-[14px] text-[#888888]">{locale === 'en' ? 'Thank you for your attention!' : 'Trân trọng thông báo!'}</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-[#E8E2D2] flex items-center justify-center text-[#555555] hover:bg-[#D45A2A] hover:text-white hover:border-[#D45A2A] transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-10 text-center">
          <Link href="/thong-bao" className="inline-flex items-center gap-2 text-[#555555] font-bold hover:text-[#D45A2A] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.common.viewAllAnnouncements}
          </Link>
        </div>

      </div>
    </div>
  )
}
