'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const VENUE_ID = 1

export async function getMediaFiles({ page = 1, limit = 10 } = {}) {
  try {
    const skip = (page - 1) * limit
    
    const [data, total] = await Promise.all([
      prisma.mediaFile.findMany({
        where: { venueId: VENUE_ID, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.mediaFile.count({
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
    console.error('Failed to fetch media:', error)
    return { data: [], total: 0, page: 1, totalPages: 0 }
  }
}

export async function createMediaFile(data) {
  try {
    const media = await prisma.mediaFile.create({
      data: {
        venueId: VENUE_ID,
        url: data.url, // In a real app, this comes from a cloud upload (e.g. Cloudinary/S3)
        category: data.category || 'GALLERY',
        altText: data.altText || '',
        caption: data.caption || '',
        isActive: data.isActive !== undefined ? data.isActive : true,
        showOnHomepage: data.showOnHomepage !== undefined ? data.showOnHomepage : false,
      }
    })
    revalidatePath('/admin/media')
    revalidatePath('/')
    return { success: true, media }
  } catch (error) {
    console.error('Failed to create media:', error)
    return { success: false, error: 'Lỗi khi thêm hình ảnh' }
  }
}

export async function updateMediaFile(id, data) {
  try {
    const media = await prisma.mediaFile.update({
      where: { id },
      data: {
        url: data.url,
        category: data.category,
        altText: data.altText,
        caption: data.caption,
        isActive: data.isActive,
        showOnHomepage: data.showOnHomepage,
      }
    })
    revalidatePath('/admin/media')
    revalidatePath('/')
    return { success: true, media }
  } catch (error) {
    console.error('Failed to update media:', error)
    return { success: false, error: 'Lỗi khi cập nhật hình ảnh' }
  }
}

export async function deleteMediaFile(id) {
  try {
    await prisma.mediaFile.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
    })
    revalidatePath('/admin/media')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete media:', error)
    return { success: false, error: 'Lỗi khi xóa hình ảnh' }
  }
}
