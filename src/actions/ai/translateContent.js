'use server'

import { callGroqWithRotation } from '@/lib/ai/groq'
import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'

/**
 * Translate Vietnamese content fields to English using Groq AI
 * 
 * @param {Object} fields - Key-value pairs of Vietnamese content to translate
 *   e.g. { name: "Giờ sáng", description: "Áp dụng tất cả các ngày", notes: "Thứ 2 - Thứ 6" }
 * @returns {Object} - Same keys with English translations
 *   e.g. { name: "Morning", description: "Available every day", notes: "Monday - Friday" }
 */
export async function translateToEnglish(fields) {
  // 1. Auth (hardcoded for now, same as blog generation)
  const userId = 1
  const userRole = 'ADMIN'

  // 2. Rate limit check
  const ROLE_LIMITS = { OWNER: 50, ADMIN: 50, EDITOR: 20, STAFF: 0 }
  const limit = ROLE_LIMITS[userRole] || 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const usageCount = await prisma.aiUsageLog.count({
    where: {
      userId,
      createdAt: { gte: today },
      feature: 'TRANSLATION',
      status: 'SUCCESS'
    }
  })

  if (usageCount >= limit) {
    return { success: false, error: `Đã đạt giới hạn dịch AI hôm nay (${limit} lần). Thử lại ngày mai.` }
  }

  // 3. Filter out empty fields
  const fieldsToTranslate = {}
  for (const [key, value] of Object.entries(fields)) {
    if (value && typeof value === 'string' && value.trim()) {
      fieldsToTranslate[key] = value.trim()
    }
  }

  if (Object.keys(fieldsToTranslate).length === 0) {
    return { success: false, error: 'Không có nội dung để dịch.' }
  }

  // 4. Check if content contains HTML (blog content)
  const hasHtml = Object.values(fieldsToTranslate).some(v => /<[^>]+>/.test(v))

  // 5. Build prompt
  const systemPrompt = `You are a professional Vietnamese-to-English translator for HaloPadel Sports Club website.

Rules:
- Translate ONLY the Vietnamese text content to natural, fluent English
- Keep proper nouns unchanged: HaloPadel, Padel, Zalo, Da Nang
- Keep numbers, prices, time formats unchanged (e.g. "200.000đ/giờ" stays as "200,000đ/hour", "06:00 - 22:00" stays the same)
- Keep the same tone: professional, friendly, sports-oriented
${hasHtml ? '- For HTML content: translate ONLY the text inside HTML tags. Keep ALL HTML tags, CSS classes, and attributes EXACTLY as they are. Do NOT modify any HTML structure or Tailwind CSS classes.' : ''}
- Return ONLY valid JSON with the exact same keys as input
- Do NOT add any explanation outside the JSON

Input fields to translate:`

  // 6. Call Groq
  let groqResponse
  try {
    groqResponse = await callGroqWithRotation({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(fieldsToTranslate) }
      ],
      maxTokens: hasHtml ? 8000 : 2000,
      temperature: 0.3, // Lower temperature for more accurate translations
    }, VENUE_ID)
  } catch (error) {
    await prisma.aiUsageLog.create({
      data: {
        venueId: VENUE_ID,
        userId,
        feature: 'TRANSLATION',
        inputPrompt: JSON.stringify(fieldsToTranslate).substring(0, 500),
        status: 'FAILED',
        errorMessage: error.message,
        model: 'unknown'
      }
    })
    return { success: false, error: 'Lỗi khi gọi AI: ' + error.message }
  }

  // 7. Parse response
  let translated
  try {
    const rawContent = groqResponse.data.choices[0].message.content
    const cleanedJson = rawContent.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    translated = JSON.parse(cleanedJson)
  } catch (err) {
    await prisma.aiUsageLog.create({
      data: {
        venueId: VENUE_ID,
        userId,
        apiKeyId: groqResponse.apiKeyId,
        feature: 'TRANSLATION',
        inputPrompt: JSON.stringify(fieldsToTranslate).substring(0, 500),
        status: 'FAILED',
        errorMessage: 'Lỗi parse JSON: ' + err.message,
        model: groqResponse.data.model || 'unknown',
        durationMs: groqResponse.durationMs,
        tokensUsed: groqResponse.tokensUsed
      }
    })
    return { success: false, error: 'AI trả về định dạng không hợp lệ. Vui lòng thử lại.' }
  }

  // 8. Log success
  await prisma.aiUsageLog.create({
    data: {
      venueId: VENUE_ID,
      userId,
      apiKeyId: groqResponse.apiKeyId,
      feature: 'TRANSLATION',
      inputPrompt: JSON.stringify(fieldsToTranslate).substring(0, 500),
      outputSummary: `Dịch thành công ${Object.keys(translated).length} trường`,
      status: 'SUCCESS',
      model: groqResponse.data.model || 'unknown',
      durationMs: groqResponse.durationMs,
      tokensUsed: groqResponse.tokensUsed
    }
  })

  return { success: true, data: translated }
}
