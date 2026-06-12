'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const VENUE_ID = 1

export async function createContact(data) {
  try {
    const contact = await prisma.contact.create({
      data: {
        venueId: VENUE_ID,
        fullName: data.fullName,
        phone: data.phone,
        message: data.message,
        sourcePage: 'Landing Page',
        status: 'NEW'
      }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to create contact:', error)
    return { success: false, error: 'Lỗi gửi yêu cầu' }
  }
}

export async function getContacts() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return contacts.map(c => ({
      id: c.id,
      name: c.fullName,
      phone: c.phone || 'N/A',
      email: c.email || 'N/A',
      note: c.message || '',
      time: c.createdAt.toISOString(),
      status: c.status
    }))
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
    return []
  }
}

export async function updateContactStatus(id, status) {
  try {
    await prisma.contact.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/admin/contacts')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to update contact status:', error)
    return { success: false, error: 'Lỗi khi cập nhật trạng thái' }
  }
}
