import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params
  const promo = await prisma.promotion.findFirst({
    where: { venueId: VENUE_ID, slug, isActive: true, isDeleted: false },
  })
  if (!promo) return { title: 'Không tìm thấy' }
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
  const promo = await getPromotion(slug)
  if (!promo) notFound()

  return (
    <div className="py-8 md:py-12">
      <div className="section-container">
        <article className="max-w-4xl mx-auto">
          {/* Banner */}
          {promo.banner && (
            <div className="relative h-60 md:h-80 rounded-2xl overflow-hidden shadow-card mb-8">
              <Image src={promo.banner} alt={promo.title} fill className="object-cover" sizes="100vw" priority />
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-text-main mb-4">
              {promo.title}
            </h1>
            {promo.startDate && promo.endDate && (
              <div className="flex items-center gap-2 text-sm text-text-light">
                <span>📅</span>
                <span>{formatDate(promo.startDate)} - {formatDate(promo.endDate)}</span>
              </div>
            )}
          </div>

          {/* Content */}
          {promo.content && (
            <div className="rich-content bg-card-white rounded-2xl p-6 md:p-8 shadow-card border border-border-light mb-8"
              dangerouslySetInnerHTML={{ __html: promo.content }}
            />
          )}

          {/* Conditions */}
          {promo.conditions && (
            <div className="bg-primary-50 rounded-2xl p-6 border border-primary-200 mb-8">
              <h3 className="font-heading font-bold text-lg text-text-main mb-2">📋 Điều kiện áp dụng</h3>
              <p className="text-sm text-text-sub">{promo.conditions}</p>
            </div>
          )}

          {/* CTA */}
          {promo.ctaText && promo.ctaUrl && (
            <div className="text-center">
              <a
                href={promo.ctaUrl}
                target={promo.ctaUrl.startsWith('http') ? '_blank' : undefined}
                rel={promo.ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                {promo.ctaText}
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
