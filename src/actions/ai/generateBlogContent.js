'use server'

import { callGroqWithRotation } from '@/lib/ai/groq'
import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'

// Giới hạn chống spam (Daily Quota)
const ROLE_LIMITS = {
  OWNER: 30,
  ADMIN: 30,
  EDITOR: 10,
  STAFF: 0
}

export async function generateBlogContentWithAI(idea) {
  // 1. TODO: Kiểm tra User Session & Auth thực tế. Hiện tại ta hardcode userId = 1 (Admin)
  const userId = 1 
  const userRole = 'ADMIN' // Giả sử

  // 2. Kiểm tra Role Limit (Anti-Spam)
  const limit = ROLE_LIMITS[userRole] || 0
  if (limit === 0) {
    return { success: false, error: 'Bạn không có quyền sử dụng tính năng AI này.' }
  }

  // Đếm số lần gọi trong ngày của user
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const usageCount = await prisma.aiUsageLog.count({
    where: {
      userId,
      createdAt: { gte: today },
      status: 'SUCCESS'
    }
  })

  if (usageCount >= limit) {
    return { success: false, error: `Bạn đã đạt giới hạn sử dụng AI hôm nay (${limit} lần). Vui lòng quay lại vào ngày mai.` }
  }

  // 3. Chuẩn bị prompt
  const systemPrompt = `
Bạn là AI SEO Content Assistant chuyên viết blog chuẩn SEO cho website sân thể thao Halo Padel.

Nhiệm vụ của bạn:
Nhận ý tưởng ngắn từ người dùng.
Tự phát triển thành một bài blog hoàn chỉnh, chuẩn SEO, phù hợp với website giới thiệu sân Halo Padel.
Tự tạo tiêu đề bài viết.
Tự tạo slug URL (tiếng Việt không dấu, gạch ngang).
Tự tạo mô tả ngắn (excerpt 120-180 ký tự).
Tự tạo SEO title (tối đa 60 ký tự).
Tự tạo SEO description (140-160 ký tự).
Tự tạo nội dung bằng định dạng Markdown sạch, có cấu trúc heading chuẩn.
Tự tạo prompt ảnh cover phù hợp để hệ thống backend dùng tìm ảnh trên kho ảnh.
Tự đề xuất alt text cho ảnh.
Tự đề xuất category và tags.

Thông tin thương hiệu:
Tên sân: Halo Padel Sports Club
Lĩnh vực: sân padel, thể thao hiện đại
Website không hỗ trợ đặt lịch online, CTA chính là Gọi tư vấn / Chat Zalo.

Yêu cầu Nội dung (Content):
- BÀI VIẾT NÊN DÀI VÀ CHI TIẾT (KHOẢNG 800 - 1200 TỪ).
- Cấu trúc: Có khoảng 4-6 phần chính (Heading 2).
- Tránh viết quá đồ sộ khiến bị quá tải, nhưng phải đảm bảo phân tích đầy đủ và sâu sắc, tránh viết liệt kê sơ sài.
- Văn phong: Mang tính chất của một bài viết tạp chí, chuyên gia phân tích đa chiều.
- BẮT BUỘC SỬ DỤNG MÃ HTML HOÀN CHỈNH (RAW HTML) THAY VÌ MARKDOWN CƠ BẢN.
- TÍCH HỢP TRỰC TIẾP TAILWIND CSS CLASSES VÀO THẺ HTML ĐỂ BÀI VIẾT ĐẸP MẮT:
  + Dùng các thẻ <h2>, <h3> với class như 'text-2xl font-bold text-[#D45A2A] mt-8 mb-4 border-b pb-2'.
  + Dùng <blockquote> với class 'p-4 italic border-l-4 border-[#D45A2A] bg-[#FFF9EE] rounded-r-xl my-6 text-[#555555]'.
  + Dùng <ul>, <li> với class 'list-disc pl-6 space-y-2 text-[#333333]'.
  + Các đoạn văn <p> dùng class 'text-base leading-relaxed text-[#444444] mb-4'.
  + Thêm các box highlight nội dung quan trọng: <div class="bg-blue-50 p-5 rounded-2xl border border-blue-100 my-6 shadow-sm">.
- KHÔNG dùng dấu '#' hay '##' hay '*' của Markdown, phải bọc bằng thẻ HTML thực sự ('<h2>', '<li>', v.v.).

Yêu cầu Ảnh bìa (coverImagePrompt):
- Phải viết prompt ảnh bìa bằng tiếng Anh, CHI TIẾT và CHUẨN MIDJOURNEY/DALL-E.
- Độ dài ít nhất 3-4 câu, mô tả rõ góc máy, ánh sáng, cảm xúc, hành động, bối cảnh, và chất lượng (ví dụ: 8k, photorealistic, cinematic lighting).

Output bắt buộc:
Chỉ trả về JSON hợp lệ. Không bọc JSON bằng markdown block (\`\`\`json). Không giải thích ngoài JSON.
Schema:
{
  "title": "Tiêu đề bài viết",
  "slug": "slug-tieng-viet-khong-dau",
  "excerpt": "Mô tả ngắn của bài viết",
  "seoTitle": "SEO title",
  "seoDescription": "SEO description",
  "category": "Tên danh mục",
  "tags": ["tag 1", "tag 2"],
  "focusKeyword": "từ khóa chính",
  "markdownContent": "Nội dung bài viết sử dụng 100% thẻ HTML phong phú...",
  "coverImagePrompt": "English prompt for Midjourney (highly detailed, cinematic lighting, 8k, specific actions and environment)..."
}
`

  // 4. Gọi Groq với luồng Rotation Key
  let groqResponse
  try {
    groqResponse = await callGroqWithRotation({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Ý tưởng bài viết: ${idea}` }
      ]
    }, VENUE_ID)
  } catch (error) {
    // Lưu log lỗi
    await prisma.aiUsageLog.create({
      data: {
        venueId: VENUE_ID,
        userId,
        feature: 'BLOG_GENERATION',
        inputPrompt: idea,
        status: 'FAILED',
        errorMessage: error.message,
        model: 'unknown'
      }
    })
    return { success: false, error: error.message }
  }

  // 5. Parse JSON kết quả
  let parsedContent
  try {
    const rawContent = groqResponse.data.choices[0].message.content
    // Fix trường hợp AI vẫn cố bọc ```json
    const cleanedJson = rawContent.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    parsedContent = JSON.parse(cleanedJson)
  } catch (err) {
    // Lưu log parse error
    await prisma.aiUsageLog.create({
      data: {
        venueId: VENUE_ID,
        userId,
        apiKeyId: groqResponse.apiKeyId,
        feature: 'BLOG_GENERATION',
        inputPrompt: idea,
        status: 'FAILED',
        errorMessage: 'Lỗi parse JSON từ Groq: ' + err.message,
        model: groqResponse.data.model || 'unknown',
        durationMs: groqResponse.durationMs,
        tokensUsed: groqResponse.tokensUsed
      }
    })
    return { success: false, error: 'AI trả về định dạng không hợp lệ. Vui lòng thử lại.' }
  }

  // 6. Lưu log thành công
  await prisma.aiUsageLog.create({
    data: {
      venueId: VENUE_ID,
      userId,
      apiKeyId: groqResponse.apiKeyId,
      feature: 'BLOG_GENERATION',
      inputPrompt: idea,
      outputSummary: `Tạo thành công blog: ${parsedContent.title}`,
      status: 'SUCCESS',
      model: groqResponse.data.model || 'unknown',
      durationMs: groqResponse.durationMs,
      tokensUsed: groqResponse.tokensUsed
    }
  })

  // 7. Xử lý phần tạo ảnh cover. 
  // (Theo kế hoạch, chúng ta sẽ pick một hình ngẫu nhiên từ Media Library làm ảnh cover tạm thời)
  const defaultImage = '/images/gallery/gallery_action.png' // Fallback nếu DB trống
  let coverImageUrl = defaultImage
  try {
    const randomMedia = await prisma.mediaFile.findFirst({
      where: { venueId: VENUE_ID, category: 'BLOG', isActive: true },
      orderBy: { id: 'desc' } // Lấy đại ảnh mới nhất hoặc random
    })
    if (randomMedia) coverImageUrl = randomMedia.url
  } catch (e) {
    console.error('Lỗi khi lấy media:', e)
  }

  parsedContent.coverImageUrl = coverImageUrl

  return { success: true, data: parsedContent }
}
