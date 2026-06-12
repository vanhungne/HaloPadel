import { getActiveGroqKeys, selectGroqKey, markKeySuccess, markKeyFailure } from './keyRotation'
import { decryptApiKey } from './encryption'
import { prisma } from '@/lib/prisma'

/**
 * Gọi Groq API với một key cụ thể
 */
async function fetchGroqAPI(apiKey, model, messages, temperature = 0.7, maxTokens = 4000) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' } // Ép Groq trả JSON
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData?.error?.message || `Groq API Error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data
}

/**
 * Hàm chính để gọi Groq có áp dụng Rotation Key
 */
export async function callGroqWithRotation({ messages, model, temperature, maxTokens }, venueId) {
  // 1. Lấy AI Settings
  const settings = await prisma.aiSetting.findUnique({ where: { venueId } })
  if (!settings?.isEnabled) {
    throw new Error('Tính năng AI hiện đang bị vô hiệu hóa bởi Admin.')
  }

  const finalModel = model || settings.defaultModel
  const finalTemp = temperature || settings.temperature
  const finalTokens = maxTokens || settings.maxTokens
  const strategy = settings.rotationStrategy

  // 2. Lấy danh sách keys
  let keys = await getActiveGroqKeys(venueId)
  let fallbackEnvKey = process.env.GROQ_API_KEY
  
  if (keys.length === 0 && !fallbackEnvKey) {
    throw new Error('Chưa cấu hình Groq API key trong AI Settings hoặc .env.')
  }

  let attempt = 0
  const maxAttempts = Math.max(keys.length, 1) // Thử ít nhất 1 lần (nếu dùng fallback)

  while (attempt < maxAttempts) {
    attempt++
    
    // 3. Chọn key
    const selectedKeyRecord = selectGroqKey(keys, strategy)
    const apiKey = selectedKeyRecord ? decryptApiKey(selectedKeyRecord.encryptedApiKey) : fallbackEnvKey

    if (!apiKey) {
      throw new Error('Tất cả Groq API key hiện không khả dụng. Vui lòng kiểm tra lại AI Settings.')
    }

    try {
      // 4. Gọi API
      const startTime = Date.now()
      const result = await fetchGroqAPI(apiKey, finalModel, messages, finalTemp, finalTokens)
      const durationMs = Date.now() - startTime

      // 5. Nếu thành công -> Đánh dấu success và return
      if (selectedKeyRecord) {
        await markKeySuccess(selectedKeyRecord.id, result.usage?.total_tokens || 0)
      }
      
      return {
        data: result,
        apiKeyId: selectedKeyRecord?.id,
        durationMs,
        tokensUsed: result.usage?.total_tokens || 0
      }

    } catch (error) {
      // 6. Nếu lỗi -> Đánh dấu failure và thử tiếp
      console.error(`[Groq Error - Attempt ${attempt}]`, error.message)
      if (selectedKeyRecord) {
        await markKeyFailure(selectedKeyRecord.id, error.message)
        // Loại bỏ key vừa lỗi ra khỏi danh sách để chọn key khác ở vòng lặp tiếp theo
        keys = keys.filter(k => k.id !== selectedKeyRecord.id)
      } else {
        // Lỗi từ fallback env key
        throw new Error('Lỗi khi gọi Groq bằng cấu hình .env: ' + error.message)
      }
    }
  }

  throw new Error('Tất cả Groq API key đều gặp lỗi hoặc bị rate limit. Vui lòng thử lại sau.')
}
