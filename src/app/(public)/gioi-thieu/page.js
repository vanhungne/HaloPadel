import { prisma } from '@/lib/prisma'
import { VENUE_ID } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'

import { getSeoMetadata, SchemaMarkup } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata() {
  return await getSeoMetadata('about', 'Giới thiệu HaloPadel')
}

async function getAboutData() {
  const venue = await prisma.venue.findFirst({ where: { id: VENUE_ID, isActive: true } })
  return { venue }
}

export default async function AboutPage() {
  const { venue } = await getAboutData()

  return (
    <>
      <SchemaMarkup pageKey="about" />
      <div className="bg-[#FFFDF6] overflow-hidden">
      
      {/* SECTION 1: HERO */}
      <section className="py-20 md:py-28 bg-white border-b border-[#E8E2D2]">
        <div className="w-full px-4 md:px-8 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <p className="text-[13px] font-semibold text-[#D45A2A] uppercase tracking-[0.2em] mb-4">
                Giới thiệu HaloPadel
              </p>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] font-bold text-[#111111] leading-[1.1] mb-6">
                Không gian padel <br className="hidden md:block"/> hiện đại tại Đà Nẵng
              </h1>
              <p className="text-[#555555] text-[16px] md:text-[18px] leading-relaxed mb-8 max-w-lg">
                HaloPadel Sports Club mang đến trải nghiệm chơi padel chuyên nghiệp với sân đạt chuẩn, không gian tiện nghi và dịch vụ thân thiện cho cả người mới bắt đầu lẫn người chơi thường xuyên.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link 
                  href="/lien-he"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[52px] px-8 bg-[#D45A2A] hover:bg-[#B8431D] text-white rounded-full font-bold text-[15px] transition-transform hover:-translate-y-1 shadow-lg"
                >
                  Liên hệ tư vấn
                </Link>
                <Link 
                  href="/hinh-anh"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[52px] px-8 bg-[#FFF9EE] text-[#D45A2A] hover:bg-[#FBEAD8] rounded-full font-bold text-[15px] transition-colors"
                >
                  Xem hình ảnh sân
                </Link>
              </div>
            </div>
            {/* Image */}
            <div className="relative rounded-[32px] overflow-hidden h-[400px] lg:h-[500px] shadow-2xl">
              <Image src="/images/gallery/gallery_hero.png" alt="HaloPadel Hero" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STATS */}
      <section className="py-16 md:py-20 bg-[#111111] text-white">
        <div className="w-full px-4 md:px-8 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/10">
            <div className="text-center px-4">
              <div className="font-heading text-4xl md:text-5xl font-bold text-[#D45A2A] mb-2">4+</div>
              <div className="text-[14px] md:text-[16px] font-medium text-white/80">Sân padel tiêu chuẩn</div>
            </div>
            <div className="text-center px-4">
              <div className="font-heading text-4xl md:text-5xl font-bold text-[#D45A2A] mb-2">16h</div>
              <div className="text-[14px] md:text-[16px] font-medium text-white/80">06:00 - 22:00 hằng ngày</div>
            </div>
            <div className="text-center px-4">
              <div className="font-heading text-4xl md:text-5xl font-bold text-[#D45A2A] mb-2">100+</div>
              <div className="text-[14px] md:text-[16px] font-medium text-white/80">Khách chơi mỗi tuần</div>
            </div>
            <div className="text-center px-4">
              <div className="font-heading text-4xl md:text-5xl font-bold text-[#D45A2A] mb-2">30%</div>
              <div className="text-[14px] md:text-[16px] font-medium text-white/80">Ưu đãi khai trương</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STORY */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <span className="font-heading text-[200px] font-black text-center leading-none">HALO<br/>PADEL</span>
        </div>
        <div className="w-full px-4 md:px-8 max-w-[800px] mx-auto text-center relative z-10">
          <p className="font-heading text-2xl md:text-3xl lg:text-[34px] font-semibold text-[#111111] leading-relaxed mb-8">
            "HaloPadel được xây dựng với mục tiêu tạo ra một không gian chơi padel hiện đại, dễ tiếp cận và phù hợp với cộng đồng yêu thể thao."
          </p>
          <p className="text-[#555555] text-[16px] md:text-[18px] leading-relaxed">
            Không chỉ là nơi thuê sân, HaloPadel còn là điểm gặp gỡ cho nhóm bạn, người mới bắt đầu, vận động viên phong trào và các doanh nghiệp muốn tổ chức hoạt động thể thao gắn kết.
          </p>
        </div>
      </section>

      {/* SECTION 4: STRENGTHS */}
      <section className="py-20 md:py-28 bg-white border-y border-[#E8E2D2]">
        <div className="w-full px-4 md:px-8 max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-[2.5rem] font-bold text-[#111111] mb-4">Điểm mạnh của chúng tôi</h2>
            <p className="text-[#555555] text-base md:text-lg">Trải nghiệm chơi padel hoàn hảo nhất tại Đà Nẵng</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-[#FFFDF6] p-8 rounded-[24px] border border-[#E8E2D2] hover:border-[#D45A2A]/30 transition-colors">
              <div className="w-14 h-14 bg-[#FFF9EE] rounded-2xl flex items-center justify-center text-[#D45A2A] mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-heading text-[22px] font-bold text-[#111111] mb-3">Sân đạt chuẩn</h3>
              <p className="text-[#555555] leading-relaxed">Mặt sân chất lượng, không gian chơi thoáng, kính cường lực an toàn, phù hợp tập luyện và thi đấu phong trào.</p>
            </div>
            
            <div className="bg-[#FFFDF6] p-8 rounded-[24px] border border-[#E8E2D2] hover:border-[#D45A2A]/30 transition-colors">
              <div className="w-14 h-14 bg-[#FFF9EE] rounded-2xl flex items-center justify-center text-[#D45A2A] mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-heading text-[22px] font-bold text-[#111111] mb-3">Đèn LED chuyên dụng</h3>
              <p className="text-[#555555] leading-relaxed">Hệ thống chiếu sáng đạt chuẩn hỗ trợ chơi buổi tối cực kỳ rõ nét, không tạo bóng và hạn chế chói mắt tối đa.</p>
            </div>
            
            <div className="bg-[#FFFDF6] p-8 rounded-[24px] border border-[#E8E2D2] hover:border-[#D45A2A]/30 transition-colors">
              <div className="w-14 h-14 bg-[#FFF9EE] rounded-2xl flex items-center justify-center text-[#D45A2A] mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 className="font-heading text-[22px] font-bold text-[#111111] mb-3">Khu chờ tiện nghi</h3>
              <p className="text-[#555555] leading-relaxed">Không gian nghỉ ngơi sang trọng, phục vụ cafe, nước uống và khu vực quan sát sân siêu thoáng đãng.</p>
            </div>
            
            <div className="bg-[#FFFDF6] p-8 rounded-[24px] border border-[#E8E2D2] hover:border-[#D45A2A]/30 transition-colors">
              <div className="w-14 h-14 bg-[#FFF9EE] rounded-2xl flex items-center justify-center text-[#D45A2A] mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-[22px] font-bold text-[#111111] mb-3">Hỗ trợ người mới</h3>
              <p className="text-[#555555] leading-relaxed">Dịch vụ cho thuê vợt chất lượng cao, cung cấp hướng dẫn luật chơi cơ bản và hỗ trợ HLV khi cần thiết.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TARGET AUDIENCE */}
      <section className="py-20 md:py-28">
        <div className="w-full px-4 md:px-8 max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-[2.5rem] font-bold text-[#111111] mb-4">HaloPadel phù hợp với ai?</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Người mới bắt đầu', desc: 'Dễ làm quen, có hỗ trợ thuê vợt và hướng dẫn luật chơi cơ bản.' },
              { title: 'Nhóm bạn / Hội nhóm', desc: 'Sân đấu tiêu chuẩn, phù hợp đặt sân theo khung giờ cố định mỗi tuần.' },
              { title: 'Người chơi thường xuyên', desc: 'Có gói tháng tiết kiệm 25% chi phí và lịch chơi vô cùng linh hoạt.' },
              { title: 'Doanh nghiệp', desc: 'Tuyệt vời để tổ chức giao lưu, team building hoặc các giải đấu nội bộ.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[20px] shadow-sm border border-[#E8E2D2] text-center">
                <h3 className="font-heading text-xl font-bold text-[#111111] mb-3">{item.title}</h3>
                <p className="text-[#555555] text-[14.5px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: THE EXPERIENCE */}
      <section className="py-20 md:py-28 bg-[#FFF9EE]">
        <div className="w-full px-4 md:px-8 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Images Collage */}
            <div className="grid grid-cols-2 gap-4 h-[500px]">
              <div className="col-span-1 row-span-2 relative rounded-[24px] overflow-hidden shadow-lg transform -translate-y-4">
                <Image src="/images/gallery/gallery_action.png" alt="Action Padel" fill className="object-cover" />
              </div>
              <div className="col-span-1 relative rounded-[24px] overflow-hidden shadow-lg">
                <Image src="/images/amenities/parking.png" alt="Parking" fill className="object-cover" />
              </div>
              <div className="col-span-1 relative rounded-[24px] overflow-hidden shadow-lg">
                <Image src="/images/amenities/lounge.png" alt="Lounge" fill className="object-cover" />
              </div>
            </div>
            
            {/* Checklist */}
            <div>
              <h2 className="font-heading text-3xl md:text-[2.5rem] font-bold text-[#111111] mb-8 leading-tight">
                Một buổi chơi trọn vẹn <br/>tại HaloPadel
              </h2>
              <div className="space-y-6">
                {[
                  'Đến sân dễ dàng nhờ vị trí trung tâm.',
                  'Gửi xe miễn phí cực kỳ thuận tiện.',
                  'Check-in nhận sân nhanh chóng.',
                  'Thuê vợt và mua phụ kiện nếu cần.',
                  'Khởi động nhẹ nhàng và vào sân chiến đấu.',
                  'Nghỉ ngơi mát mẻ tại khu vực Lounge sau trận.'
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#D45A2A] text-white flex items-center justify-center shrink-0 font-bold text-[14px]">
                      {i + 1}
                    </div>
                    <p className="text-[#111111] font-semibold text-[16px] md:text-[18px]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: PREMIUM CTA */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/gallery/gallery_hero.png" alt="Background CTA" fill className="object-cover opacity-[0.03] grayscale" />
        </div>
        <div className="w-full px-4 md:px-8 max-w-[800px] mx-auto text-center relative z-10">
          <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-[#111111] mb-6 leading-tight">
            Sẵn sàng trải nghiệm <span className="text-[#D45A2A]">HaloPadel?</span>
          </h2>
          <p className="text-[#555555] text-lg mb-10 max-w-2xl mx-auto">
            Liên hệ ngay để được tư vấn khung giờ phù hợp, nhận ưu đãi hiện có và hướng dẫn di chuyển đến sân một cách nhanh nhất.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={`tel:${venue?.hotline || '0909123456'}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[56px] px-10 bg-[#D45A2A] hover:bg-[#B8431D] text-white rounded-[16px] font-bold text-[16px] transition-transform hover:-translate-y-1 shadow-[0_12px_30px_rgba(212,90,42,0.25)]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Gọi tư vấn
            </a>
            <a 
              href={`https://zalo.me/${venue?.zalo || '0909123456'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[56px] px-10 bg-white border-2 border-[#111111] hover:border-[#D45A2A] text-[#111111] hover:text-[#D45A2A] rounded-[16px] font-bold text-[16px] transition-all shadow-sm"
            >
              Chat Zalo
            </a>
            <Link 
              href="/lien-he"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[56px] px-10 bg-[#F8F5E4] hover:bg-[#F0EAD6] text-[#111111] rounded-[16px] font-bold text-[16px] transition-colors shadow-sm"
            >
              Xem chỉ đường
            </Link>
          </div>
        </div>
      </section>

    </div>
    </>
  )
}
