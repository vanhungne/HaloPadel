const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Amenities with Images...')
  
  const amenities = [
    {
      name: 'Bãi xe miễn phí',
      description: 'Bãi đỗ rộng rãi cho ô tô và xe máy, an ninh 24/7.',
      icon: 'parking',
      image: '/images/amenities/parking.png',
      displayOrder: 1,
    },
    {
      name: 'Nước uống',
      description: 'Nước uống miễn phí và quầy bar phục vụ các loại nước ép, cafe.',
      icon: 'cafe',
      image: '/images/amenities/cafe.png',
      displayOrder: 2,
    },
    {
      name: 'Thuê vợt',
      description: 'Cho thuê vợt Padel chất lượng cao từ các thương hiệu nổi tiếng.',
      icon: 'racket',
      image: '/images/amenities/rackets.png',
      displayOrder: 3,
    },
    {
      name: 'Huấn luyện viên',
      description: 'HLV chuyên nghiệp, có chứng chỉ quốc tế hướng dẫn tận tình.',
      icon: 'coach',
      image: '/images/amenities/lounge.png',
      displayOrder: 4,
    },
    {
      name: 'Phòng thay đồ',
      description: 'Phòng thay đồ sạch sẽ, tiện nghi, có sẵn khăn tắm và máy sấy.',
      icon: 'locker',
      image: '/images/amenities/locker.png',
      displayOrder: 5,
    },
    {
      name: 'WiFi tốc độ cao',
      description: 'Hệ thống WiFi tốc độ cao miễn phí bao phủ toàn bộ khu vực.',
      icon: 'wifi',
      image: '/images/amenities/lounge.png',
      displayOrder: 6,
    },
    {
      name: 'Khu vực chờ',
      description: 'Không gian chờ thoải mái, mát mẻ, view trực diện sân bóng.',
      icon: 'lounge',
      image: '/images/amenities/lounge.png',
      displayOrder: 7,
    },
    {
      name: 'Đèn ban đêm',
      description: 'Hệ thống đèn LED đạt chuẩn thi đấu quốc tế, không chói mắt.',
      icon: 'lights',
      image: '/images/amenities/lights.png',
      displayOrder: 8,
    }
  ]

  // Clear old amenities
  await prisma.amenity.deleteMany({})

  for (const item of amenities) {
    await prisma.amenity.create({
      data: {
        venueId: 1,
        ...item
      }
    })
  }

  console.log('Amenities seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
