'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/slugify'

const VENUE_ID = 1

export async function getPromotions({ page = 1, limit = 10 } = {}) {
  try {
    const skip = (page - 1) * limit
    
    const [data, total] = await Promise.all([
      prisma.promotion.findMany({
        where: { venueId: VENUE_ID, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.promotion.count({
        where: { venueId: VENUE_ID, isDeleted: false },
      })
    ])

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error) {
    console.error('Failed to fetch promotions:', error)
    return { data: [], total: 0, page: 1, totalPages: 0 }
  }
}

export async function createPromotion(data) {
  try {
    const slug = slugify(data.title)
    const promotion = await prisma.promotion.create({
      data: {
        venueId: VENUE_ID,
        title: data.title,
        slug: slug,
        banner: data.banner || '',
        shortDesc: data.shortDesc || '',
        content: data.content || '',
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        conditions: data.conditions || '',
        ctaText: data.ctaText || 'Nhận ưu đãi',
        ctaUrl: data.ctaUrl || '/lien-he',
        isActive: data.isActive !== undefined ? data.isActive : true,
        showOnHomepage: data.showOnHomepage !== undefined ? data.showOnHomepage : false,
        displayOrder: data.displayOrder !== undefined ? parseInt(data.displayOrder) || 0 : 0,
      }
    })
    revalidatePath('/admin/promotions')
    revalidatePath('/')
    return { success: true, promotion }
  } catch (error) {
    console.error('Failed to create promotion:', error)
    return { success: false, error: 'Lỗi khi tạo khuyến mãi (Có thể tiêu đề bị trùng)' }
  }
}

export async function updatePromotion(id, data) {
  try {
    const slug = slugify(data.title)
    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        title: data.title,
        slug: slug,
        banner: data.banner,
        shortDesc: data.shortDesc,
        content: data.content,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        conditions: data.conditions,
        ctaText: data.ctaText,
        ctaUrl: data.ctaUrl,
        isActive: data.isActive,
        showOnHomepage: data.showOnHomepage,
        displayOrder: data.displayOrder !== undefined ? parseInt(data.displayOrder) || 0 : 0,
      }
    })
    revalidatePath('/admin/promotions')
    revalidatePath('/')
    return { success: true, promotion }
  } catch (error) {
    console.error('Failed to update promotion:', error)
    return { success: false, error: 'Lỗi khi cập nhật khuyến mãi' }
  }
}

export async function deletePromotion(id) {
  try {
    await prisma.promotion.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
    })
    revalidatePath('/admin/promotions')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete promotion:', error)
    return { success: false, error: 'Lỗi khi xóa khuyến mãi' }
  }
}
