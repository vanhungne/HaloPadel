'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getLandingSections() {
  try {
    const sections = await prisma.landingSection.findMany({
      orderBy: { displayOrder: 'asc' }
    })
    
    // Default sections if none exist
    if (sections.length === 0) {
      const defaultSections = [
        { sectionKey: 'hero', name: 'Hero Banner', description: 'Khu vực ảnh bìa và lời chào đầu trang', isActive: true, displayOrder: 1, venueId: 1 },
        { sectionKey: 'quickinfo', name: 'Thông tin liên hệ', description: 'Liên hệ ngay để trải nghiệm', isActive: true, displayOrder: 2, venueId: 1 },
        { sectionKey: 'about', name: 'Giới thiệu', description: 'Nội dung giới thiệu chi tiết, hình ảnh cơ sở vật chất', isActive: true, displayOrder: 3, venueId: 1 },
        { sectionKey: 'gallery', name: 'Thư viện hình ảnh', description: 'Lưới hình ảnh thực tế tại sân', isActive: true, displayOrder: 4, venueId: 1 },
        { sectionKey: 'amenities', name: 'Tiện ích sân', description: 'Danh sách dịch vụ đi kèm (Wifi, Bãi xe, Cafe...)', isActive: true, displayOrder: 5, venueId: 1 },
        { sectionKey: 'pricing', name: 'Bảng giá', description: 'Chi phí thuê sân theo giờ/theo tháng', isActive: true, displayOrder: 6, venueId: 1 },
        { sectionKey: 'promotions', name: 'Khuyến mãi nổi bật', description: 'Các chiến dịch ưu đãi đang chạy', isActive: true, displayOrder: 7, venueId: 1 },
        { sectionKey: 'announcements', name: 'Thông báo', description: 'Bảng tin cập nhật nhanh từ BQL', isActive: true, displayOrder: 8, venueId: 1 },
        { sectionKey: 'blog', name: 'Tạp chí Padel', description: 'Các bài viết kiến thức nổi bật', isActive: true, displayOrder: 9, venueId: 1 },
        { sectionKey: 'map', name: 'Bản đồ', description: 'Tìm đường đến với chúng tôi', isActive: true, displayOrder: 10, venueId: 1 },
        { sectionKey: 'contact', name: 'Liên hệ', description: 'Gửi yêu cầu cho chúng tôi', isActive: true, displayOrder: 11, venueId: 1 },
      ]

      await prisma.landingSection.createMany({
        data: defaultSections
      })

      return await prisma.landingSection.findMany({
        orderBy: { displayOrder: 'asc' }
      })
    }
    
    return sections
  } catch (error) {
    console.error('Failed to fetch landing sections:', error)
    return []
  }
}

export async function updateLandingSectionStatus(id, isActive) {
  try {
    await prisma.landingSection.update({
      where: { id },
      data: { isActive }
    })
    revalidatePath('/admin/landing')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to update landing section status:', error)
    return { success: false, error: 'Lỗi khi cập nhật trạng thái' }
  }
}

export async function updateLandingSectionOrder(sections) {
  try {
    // Array of { id, displayOrder }
    const updatePromises = sections.map((section) => 
      prisma.landingSection.update({
        where: { id: section.id },
        data: { displayOrder: section.displayOrder }
      })
    )
    await Promise.all(updatePromises)

    revalidatePath('/admin/landing')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to update landing section order:', error)
    return { success: false, error: 'Lỗi khi sắp xếp thứ tự' }
  }
}
