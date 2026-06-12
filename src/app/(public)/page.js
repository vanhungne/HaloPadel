import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import HeroSection from '@/components/public/HeroSection'
import QuickInfo from '@/components/public/QuickInfo'
import FeaturedGallery from '@/components/public/FeaturedGallery'
import AmenitiesSection from '@/components/public/AmenitiesSection'
import PricingSection from '@/components/public/PricingSection'
import PromotionsSection from '@/components/public/PromotionsSection'
import AnnouncementsSection from '@/components/public/AnnouncementsSection'
import BlogSection from '@/components/public/BlogSection'
import GoogleMap from '@/components/public/GoogleMap'

import { getSeoMetadata, SchemaMarkup } from '@/lib/seo'

export const revalidate = 60 // ISR: revalidate every 60 seconds

export async function generateMetadata() {
  return await getSeoMetadata('home', 'HaloPadel - Sân Padel chuyên nghiệp')
}

async function getLandingData() {
  const now = new Date()

  const [venue, sections, heroImage, galleryImages, amenities, pricingPlans, promotions, announcements, blogPosts] = await Promise.all([
    // Venue info
    prisma.venue.findFirst({ where: { id: VENUE_ID, isActive: true } }),

    // Landing sections config
    prisma.landingSection.findMany({
      where: { venueId: VENUE_ID, isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),

    // Hero image
    prisma.mediaFile.findFirst({
      where: { venueId: VENUE_ID, category: 'HERO', isActive: true, isDeleted: false },
      orderBy: { displayOrder: 'asc' },
    }),

    // Gallery images for homepage
    prisma.mediaFile.findMany({
      where: { venueId: VENUE_ID, showOnHomepage: true, isActive: true, isDeleted: false },
      orderBy: { displayOrder: 'asc' },
      take: 8,
    }),

    // Amenities
    prisma.amenity.findMany({
      where: { venueId: VENUE_ID, isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),

    // Pricing plans
    prisma.pricingPlan.findMany({
      where: { venueId: VENUE_ID, isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),

    // Active promotions for homepage
    prisma.promotion.findMany({
      where: {
        venueId: VENUE_ID,
        isActive: true,
        showOnHomepage: true,
        isDeleted: false,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { displayOrder: 'asc' },
      take: 4,
    }),

    // Announcements for homepage
    prisma.announcement.findMany({
      where: {
        venueId: VENUE_ID,
        isActive: true,
        showOnHomepage: true,
        isDeleted: false,
      },
      orderBy: [{ isPinned: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: 5,
    }),

    // Published blog posts for homepage
    prisma.blogPost.findMany({
      where: {
        venueId: VENUE_ID,
        status: 'PUBLISHED',
        showOnHomepage: true,
        isDeleted: false,
      },
      include: { category: true },
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
      take: 4,
    }),
  ])

  // Build sections map
  const sectionsMap = {}
  sections.forEach((s) => {
    sectionsMap[s.sectionKey] = s
  })

  return { venue, sectionsMap, heroImage, galleryImages, amenities, pricingPlans, promotions, announcements, blogPosts }
}

export default async function HomePage() {
  const { venue, sectionsMap, heroImage, galleryImages, amenities, pricingPlans, promotions, announcements, blogPosts } = await getLandingData()

  // Render sections in order based on landing sections config
  const sectionOrder = Object.keys(sectionsMap).length > 0
    ? Object.values(sectionsMap).sort((a, b) => a.displayOrder - b.displayOrder).map(s => s.sectionKey)
    : ['hero', 'quickinfo', 'gallery', 'amenities', 'pricing', 'promotions', 'announcements', 'blog', 'map']

  const sectionComponents = {
    hero: <HeroSection key="hero" venue={venue} heroImage={heroImage} />,
    quickinfo: <QuickInfo key="quickinfo" venue={venue} />,
    gallery: <FeaturedGallery key="gallery" images={galleryImages} section={sectionsMap.gallery} />,
    amenities: <AmenitiesSection key="amenities" amenities={amenities} section={sectionsMap.amenities} />,
    pricing: <PricingSection key="pricing" plans={pricingPlans} section={sectionsMap.pricing} />,
    promotions: <PromotionsSection key="promotions" promotions={promotions} section={sectionsMap.promotions} />,
    announcements: <AnnouncementsSection key="announcements" announcements={announcements} section={sectionsMap.announcements} />,
    blog: <BlogSection key="blog" posts={blogPosts} section={sectionsMap.blog} />,
    map: <GoogleMap key="map" venue={venue} section={sectionsMap.map} />,
  }

  return (

    <>
      <SchemaMarkup pageKey="home" />
      <div style={{ marginTop: '-76px' }}>
        {sectionOrder.map((key) => sectionComponents[key] || null)}
      </div>
    </>
  )
}
