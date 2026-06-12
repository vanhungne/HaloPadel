'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const VENUE_ID = 1

const DEFAULT_PAGES = [
  { key: 'home', name: 'Trang chủ' },
  { key: 'about', name: 'Giới thiệu' },
  { key: 'gallery', name: 'Hình ảnh' },
  { key: 'promotions', name: 'Khuyến mãi' },
  { key: 'announcements', name: 'Thông báo' },
  { key: 'blog', name: 'Blog' },
  { key: 'contact', name: 'Liên hệ' },
]

export async function getSeoSettings() {
  try {
    // Fetch existing settings
    const existingSettings = await prisma.seoSetting.findMany({
      where: { venueId: VENUE_ID }
    })

    const existingKeys = existingSettings.map(s => s.pageKey)
    const missingPages = DEFAULT_PAGES.filter(p => !existingKeys.includes(p.key))

    // Seed missing pages automatically
    if (missingPages.length > 0) {
      await Promise.all(
        missingPages.map(page => 
          prisma.seoSetting.create({
            data: {
              venueId: VENUE_ID,
              pageKey: page.key,
              metaTitle: `HaloPadel - ${page.name}`,
              metaDescription: `Khám phá ${page.name.toLowerCase()} tại HaloPadel. Sân thể thao đẳng cấp.`,
            }
          })
        )
      )
    }

    // Return the updated list sorted
    const finalSettings = await prisma.seoSetting.findMany({
      where: { venueId: VENUE_ID }
    })
    
    // Map names to the settings for frontend display
    return finalSettings.map(setting => {
      const pageInfo = DEFAULT_PAGES.find(p => p.key === setting.pageKey)
      return {
        ...setting,
        pageName: pageInfo ? pageInfo.name : setting.pageKey
      }
    })
  } catch (error) {
    console.error('Failed to fetch SEO settings:', error)
    return []
  }
}

export async function updateSeoSetting(id, data) {
  try {
    const setting = await prisma.seoSetting.update({
      where: { id },
      data: {
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        ogImage: data.ogImage,
        canonicalUrl: data.canonicalUrl,
        schemaMarkup: data.schemaMarkup,
      }
    })
    revalidatePath('/admin/seo')
    revalidatePath('/') // Revalidate homepage and potentially all other pages depending on routing
    return { success: true, setting }
  } catch (error) {
    console.error('Failed to update SEO setting:', error)
    return { success: false, error: 'Lỗi khi cập nhật cấu hình SEO' }
  }
}
