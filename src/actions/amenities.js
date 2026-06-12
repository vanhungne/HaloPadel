'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const VENUE_ID = 1 // Default venue

export async function getAmenities({ page = 1, limit = 10 } = {}) {
  try {
    const skip = (page - 1) * limit
    
    const [amenities, total] = await Promise.all([
      prisma.amenity.findMany({
        where: { venueId: VENUE_ID },
        orderBy: { displayOrder: 'asc' },
        skip,
        take: limit,
      }),
      prisma.amenity.count({
        where: { venueId: VENUE_ID }
      })
    ])
    
    return {
      data: amenities,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error) {
    console.error('Failed to fetch amenities:', error)
    return { data: [], total: 0, page: 1, totalPages: 1 }
  }
}

export async function createAmenity(data) {
  try {
    const amenity = await prisma.amenity.create({
      data: {
        venueId: VENUE_ID,
        name: data.name,
        description: data.description || '',
        icon: data.icon || 'star', // default icon
        image: data.image || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
    })
    revalidatePath('/admin/amenities')
    revalidatePath('/')
    return { success: true, amenity }
  } catch (error) {
    console.error('Failed to create amenity:', error)
    return { success: false, error: 'Lỗi khi thêm tiện ích' }
  }
}

export async function updateAmenity(id, data) {
  try {
    const amenity = await prisma.amenity.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        image: data.image,
        isActive: data.isActive,
      }
    })
    revalidatePath('/admin/amenities')
    revalidatePath('/')
    return { success: true, amenity }
  } catch (error) {
    console.error('Failed to update amenity:', error)
    return { success: false, error: 'Lỗi khi cập nhật tiện ích' }
  }
}

export async function deleteAmenity(id) {
  try {
    await prisma.amenity.delete({
      where: { id }
    })
    revalidatePath('/admin/amenities')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete amenity:', error)
    return { success: false, error: 'Lỗi khi xóa tiện ích' }
  }
}
