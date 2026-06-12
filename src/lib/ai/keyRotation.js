import { prisma } from '@/lib/prisma'

// Tự động kiểm tra và reset quota mỗi ngày
export async function resetDailyQuotas(venueId) {
  const now = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)
  
  // Reset dailyUsageCount và xóa các lỗi/cooldown từ ngày hôm qua
  await prisma.aiApiKey.updateMany({
    where: {
      venueId,
      OR: [
        { lastUsedAt: { lt: startOfDay } },
        { cooldownUntil: { lt: now } }
      ]
    },
    data: {
      dailyUsageCount: 0,
      cooldownUntil: null
    }
  })
}

// Lấy danh sách các key active và không bị cooldown
export async function getActiveGroqKeys(venueId) {
  await resetDailyQuotas(venueId)
  
  const now = new Date()
  return prisma.aiApiKey.findMany({
    where: {
      venueId,
      provider: 'GROQ',
      isActive: true,
      isDeleted: false,
      OR: [
        { cooldownUntil: null },
        { cooldownUntil: { lte: now } }
      ]
    }
  })
}

// Chọn key theo chiến lược
export function selectGroqKey(keys, strategy) {
  if (!keys || keys.length === 0) return null

  switch (strategy) {
    case 'PRIORITY_FIRST':
    case 'FAILOVER_ONLY':
      // Failover và Priority giống nhau ở khâu chọn: Ưu tiên Priority cao nhất, nếu cùng Priority thì lấy cái ít lỗi nhất
      return keys.sort((a, b) => b.priority - a.priority || a.failureCount - b.failureCount)[0]

    case 'LEAST_USED':
      // Ưu tiên key có lượt dùng trong ngày ít nhất
      return keys.sort((a, b) => a.dailyUsageCount - b.dailyUsageCount)[0]

    case 'ROUND_ROBIN':
    default:
      // Sắp xếp theo lần dùng cuối cũ nhất (lastUsedAt)
      return keys.sort((a, b) => {
        if (!a.lastUsedAt) return -1
        if (!b.lastUsedAt) return 1
        return new Date(a.lastUsedAt).getTime() - new Date(b.lastUsedAt).getTime()
      })[0]
  }
}

// Đánh dấu thành công
export async function markKeySuccess(apiKeyId, tokensUsed) {
  if (!apiKeyId) return
  await prisma.aiApiKey.update({
    where: { id: apiKeyId },
    data: {
      successCount: { increment: 1 },
      dailyUsageCount: { increment: 1 },
      totalUsageCount: { increment: 1 },
      lastUsedAt: new Date(),
      cooldownUntil: null // Xóa cooldown nếu có
    }
  })
}

// Đánh dấu thất bại và đặt cooldown (5 phút)
export async function markKeyFailure(apiKeyId, errorMessage) {
  if (!apiKeyId) return
  const cooldownUntil = new Date()
  const lowerError = errorMessage.toLowerCase()
  
  // Nếu lỗi do hết Quota theo Ngày (Daily limit)
  if (lowerError.includes('per day') || lowerError.includes('quota') || lowerError.includes('exceeded your current quota')) {
    // Khóa luôn key này cho đến hết ngày hôm nay (hồi lại vào ngày mai)
    cooldownUntil.setHours(23, 59, 59, 999)
  } else {
    // Nếu chỉ là lỗi lặt vặt hoặc Rate limit theo phút -> Cooldown 5 phút
    cooldownUntil.setMinutes(cooldownUntil.getMinutes() + 5)
  }

  await prisma.aiApiKey.update({
    where: { id: apiKeyId },
    data: {
      failureCount: { increment: 1 },
      lastUsedAt: new Date(),
      lastError: errorMessage.substring(0, 500),
      cooldownUntil
    }
  })
}
