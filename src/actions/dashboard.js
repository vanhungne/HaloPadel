'use server'

import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const [
      newContactsCount,
      todayContactsCount,
      activePromotionsCount,
      blogPostsCount,
      recentContacts
    ] = await Promise.all([
      // Contacts waiting to be resolved
      prisma.contact.count({
        where: { status: 'NEW' }
      }),
      // Contacts created today
      prisma.contact.count({
        where: { createdAt: { gte: today } }
      }),
      // Active promotions
      prisma.promotion.count({
        where: { isActive: true }
      }),
      // Published blog posts
      prisma.blogPost.count({
        where: { status: 'PUBLISHED', isDeleted: false }
      }),
      // Recent contacts (top 5)
      prisma.contact.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          phone: true,
          createdAt: true,
          status: true
        }
      })
    ])

    return {
      newContactsCount,
      todayContactsCount,
      activePromotionsCount,
      blogPostsCount,
      recentContacts: recentContacts.map(c => ({
        id: c.id,
        name: c.fullName,
        phone: c.phone || 'N/A',
        time: c.createdAt.toISOString(),
        status: c.status
      }))
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return {
      newContactsCount: 0,
      todayContactsCount: 0,
      activePromotionsCount: 0,
      blogPostsCount: 0,
      recentContacts: []
    }
  }
}
