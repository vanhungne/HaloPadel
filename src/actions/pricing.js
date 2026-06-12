'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const VENUE_ID = 1

export async function getPricingPlans({ page = 1, limit = 10 } = {}) {
  try {
    const skip = (page - 1) * limit
    
    const [plans, total] = await Promise.all([
      prisma.pricingPlan.findMany({
        where: { venueId: VENUE_ID },
        orderBy: { displayOrder: 'asc' },
        skip,
        take: limit,
      }),
      prisma.pricingPlan.count({
        where: { venueId: VENUE_ID }
      })
    ])
    
    return {
      data: plans,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error) {
    console.error('Failed to fetch pricing plans:', error)
    return { data: [], total: 0, page: 1, totalPages: 1 }
  }
}

export async function createPricingPlan(data) {
  try {
    const plan = await prisma.pricingPlan.create({
      data: {
        venueId: VENUE_ID,
        name: data.name,
        price: data.price,
        timeSlot: data.timeSlot,
        description: data.description || '',
        notes: data.notes || '',
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
    })
    revalidatePath('/admin/pricing')
    revalidatePath('/')
    return { success: true, plan }
  } catch (error) {
    console.error('Failed to create pricing plan:', error)
    return { success: false, error: 'Lỗi khi thêm bảng giá' }
  }
}

export async function updatePricingPlan(id, data) {
  try {
    const plan = await prisma.pricingPlan.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        timeSlot: data.timeSlot,
        description: data.description,
        notes: data.notes,
        isActive: data.isActive,
      }
    })
    revalidatePath('/admin/pricing')
    revalidatePath('/')
    return { success: true, plan }
  } catch (error) {
    console.error('Failed to update pricing plan:', error)
    return { success: false, error: 'Lỗi khi cập nhật bảng giá' }
  }
}

export async function deletePricingPlan(id) {
  try {
    await prisma.pricingPlan.delete({
      where: { id }
    })
    revalidatePath('/admin/pricing')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete pricing plan:', error)
    return { success: false, error: 'Lỗi khi xóa bảng giá' }
  }
}
