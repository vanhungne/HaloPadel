import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { getServerT } from '@/lib/i18n/server'
import { localize } from '@/lib/i18n/localize'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params
  const promo = await prisma.promotion.findFirst({
    where: { venueId: VENUE_ID, slug, isActive: true, isDeleted: false },
  })
  if (!promo) return { title: 'Not Found' }
  return {
    title: promo.seoTitle || promo.title,
    description: promo.seoDescription || promo.shortDesc,
  }
}

async function getPromotion(slug) {
  return prisma.promotion.findFirst({
    where: { venueId: VENUE_ID, slug, isActive: true, isDeleted: false },
  })
}

export default async function PromotionDetailPage({ params }) {
  const { slug } = await params
  const { t, locale } = await getServerT()
  const promo = await getPromotion(slug)
  if (!promo) notFound()

  const title = localize(promo, 'title', locale)
  const shortDesc = localize(promo, 'shortDesc', locale)
  const content = locale === 'en' ? (promo.contentEn || promo.content) : promo.content
  const conditions = localize(promo, 'conditions', locale)

  return (
    <div className="py-12 md:py-24 bg-[#FFFDF6] min-h-screen">
      <div className="w-full px-4 md:px-8 max-w-[900px] mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-semibold mb-10 text-[#888888]">
          <Link href="/khuyen-mai" className="hover:text-[#D45A2A] transition-colors">{t.nav.promotions}</Link>
          <span>/</span>
          <span className="text-[#111111] line-clamp-1">{title}</span>
        </div>

        <article className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#E8E2D2]">
          {/* Banner */}
          {promo.banner && (
            <div className="relative h-[300px] md:h-[400px] overflow-hidden">
              <Image src={promo.banner} alt={title} fill className="object-cover" sizes="100vw" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )}

          <div className="p-8 md:p-14">
            {/* Header */}
            <div className="mb-10">
              {promo.startDate && promo.endDate && (
                <div className="inline-flex items-center gap-2 bg-[#F8F5E4] text-[#555555] px-4 py-2 rounded-lg text-[14px] font-semibold mb-6">
                  <svg className="w-4 h-4 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(promo.startDate)} – {formatDate(promo.endDate)}
                </div>
              )}
              
              <h1 className="font-heading text-3xl md:text-[40px] font-bold text-[#111111] leading-tight mb-4">
                {title}
              </h1>

              {shortDesc && (
                <p className="text-[#555555] text-lg leading-relaxed">
                  {shortDesc}
                </p>
              )}
            </div>

            {/* Content */}
            {content && (
              <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-[#111111] prose-p:text-[#555555] prose-p:leading-[1.8] prose-li:text-[#555555] prose-strong:text-[#111111] mb-10">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            )}

            {/* Conditions */}
            {conditions && (
              <div className="bg-[#FFF9EE] rounded-2xl p-6 md:p-8 border border-[#E8E2D2] mb-10">
                <h3 className="font-heading font-bold text-lg text-[#111111] mb-3 flex items-center gap-2">
                  <span>📋</span> {locale === 'en' ? 'Terms & Conditions' : 'Điều kiện áp dụng'}
                </h3>
                <p className="text-[#555555] text-[15px] leading-relaxed">{conditions}</p>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[#E8E2D2]">
              {promo.ctaText && promo.ctaUrl ? (
                <a
                  href={promo.ctaUrl}
                  target={promo.ctaUrl.startsWith('http') ? '_blank' : undefined}
                  rel={promo.ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex-1 text-center bg-[#D45A2A] hover:bg-[#B8431D] text-white px-8 py-4 rounded-[16px] font-bold text-[16px] transition-all shadow-[0_12px_30px_rgba(212,90,42,0.25)]"
                >
                  {promo.ctaText}
                </a>
              ) : (
                <a
                  href="tel:0909123456"
                  className="flex-1 text-center bg-[#D45A2A] hover:bg-[#B8431D] text-white px-8 py-4 rounded-[16px] font-bold text-[16px] transition-all shadow-[0_12px_30px_rgba(212,90,42,0.25)]"
                >
                  {t.common.getOfferNow}
                </a>
              )}
              <Link
                href="/khuyen-mai"
                className="flex-1 text-center border-2 border-[#111111] hover:border-[#D45A2A] hover:bg-[#D45A2A]/5 text-[#111111] hover:text-[#D45A2A] px-8 py-4 rounded-[16px] font-bold text-[16px] transition-colors"
              >
                {locale === 'en' ? 'View All Promotions' : 'Xem tất cả khuyến mãi'}
              </Link>
            </div>
          </div>
        </article>

        {/* Back Link */}
        <div className="mt-10 text-center">
          <Link href="/khuyen-mai" className="inline-flex items-center gap-2 text-[#555555] font-bold hover:text-[#D45A2A] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {locale === 'en' ? 'Back to Promotions' : 'Quay lại khuyến mãi'}
          </Link>
        </div>

      </div>
    </div>
  )
}
