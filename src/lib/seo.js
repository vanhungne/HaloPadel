import { prisma } from '@/lib/prisma'

const VENUE_ID = 1

export async function getSeoMetadata(pageKey, defaultTitle) {
  try {
    const setting = await prisma.seoSetting.findUnique({
      where: {
        venueId_pageKey: { venueId: VENUE_ID, pageKey }
      }
    })

    if (!setting) {
      return { title: defaultTitle }
    }

    const metadata = {
      title: setting.metaTitle || defaultTitle,
      description: setting.metaDescription || undefined,
    }

    if (setting.canonicalUrl) {
      metadata.alternates = { canonical: setting.canonicalUrl }
    }

    if (setting.ogImage) {
      metadata.openGraph = {
        title: setting.metaTitle || defaultTitle,
        description: setting.metaDescription || undefined,
        images: [setting.ogImage],
      }
    }

    return metadata
  } catch (error) {
    console.error(`Failed to get SEO metadata for ${pageKey}:`, error)
    return { title: defaultTitle }
  }
}

export async function SchemaMarkup({ pageKey }) {
  try {
    const setting = await prisma.seoSetting.findUnique({
      where: {
        venueId_pageKey: { venueId: VENUE_ID, pageKey }
      }
    })

    if (!setting?.schemaMarkup) return null

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: setting.schemaMarkup }}
      />
    )
  } catch (error) {
    return null
  }
}
