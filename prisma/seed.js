import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Create admin user
  const passwordHash = await bcrypt.hash('Admin@2026', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@halopadel.vn' },
    update: {},
    create: {
      email: 'admin@halopadel.vn',
      passwordHash,
      fullName: 'Admin HaloPadel',
      phone: '0909123456',
      isActive: true,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // 2. Create venue
  const venue = await prisma.venue.upsert({
    where: { slug: 'halopadel-hcm' },
    update: {},
    create: {
      name: 'HaloPadel',
      slug: 'halopadel-hcm',
      shortDesc: 'Sân Padel chuyên nghiệp hàng đầu TP.HCM - Không gian tập luyện đẳng cấp với tiện nghi hiện đại',
      longDesc: `<h2>Chào mừng đến với HaloPadel</h2>
<p>HaloPadel tự hào là một trong những sân Padel chuyên nghiệp hàng đầu tại TP.HCM, được thiết kế và xây dựng theo tiêu chuẩn quốc tế.</p>
<h3>Điểm mạnh của chúng tôi</h3>
<ul>
<li>Sân Padel đạt chuẩn quốc tế FIP</li>
<li>Mặt sân nhân tạo chất lượng cao, giảm chấn thương</li>
<li>Hệ thống đèn LED chuyên dụng, không chói mắt</li>
<li>Kính cường lực an toàn, tầm nhìn rộng</li>
<li>Vị trí thuận tiện, dễ di chuyển</li>
</ul>
<h3>Quy mô sân</h3>
<p>Chúng tôi hiện có 4 sân Padel tiêu chuẩn quốc tế, phù hợp cho cả người mới bắt đầu và các vận động viên chuyên nghiệp. Mỗi sân được trang bị đầy đủ thiết bị và tiện nghi hiện đại.</p>
<h3>Các hoạt động</h3>
<ul>
<li>Thuê sân tự do</li>
<li>Lớp học Padel cho người mới</li>
<li>Huấn luyện cá nhân</li>
<li>Giải đấu định kỳ</li>
<li>Sự kiện doanh nghiệp</li>
</ul>`,
      hotline: '0909 123 456',
      zalo: '0909123456',
      email: 'info@halopadel.vn',
      facebook: 'https://facebook.com/halopadel',
      tiktok: 'https://tiktok.com/@halopadel',
      address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
      googleMapsUrl: 'https://maps.google.com/?q=10.7285,106.7215',
      googleMapsEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0!2d106.7215!3d10.7285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQzJzQyLjYiTiAxMDbCsDQzJzE3LjQiRQ!5e0!3m2!1svi!2svn!4v1" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
      openingHours: JSON.stringify([
        { day: 'Thứ 2', open: '06:00', close: '22:00' },
        { day: 'Thứ 3', open: '06:00', close: '22:00' },
        { day: 'Thứ 4', open: '06:00', close: '22:00' },
        { day: 'Thứ 5', open: '06:00', close: '22:00' },
        { day: 'Thứ 6', open: '06:00', close: '22:00' },
        { day: 'Thứ 7', open: '06:00', close: '23:00' },
        { day: 'Chủ nhật', open: '06:00', close: '23:00' },
      ]),
      seoTitle: 'HaloPadel - Sân Padel Chuyên Nghiệp Hàng Đầu TP.HCM',
      seoDescription: 'Sân Padel HaloPadel TP.HCM - Sân chuẩn quốc tế, tiện nghi hiện đại, HLV chuyên nghiệp. Liên hệ 0909 123 456 để đặt sân ngay!',
      isActive: true,
    },
  })
  console.log('✅ Venue created:', venue.name)

  // 3. Create landing sections
  const sections = [
    { sectionKey: 'hero', title: 'Chào mừng đến với HaloPadel', subtitle: 'Sân Padel chuyên nghiệp hàng đầu TP.HCM', displayOrder: 1 },
    { sectionKey: 'quickinfo', title: 'Thông tin liên hệ', subtitle: 'Liên hệ ngay để trải nghiệm', displayOrder: 2 },
    { sectionKey: 'about', title: 'Giới thiệu', subtitle: 'Tìm hiểu về HaloPadel', displayOrder: 3 },
    { sectionKey: 'gallery', title: 'Hình ảnh sân', subtitle: 'Không gian tập luyện đẳng cấp', displayOrder: 4 },
    { sectionKey: 'amenities', title: 'Tiện ích', subtitle: 'Đầy đủ tiện nghi cho bạn', displayOrder: 5 },
    { sectionKey: 'pricing', title: 'Bảng giá', subtitle: 'Giá cả hợp lý, nhiều ưu đãi', displayOrder: 6 },
    { sectionKey: 'promotions', title: 'Khuyến mãi', subtitle: 'Ưu đãi hấp dẫn dành cho bạn', displayOrder: 7 },
    { sectionKey: 'announcements', title: 'Thông báo', subtitle: 'Cập nhật tin tức mới nhất', displayOrder: 8 },
    { sectionKey: 'blog', title: 'Blog', subtitle: 'Kiến thức & tin tức Padel', displayOrder: 9 },
    { sectionKey: 'map', title: 'Bản đồ', subtitle: 'Tìm đường đến với chúng tôi', displayOrder: 10 },
    { sectionKey: 'contact', title: 'Liên hệ', subtitle: 'Gửi yêu cầu cho chúng tôi', displayOrder: 11 },
  ]

  for (const section of sections) {
    await prisma.landingSection.upsert({
      where: { venueId_sectionKey: { venueId: venue.id, sectionKey: section.sectionKey } },
      update: {},
      create: { venueId: venue.id, ...section, isActive: true },
    })
  }
  console.log('✅ Landing sections created:', sections.length)

  // 4. Create media files (sample images)
  const mediaFiles = [
    { url: '/images/sample/hero-banner.png', category: 'HERO', altText: 'Sân Padel HaloPadel', caption: 'Sân Padel chuyên nghiệp', showOnHomepage: true, isFeatured: true, displayOrder: 1 },
    { url: '/images/sample/gallery-court.png', category: 'GALLERY', altText: 'Sân Padel tiêu chuẩn quốc tế', caption: 'Sân Padel chuẩn FIP', showOnHomepage: true, isFeatured: true, displayOrder: 1 },
    { url: '/images/sample/gallery-lounge.png', category: 'GALLERY', altText: 'Khu vực chờ hiện đại', caption: 'Khu vực chờ & cafe', showOnHomepage: true, isFeatured: false, displayOrder: 2 },
    { url: '/images/sample/promotion-banner.png', category: 'PROMOTION', altText: 'Khuyến mãi HaloPadel', caption: 'Chương trình ưu đãi', showOnHomepage: false, isFeatured: false, displayOrder: 1 },
  ]

  for (const media of mediaFiles) {
    await prisma.mediaFile.create({
      data: { venueId: venue.id, uploadedById: admin.id, isActive: true, ...media },
    })
  }
  console.log('✅ Media files created:', mediaFiles.length)

  // 5. Create amenities
  const amenities = [
    { name: 'Bãi xe miễn phí', icon: '🅿️', description: 'Bãi đỗ xe rộng rãi cho ô tô và xe máy', displayOrder: 1 },
    { name: 'Nước uống', icon: '🥤', description: 'Nước uống miễn phí và quầy bar phục vụ', displayOrder: 2 },
    { name: 'Thuê vợt', icon: '🏸', description: 'Cho thuê vợt Padel chất lượng cao', displayOrder: 3 },
    { name: 'Huấn luyện viên', icon: '👨‍🏫', description: 'HLV chuyên nghiệp, có chứng chỉ quốc tế', displayOrder: 4 },
    { name: 'Phòng thay đồ', icon: '🚪', description: 'Phòng thay đồ sạch sẽ, tiện nghi', displayOrder: 5 },
    { name: 'WiFi miễn phí', icon: '📶', description: 'WiFi tốc độ cao miễn phí', displayOrder: 6 },
    { name: 'Khu vực chờ', icon: '🪑', description: 'Khu vực chờ thoải mái, có máy lạnh', displayOrder: 7 },
    { name: 'Đèn ban đêm', icon: '💡', description: 'Hệ thống đèn LED chuyên dụng', displayOrder: 8 },
    { name: 'Quán cafe', icon: '☕', description: 'Quán cafe phục vụ đồ uống và snack', displayOrder: 9 },
  ]

  for (const amenity of amenities) {
    await prisma.amenity.create({
      data: { venueId: venue.id, isActive: true, ...amenity },
    })
  }
  console.log('✅ Amenities created:', amenities.length)

  // 6. Create pricing plans
  const pricingPlans = [
    { name: 'Giờ sáng', price: '200.000đ/giờ', timeSlot: '06:00 - 08:00', description: 'Giá ưu đãi buổi sáng sớm', notes: 'Áp dụng tất cả các ngày', displayOrder: 1 },
    { name: 'Giờ hành chính', price: '300.000đ/giờ', timeSlot: '08:00 - 17:00', description: 'Giá chuẩn trong giờ hành chính', notes: 'Thứ 2 - Thứ 6', displayOrder: 2 },
    { name: 'Giờ cao điểm', price: '400.000đ/giờ', timeSlot: '17:00 - 22:00', description: 'Giờ cao điểm buổi tối', notes: 'Áp dụng tất cả các ngày', displayOrder: 3 },
    { name: 'Cuối tuần', price: '350.000đ/giờ', timeSlot: '08:00 - 17:00', description: 'Giá cuối tuần cả ngày', notes: 'Thứ 7 & Chủ nhật', displayOrder: 4 },
    { name: 'Gói tháng', price: '3.500.000đ/tháng', timeSlot: 'Linh hoạt', description: '12 giờ chơi/tháng, linh hoạt thời gian', notes: 'Tiết kiệm 25%', displayOrder: 5 },
  ]

  for (const plan of pricingPlans) {
    await prisma.pricingPlan.create({
      data: { venueId: venue.id, isActive: true, ...plan },
    })
  }
  console.log('✅ Pricing plans created:', pricingPlans.length)

  // 7. Create blog categories
  const blogCategories = [
    { name: 'Kiến thức Padel', slug: 'kien-thuc-padel', description: 'Bài viết chia sẻ kiến thức về môn Padel', displayOrder: 1 },
    { name: 'Tin tức sân', slug: 'tin-tuc-san', description: 'Tin tức và hoạt động tại HaloPadel', displayOrder: 2 },
    { name: 'Sức khỏe & Thể thao', slug: 'suc-khoe-the-thao', description: 'Bài viết về sức khỏe và thể thao', displayOrder: 3 },
  ]

  for (const cat of blogCategories) {
    await prisma.blogCategory.upsert({
      where: { venueId_slug: { venueId: venue.id, slug: cat.slug } },
      update: {},
      create: { venueId: venue.id, isActive: true, ...cat },
    })
  }
  console.log('✅ Blog categories created:', blogCategories.length)

  // 8. Create sample blog posts
  const blogPosts = [
    {
      title: 'Padel là gì? Tổng quan về môn thể thao đang hot nhất 2026',
      slug: 'padel-la-gi-tong-quan',
      excerpt: 'Padel là môn thể thao kết hợp giữa tennis và squash, đang phát triển mạnh mẽ trên toàn thế giới và tại Việt Nam.',
      content: `<h2>Padel là gì?</h2>
<p>Padel (hay Padel Tennis) là một môn thể thao vợt được chơi trên sân nhỏ hơn sân tennis, có tường kính bao quanh. Môn thể thao này kết hợp các yếu tố của cả tennis và squash.</p>
<h3>Luật chơi cơ bản</h3>
<ul>
<li>Chơi theo cặp đôi (2 vs 2)</li>
<li>Sân có kích thước 20m x 10m</li>
<li>Bóng có thể bật vào tường kính</li>
<li>Cách tính điểm giống tennis</li>
<li>Serve phải giao underhand</li>
</ul>
<h3>Tại sao Padel phổ biến?</h3>
<p>Padel dễ học hơn tennis, phù hợp mọi lứa tuổi và thể lực. Tính xã hội cao vì luôn chơi đôi, tạo cảm giác vui vẻ và kết nối.</p>`,
      coverImage: '/images/sample/gallery-court.png',
      status: 'PUBLISHED',
      showOnHomepage: true,
      isFeatured: true,
      displayOrder: 1,
      seoTitle: 'Padel là gì? Tổng quan môn thể thao hot nhất 2026',
      seoDescription: 'Tìm hiểu Padel là gì, luật chơi, lợi ích sức khỏe và tại sao Padel đang trở thành môn thể thao phổ biến nhất tại Việt Nam.',
      publishedAt: new Date(),
    },
    {
      title: '5 lợi ích sức khỏe tuyệt vời khi chơi Padel thường xuyên',
      slug: '5-loi-ich-suc-khoe-choi-padel',
      excerpt: 'Chơi Padel không chỉ vui mà còn mang lại nhiều lợi ích sức khỏe đáng kinh ngạc cho cơ thể và tinh thần.',
      content: `<h2>Lợi ích sức khỏe từ Padel</h2>
<p>Padel là một trong những môn thể thao toàn diện nhất, giúp cải thiện cả thể chất lẫn tinh thần.</p>
<h3>1. Đốt cháy calo hiệu quả</h3>
<p>Một trận Padel 60 phút giúp đốt cháy 400-700 calo, tương đương chạy bộ 8km.</p>
<h3>2. Cải thiện sức bền tim mạch</h3>
<p>Padel kết hợp cardio và HIIT tự nhiên, giúp tim khỏe hơn.</p>
<h3>3. Tăng cường phản xạ</h3>
<p>Bóng di chuyển nhanh trong không gian nhỏ đòi hỏi phản xạ nhanh nhạy.</p>
<h3>4. Giảm stress</h3>
<p>Vận động thể chất giúp giải phóng endorphin, giảm căng thẳng hiệu quả.</p>
<h3>5. Tăng kết nối xã hội</h3>
<p>Luôn chơi 4 người giúp mở rộng mối quan hệ và tạo thói quen tập luyện.</p>`,
      coverImage: '/images/sample/gallery-lounge.png',
      status: 'PUBLISHED',
      showOnHomepage: true,
      isFeatured: false,
      displayOrder: 2,
      seoTitle: '5 lợi ích sức khỏe khi chơi Padel',
      seoDescription: 'Khám phá 5 lợi ích sức khỏe tuyệt vời khi chơi Padel: đốt calo, tăng sức bền, cải thiện phản xạ và giảm stress.',
      publishedAt: new Date(),
    },
  ]

  for (const post of blogPosts) {
    const category = await prisma.blogCategory.findFirst({ where: { venueId: venue.id, slug: 'kien-thuc-padel' } })
    await prisma.blogPost.upsert({
      where: { venueId_slug: { venueId: venue.id, slug: post.slug } },
      update: {},
      create: { venueId: venue.id, authorId: admin.id, categoryId: category?.id, ...post },
    })
  }
  console.log('✅ Blog posts created:', blogPosts.length)

  // 9. Create sample promotions
  const promotions = [
    {
      title: 'Khai trương - Giảm 30% tất cả giờ chơi',
      slug: 'khai-truong-giam-30-phan-tram',
      shortDesc: 'Nhân dịp khai trương, HaloPadel giảm 30% giá thuê sân tất cả các khung giờ.',
      content: `<h2>🎉 Ưu đãi khai trương</h2>
<p>Chào mừng khai trương HaloPadel, chúng tôi xin gửi tặng ưu đãi đặc biệt:</p>
<ul>
<li><strong>Giảm 30%</strong> giá thuê sân tất cả khung giờ</li>
<li>Tặng nước uống miễn phí</li>
<li>Cho mượn vợt miễn phí</li>
</ul>
<p>Chương trình áp dụng từ ngày khai trương đến hết 31/07/2026.</p>`,
      banner: '/images/sample/promotion-banner.png',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-07-31'),
      conditions: 'Áp dụng cho tất cả khách hàng. Không giới hạn số lần sử dụng.',
      ctaText: 'Đặt sân ngay',
      ctaUrl: 'tel:0909123456',
      isActive: true,
      showOnHomepage: true,
      isFeatured: true,
      displayOrder: 1,
      seoTitle: 'Khai trương HaloPadel - Giảm 30% tất cả giờ chơi',
      seoDescription: 'Ưu đãi khai trương HaloPadel: Giảm 30% giá thuê sân, tặng nước uống và cho mượn vợt miễn phí.',
    },
    {
      title: 'Gói tập tháng - Tiết kiệm đến 25%',
      slug: 'goi-tap-thang-tiet-kiem-25',
      shortDesc: 'Đăng ký gói tập tháng để tiết kiệm đến 25% chi phí thuê sân.',
      content: `<h2>💰 Gói tập tháng ưu đãi</h2>
<p>Dành cho những ai yêu thích Padel và muốn tập luyện thường xuyên:</p>
<ul>
<li><strong>12 giờ/tháng</strong>: 3.500.000đ (tiết kiệm 25%)</li>
<li><strong>8 giờ/tháng</strong>: 2.500.000đ (tiết kiệm 20%)</li>
<li><strong>4 giờ/tháng</strong>: 1.400.000đ (tiết kiệm 15%)</li>
</ul>
<p>Linh hoạt chọn giờ chơi, không giới hạn khung giờ.</p>`,
      banner: '/images/sample/promotion-banner.png',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-12-31'),
      conditions: 'Thanh toán trước toàn bộ gói tập. Không hoàn lại.',
      ctaText: 'Liên hệ Zalo',
      ctaUrl: 'https://zalo.me/0909123456',
      isActive: true,
      showOnHomepage: true,
      isFeatured: false,
      displayOrder: 2,
      seoTitle: 'Gói tập tháng HaloPadel - Tiết kiệm 25%',
      seoDescription: 'Đăng ký gói tập tháng tại HaloPadel, tiết kiệm đến 25%. Linh hoạt thời gian, chơi bao nhiêu cũng được.',
    },
  ]

  for (const promo of promotions) {
    await prisma.promotion.upsert({
      where: { venueId_slug: { venueId: venue.id, slug: promo.slug } },
      update: {},
      create: { venueId: venue.id, createdById: admin.id, ...promo },
    })
  }
  console.log('✅ Promotions created:', promotions.length)

  // 10. Create sample announcements
  const announcements = [
    {
      title: 'Thông báo giờ hoạt động mùa hè 2026',
      slug: 'thong-bao-gio-hoat-dong-mua-he-2026',
      content: `<p>Kính gửi quý khách,</p>
<p>Từ ngày 01/06/2026, HaloPadel điều chỉnh giờ hoạt động mùa hè như sau:</p>
<ul>
<li><strong>Thứ 2 - Thứ 6</strong>: 05:30 - 22:30</li>
<li><strong>Thứ 7 - Chủ nhật</strong>: 05:30 - 23:00</li>
</ul>
<p>Trân trọng,<br/>Ban Quản lý HaloPadel</p>`,
      type: 'INFO',
      isActive: true,
      showOnHomepage: true,
      isPinned: true,
      displayOrder: 1,
    },
    {
      title: 'Giải đấu Padel mở rộng tháng 7/2026',
      slug: 'giai-dau-padel-mo-rong-thang-7-2026',
      content: `<h2>🏆 Giải đấu Padel Mở rộng HaloPadel Cup</h2>
<p>HaloPadel tổ chức giải đấu Padel mở rộng lần đầu tiên:</p>
<ul>
<li><strong>Thời gian</strong>: 15-16/07/2026</li>
<li><strong>Địa điểm</strong>: HaloPadel, Q7, TP.HCM</li>
<li><strong>Hạng mục</strong>: Nam đôi, Nữ đôi, Hỗn hợp đôi</li>
<li><strong>Giải thưởng</strong>: Tổng giá trị 20 triệu đồng</li>
</ul>
<p>Đăng ký tham gia qua Zalo hoặc liên hệ hotline.</p>`,
      type: 'EVENT',
      isActive: true,
      showOnHomepage: true,
      isPinned: false,
      displayOrder: 2,
    },
  ]

  for (const ann of announcements) {
    await prisma.announcement.upsert({
      where: { venueId_slug: { venueId: venue.id, slug: ann.slug } },
      update: {},
      create: { venueId: venue.id, createdById: admin.id, ...ann },
    })
  }
  console.log('✅ Announcements created:', announcements.length)

  // 11. Create SEO settings
  const seoSettings = [
    { pageKey: 'home', metaTitle: 'HaloPadel - Sân Padel Chuyên Nghiệp TP.HCM', metaDescription: 'Sân Padel HaloPadel - Tiêu chuẩn quốc tế, tiện nghi hiện đại, HLV chuyên nghiệp. Liên hệ 0909 123 456!' },
    { pageKey: 'about', metaTitle: 'Giới thiệu HaloPadel - Sân Padel Đẳng Cấp', metaDescription: 'Tìm hiểu về HaloPadel - sân Padel chuyên nghiệp hàng đầu TP.HCM với 4 sân chuẩn FIP.' },
    { pageKey: 'gallery', metaTitle: 'Hình ảnh sân HaloPadel', metaDescription: 'Xem hình ảnh sân Padel, tiện ích và không gian tập luyện tại HaloPadel.' },
    { pageKey: 'promotions', metaTitle: 'Khuyến mãi HaloPadel - Ưu đãi hot', metaDescription: 'Cập nhật các chương trình khuyến mãi, ưu đãi mới nhất tại sân Padel HaloPadel.' },
    { pageKey: 'announcements', metaTitle: 'Thông báo HaloPadel', metaDescription: 'Cập nhật thông báo, lịch nghỉ, giải đấu và hoạt động tại HaloPadel.' },
    { pageKey: 'blog', metaTitle: 'Blog HaloPadel - Kiến thức & Tin tức Padel', metaDescription: 'Chia sẻ kiến thức Padel, mẹo tập luyện, tin tức thể thao và cập nhật từ HaloPadel.' },
    { pageKey: 'contact', metaTitle: 'Liên hệ HaloPadel', metaDescription: 'Liên hệ HaloPadel - Hotline: 0909 123 456 | Zalo: 0909123456 | 123 Nguyễn Văn Linh, Q7, TP.HCM.' },
  ]

  for (const seo of seoSettings) {
    await prisma.seoSetting.upsert({
      where: { venueId_pageKey: { venueId: venue.id, pageKey: seo.pageKey } },
      update: {},
      create: { venueId: venue.id, ...seo },
    })
  }
  console.log('✅ SEO settings created:', seoSettings.length)

  console.log('\n🎉 Seeding completed!')
  console.log('📧 Admin login: admin@halopadel.vn')
  console.log('🔑 Admin password: Admin@2026')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
