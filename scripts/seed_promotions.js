const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Promotions with Images...')
  
  const promotions = [
    {
      title: 'Nhận ưu đãi thuê sân tất cả khung giờ trong tháng khai trương.',
      slug: 'uu-dai-khai-truong',
      shortDesc: 'HaloPadel tưng bừng khai trương cơ sở mới. Tặng ngay voucher giảm giá 30% cho khách hàng đặt sân qua hệ thống trong thời gian diễn ra sự kiện. Cơ hội tuyệt vời để trải nghiệm sân Padel chuẩn quốc tế.',
      banner: '/images/gallery/gallery_action.png',
      startDate: new Date(),
      endDate: new Date('2026-07-31T23:59:59Z'),
      isActive: true,
      showOnHomepage: true,
      isFeatured: true,
      displayOrder: 1,
    },
    {
      title: 'Gói tập tháng - Tiết kiệm chi phí chơi thường xuyên',
      slug: 'goi-tap-thang-tiet-kiem',
      shortDesc: 'Dành riêng cho khách hàng đam mê Padel. Chơi linh hoạt 12 giờ/tháng với mức giá rẻ hơn 25% so với đặt lẻ từng trận. Giữ cố định giờ chơi đẹp nhất tuần.',
      banner: '/images/amenities/lounge.png',
      startDate: new Date(),
      endDate: new Date('2026-12-31T23:59:59Z'),
      isActive: true,
      showOnHomepage: true,
      isFeatured: false,
      displayOrder: 2,
    }
  ]

  // Clear old promotions
  await prisma.promotion.deleteMany({})

  for (const item of promotions) {
    await prisma.promotion.create({
      data: {
        venueId: 1,
        ...item
      }
    })
  }

  console.log('Promotions seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
