'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const VENUE_ID = 1 // Default venue ID

export async function getVenue() {
  try {
    const venue = await prisma.venue.findUnique({
      where: { id: VENUE_ID }
    })
    
    if (!venue) {
      // Create default if not exists
      return await prisma.venue.create({
        data: {
          id: VENUE_ID,
          name: 'HaloPadel',
          slug: 'halopadel',
          isActive: true
        }
      })
    }
    return venue
  } catch (error) {
    console.error('Failed to get venue:', error)
    throw new Error('Không thể tải thông tin sân')
  }
}

export async function updateVenue(data) {
  try {
    const venue = await prisma.venue.upsert({
      where: { id: VENUE_ID },
      update: {
        name: data.name,
        shortDesc: data.shortDesc,
        hotline: data.hotline,
        zalo: data.zalo,
        email: data.email,
        address: data.address,
        googleMapsUrl: data.googleMapsUrl,
        openingHours: data.openingHours, // assuming it's a string
      },
      create: {
        id: VENUE_ID,
        slug: 'halopadel',
        name: data.name,
        shortDesc: data.shortDesc,
        hotline: data.hotline,
        zalo: data.zalo,
        email: data.email,
        address: data.address,
        googleMapsUrl: data.googleMapsUrl,
        openingHours: data.openingHours,
      }
    })

    revalidatePath('/admin/venue')
    revalidatePath('/') // Revalidate public homepage
    return { success: true, venue }
  } catch (error) {
    console.error('Failed to update venue:', error)
    return { success: false, error: 'Không thể cập nhật thông tin sân' }
  }
}
