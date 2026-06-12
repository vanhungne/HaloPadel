'use server'

import { prisma } from '@/lib/prisma'
import { resetDailyQuotas } from '@/lib/ai/keyRotation'
import { VENUE_ID } from '@/lib/constants'
import { encryptApiKey, maskApiKey } from '@/lib/ai/encryption'
import { revalidatePath } from 'next/cache'

// AI SETTINGS (GENERAL)

export async function getAiSettings() {
  let settings = await prisma.aiSetting.findUnique({ where: { venueId: VENUE_ID } })
  if (!settings) {
    settings = await prisma.aiSetting.create({ data: { venueId: VENUE_ID } })
  }
  return settings
}

export async function updateAiSettings(data) {
  try {
    await prisma.aiSetting.upsert({
      where: { venueId: VENUE_ID },
      update: data,
      create: { venueId: VENUE_ID, ...data }
    })
    revalidatePath('/admin/ai-settings')
    return { success: true }
  } catch (error) {
    console.error('Update AI settings error:', error)
    return { success: false, error: 'Không thể cập nhật cấu hình AI.' }
  }
}

// API KEYS

export async function getApiKeys() {
  await resetDailyQuotas(VENUE_ID)
  return prisma.aiApiKey.findMany({
    where: { venueId: VENUE_ID, isDeleted: false },
    orderBy: { priority: 'desc' }
  })
}

export async function addApiKey({ name, apiKey, priority, isActive }) {
  try {
    const encryptedApiKey = encryptApiKey(apiKey)
    const masked = maskApiKey(apiKey)

    await prisma.aiApiKey.create({
      data: {
        venueId: VENUE_ID,
        name,
        encryptedApiKey,
        maskedApiKey: masked,
        priority: priority || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })
    revalidatePath('/admin/ai-settings')
    return { success: true }
  } catch (error) {
    console.error('Add API Key error:', error)
    return { success: false, error: 'Không thể thêm API Key.' }
  }
}

export async function updateApiKey(id, data) {
  try {
    // Không cho phép update trực tiếp raw apiKey nếu data không truyền lên (vì client chỉ nhận masked key)
    const updateData = { ...data }
    if (updateData.apiKey) {
      updateData.encryptedApiKey = encryptApiKey(updateData.apiKey)
      updateData.maskedApiKey = maskApiKey(updateData.apiKey)
      delete updateData.apiKey
    }

    await prisma.aiApiKey.update({
      where: { id },
      data: updateData
    })
    revalidatePath('/admin/ai-settings')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Không thể cập nhật API Key.' }
  }
}

export async function deleteApiKey(id) {
  try {
    await prisma.aiApiKey.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
    })
    revalidatePath('/admin/ai-settings')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Không thể xóa API Key.' }
  }
}

/**
 * Kiểm tra xem API Key có hoạt động với Groq hay không.
 * Thực hiện bằng cách gửi request list models nhẹ nhất.
 */
export async function testGroqApiKey(apiKey) {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return { success: false, error: errorData.error?.message || 'Lỗi xác thực (Status ' + res.status + ')' }
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// LOGS

export async function getAiUsageLogs(limit = 100) {
  return prisma.aiUsageLog.findMany({
    where: { venueId: VENUE_ID },
    include: {
      apiKey: { select: { name: true, maskedApiKey: true } },
      user: { select: { fullName: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  })
}
