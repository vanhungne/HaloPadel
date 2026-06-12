'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/slugify'

const VENUE_ID = 1

export async function getAnnouncements({ page = 1, limit = 10 } = {}) {
  try {
    const skip = (page - 1) * limit
    
    const [data, total] = await Promise.all([
      prisma.announcement.findMany({
        where: { venueId: VENUE_ID, isDeleted: false },
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      prisma.announcement.count({
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
    console.error('Failed to fetch announcements:', error)
    return { data: [], total: 0, page: 1, totalPages: 0 }
  }
}

export async function createAnnouncement(data) {
  try {
    const slug = slugify(data.title)
    const announcement = await prisma.announcement.create({
      data: {
        venueId: VENUE_ID,
        title: data.title,
        slug: slug,
        content: data.content || '',
        type: data.type || 'INFO',
        image: data.image || '',
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        showOnHomepage: data.showOnHomepage !== undefined ? data.showOnHomepage : false,
        isPinned: data.isPinned !== undefined ? data.isPinned : false,
        titleEn: data.titleEn || null,
        contentEn: data.contentEn || null,
      }
    })
    revalidatePath('/admin/announcements')
    revalidatePath('/')
    return { success: true, announcement }
  } catch (error) {
    console.error('Failed to create announcement:', error)
    return { success: false, error: 'Lỗi khi tạo thông báo (Có thể tiêu đề bị trùng)' }
  }
}

export async function updateAnnouncement(id, data) {
  try {
    const slug = slugify(data.title)
    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: data.title,
        slug: slug,
        content: data.content,
        type: data.type,
        image: data.image,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isActive: data.isActive,
        showOnHomepage: data.showOnHomepage,
        isPinned: data.isPinned,
        titleEn: data.titleEn || null,
        contentEn: data.contentEn || null,
      }
    })
    revalidatePath('/admin/announcements')
    revalidatePath('/')
    return { success: true, announcement }
  } catch (error) {
    console.error('Failed to update announcement:', error)
    return { success: false, error: 'Lỗi khi cập nhật thông báo' }
  }
}

export async function deleteAnnouncement(id) {
  try {
    await prisma.announcement.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
    })
    revalidatePath('/admin/announcements')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete announcement:', error)
    return { success: false, error: 'Lỗi khi xóa thông báo' }
  }
}
