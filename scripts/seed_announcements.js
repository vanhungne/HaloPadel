const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Announcements...')
  
  const announcements = [
    {
      title: 'Thông báo giờ hoạt động mùa hè 2026',
      slug: 'gio-hoat-dong-mua-he-2026',
      content: 'HaloPadel chính thức cập nhật khung giờ hoạt động mùa hè, hỗ trợ khách chơi linh hoạt hơn trong ngày. Mở cửa từ sáng sớm để tránh nóng và kéo dài thời gian phục vụ buổi tối.\n\nTừ thứ 2 đến thứ 6: 05:30 - 22:30\nThứ 7 & Chủ Nhật: 05:30 - 23:00',
      type: 'INFO',
      image: '/images/gallery/gallery_match.png',
      isPinned: true,
      showOnHomepage: true,
      displayOrder: 1,
      createdAt: new Date(),
      startDate: new Date('2026-06-01T00:00:00Z'),
    },
    {
      title: 'Giải đấu Padel mở rộng tháng 7/2026',
      slug: 'giai-dau-padel-mo-rong-thang-7',
      content: 'Đăng ký ngay giải đấu lớn nhất khu vực với tổng giải thưởng lên đến 50 triệu đồng. Dành cho mọi cấp độ người chơi. Hạn chót đăng ký: 30/06/2026.',
      type: 'EVENT',
      image: '/images/gallery/gallery_serve.png',
      isPinned: false,
      showOnHomepage: true,
      displayOrder: 2,
      createdAt: new Date(),
    },
    {
      title: 'Ưu đãi gói tháng đặc biệt cho hội nhóm',
      slug: 'uu-dai-goi-thang-dac-biet',
      content: 'Chỉ trong tháng này, đăng ký gói tháng cho nhóm từ 4 người trở lên sẽ được giảm ngay 25% và tặng kèm 2 giờ giao lưu miễn phí. Liên hệ ngay qua Zalo để nhận tư vấn.',
      type: 'PROMO',
      image: null,
      isPinned: false,
      showOnHomepage: true,
      displayOrder: 3,
      createdAt: new Date(),
    },
    {
      title: 'Lịch bảo trì sân định kỳ',
      slug: 'lich-bao-tri-san-dinh-ky',
      content: 'Để đảm bảo trải nghiệm chơi Padel tốt nhất, chúng tôi sẽ tiến hành bảo dưỡng mặt sân số 1 và 2 từ 13:00 đến 15:00 thứ 5 tuần này. Mong quý khách thông cảm.',
      type: 'MAINTENANCE',
      image: null,
      isPinned: false,
      showOnHomepage: true,
      displayOrder: 4,
      createdAt: new Date(),
    },
    {
      title: 'Cập nhật nội quy sân bóng Padel',
      slug: 'cap-nhat-noi-quy',
      content: 'Yêu cầu toàn bộ khách hàng mang giày thể thao đế bằng khi lên sân. Không hút thuốc trong khuôn viên. Khách hàng vui lòng check-in trước giờ đá 10 phút.',
      type: 'INFO',
      image: null,
      isPinned: false,
      showOnHomepage: true,
      displayOrder: 5,
      createdAt: new Date(),
    }
  ]

  // Clear old
  await prisma.announcement.deleteMany({})

  for (const item of announcements) {
    await prisma.announcement.create({
      data: {
        venueId: 1,
        ...item
      }
    })
  }

  console.log('Announcements seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
