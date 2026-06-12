'use client'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

// Import Mock Data from our announcements list
const mockAnnouncements = [
  {
    id: '1',
    title: 'Thông báo giờ hoạt động mùa hè 2026',
    excerpt: 'HaloPadel chính thức cập nhật khung giờ hoạt động mùa hè để phục vụ cộng đồng đam mê Padel. Mở cửa xuyên suốt từ sáng sớm đến đêm muộn.',
    content: `
      <h2>Chi tiết khung giờ mùa hè</h2>
      <p>Từ ngày 01/06/2026, HaloPadel sẽ áp dụng khung giờ hoạt động mới:</p>
      <ul>
        <li><strong>Thứ 2 - Thứ 6:</strong> 05:00 - 23:00</li>
        <li><strong>Thứ 7 - Chủ Nhật:</strong> 05:00 - 24:00</li>
      </ul>
      <h2>Các dịch vụ đi kèm</h2>
      <p>Nhằm đáp ứng nhu cầu tập luyện tăng cao trong mùa hè, chúng tôi cũng tăng cường đội ngũ huấn luyện viên (HLV) tại sân vào tất cả các khung giờ. Cafe và các dịch vụ F&B sẽ mở cửa phục vụ xuyên suốt thời gian sân hoạt động.</p>
    `,
    type: 'INFO',
    isPinned: true,
    createdAt: new Date('2026-05-28T08:00:00Z'),
    effectiveDate: new Date('2026-06-01T00:00:00Z')
  },
  {
    id: '2',
    title: 'Giải đấu Padel mở rộng tháng 7/2026',
    excerpt: 'Đăng ký ngay giải đấu lớn nhất khu vực với tổng giải thưởng lên đến 50 triệu đồng. Dành cho mọi cấp độ người chơi.',
    content: `
      <h2>Thông tin giải đấu</h2>
      <p>Giải đấu HaloPadel Open 2026 chính thức mở cổng đăng ký từ hôm nay!</p>
      <h2>Thể thức thi đấu</h2>
      <ul>
        <li>Hạng mục: Đôi Nam, Đôi Nữ, Đôi Nam Nữ</li>
        <li>Cấp độ: Amateur (Nghiệp dư) và Pro-Am (Bán chuyên)</li>
        <li>Vòng bảng thi đấu vòng tròn 1 lượt, vòng Knock-out loại trực tiếp.</li>
      </ul>
      <h2>Giải thưởng</h2>
      <p>Tổng giải thưởng tiền mặt lên đến 50.000.000 VNĐ cùng rất nhiều phần quà hiện vật giá trị từ các nhà tài trợ Babolat, Head, Bullpadel.</p>
    `,
    type: 'EVENT',
    isPinned: false,
    createdAt: new Date('2026-06-10T09:00:00Z'),
    effectiveDate: new Date('2026-07-15T00:00:00Z')
  },
  {
    id: '3',
    title: 'Ưu đãi gói tháng đặc biệt cho hội nhóm',
    excerpt: 'Chỉ trong tháng 6 này, đăng ký gói tháng cho nhóm từ 4 người trở lên sẽ được giảm ngay 25% và tặng kèm 2 giờ giao lưu miễn phí.',
    content: `
      <h2>Chương trình ưu đãi</h2>
      <p>Nhân dịp chào hè, HaloPadel tung chương trình khuyến mãi siêu khủng dành cho hội nhóm đam mê Padel.</p>
      <ul>
        <li>Giảm ngay 25% khi đăng ký Gói Tháng (thời hạn 3 tháng trở lên).</li>
        <li>Tặng kèm 2 giờ chơi miễn phí có HLV hướng dẫn nâng cao (trị giá 1.500.000đ).</li>
        <li>Giảm 10% cho tất cả thức uống tại quầy Lounge Bar.</li>
      </ul>
      <p><em>Lưu ý: Số lượng ưu đãi có hạn, chương trình có thể kết thúc sớm khi đủ số lượng đăng ký.</em></p>
    `,
    type: 'PROMO',
    isPinned: false,
    createdAt: new Date('2026-06-05T14:30:00Z'),
    effectiveDate: null
  },
  {
    id: '4',
    title: 'Lịch bảo trì mặt sân định kỳ tuần này',
    excerpt: 'Để đảm bảo chất lượng mặt cỏ tốt nhất, chúng tôi sẽ tiến hành bảo trì sân số 1 và số 2 vào sáng thứ 4 tuần này.',
    content: `
      <h2>Lịch bảo trì mặt sân</h2>
      <p>Nhằm mang lại trải nghiệm đánh bóng mượt mà nhất và bảo vệ tuổi thọ thảm cỏ nhân tạo, đội ngũ kỹ thuật của HaloPadel sẽ tiến hành chải cát và vệ sinh mặt sân.</p>
      <ul>
        <li><strong>Thời gian:</strong> 08:00 - 12:00, Thứ 4 (14/06/2026)</li>
        <li><strong>Khu vực ảnh hưởng:</strong> Sân số 1 và Sân số 2</li>
      </ul>
      <p>Các khách hàng đã đặt lịch vào khung giờ này sẽ được nhân viên CSKH chủ động liên hệ để dời lịch sang sân số 3, 4 hoặc đổi thời gian theo yêu cầu.</p>
    `,
    type: 'INFO',
    isPinned: false,
    createdAt: new Date('2026-06-08T10:00:00Z'),
    effectiveDate: new Date('2026-06-14T00:00:00Z')
  },
  {
    id: '5',
    title: 'Cập nhật quy định mượn/thuê vợt tại sân',
    excerpt: 'Thông báo về chính sách mượn vợt tập luyện mới dành cho học viên và khách vãng lai, áp dụng từ tuần sau.',
    content: `
      <h2>Quy định thuê/mượn vợt mới</h2>
      <p>Để đảm bảo số lượng và chất lượng vợt tập luyện tại sân, BQL HaloPadel xin thông báo cập nhật chính sách như sau:</p>
      <ul>
        <li><strong>Đối với khách vãng lai:</strong> Phí thuê vợt là 50.000đ/cây/buổi. Quý khách vui lòng để lại CCCD hoặc đặt cọc 500.000đ tại quầy lễ tân.</li>
        <li><strong>Đối với học viên mua gói tháng:</strong> Miễn phí mượn vợt trong suốt quá trình tập luyện.</li>
        <li>Khách hàng làm gãy, nứt hoặc hư hỏng nặng khung vợt do cố ý đập vợt sẽ phải bồi thường 100% giá trị vợt hiện hành.</li>
      </ul>
    `,
    type: 'RULE',
    isPinned: false,
    createdAt: new Date('2026-06-02T16:00:00Z'),
    effectiveDate: new Date('2026-06-15T00:00:00Z')
  },
  {
    id: '6',
    title: 'Khai giảng lớp Padel cơ bản K12',
    excerpt: 'Lớp học dành cho người mới bắt đầu, trang bị kiến thức luật chơi, kỹ thuật cầm vợt và di chuyển cơ bản.',
    content: `
      <h2>Thông tin khóa học cơ bản K12</h2>
      <p>Bạn muốn thử sức với Padel nhưng chưa biết bắt đầu từ đâu? Khóa học Padel Basic K12 chính là lựa chọn hoàn hảo dành cho bạn!</p>
      <ul>
        <li><strong>Giáo trình:</strong> 10 buổi (Mỗi buổi 90 phút)</li>
        <li><strong>Nội dung:</strong> Luật chơi, cách tính điểm, kỹ thuật Forehand/Backhand cơ bản, luật bật tường (Wall play) và giao bóng.</li>
        <li><strong>Giáo viên:</strong> HLV Quốc tế được cấp chứng nhận từ Padel Federation.</li>
      </ul>
      <p>Vui lòng liên hệ Hotline hoặc inbox Fanpage để đăng ký ngay. Giới hạn 4 học viên / lớp để đảm bảo chất lượng giảng dạy.</p>
    `,
    type: 'EVENT',
    isPinned: false,
    createdAt: new Date('2026-05-25T11:00:00Z'),
    effectiveDate: new Date('2026-06-20T00:00:00Z')
  }
]

const getTypeStyle = (type) => {
  switch (type) {
    case 'INFO': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Lịch hoạt động', icon: 'ℹ️' }
    case 'EVENT': return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Sự kiện', icon: '🏆' }
    case 'PROMO': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Ưu đãi', icon: '🎁' }
    case 'RULE': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Quy định', icon: '⚠️' }
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Thông báo', icon: '📌' }
  }
}

export default function AnnouncementDetailPage() {
  const params = useParams()
  const slug = params?.slug // In thong-bao/page.js we pass id as slug parameter

  const post = mockAnnouncements.find(a => a.id === slug)

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FFFDF6]">
        <h1 className="text-4xl font-bold text-[#111111] mb-4">404 - Không tìm thấy</h1>
        <p className="text-[#555555] mb-8">Thông báo bạn đang tìm không tồn tại hoặc đã bị gỡ.</p>
        <Link href="/thong-bao" className="px-6 py-3 bg-[#111111] text-white rounded-full font-bold">
          Quay lại Bảng tin
        </Link>
      </div>
    )
  }

  const typeStyle = getTypeStyle(post.type)
  const relatedPosts = mockAnnouncements.filter(a => a.id !== post.id).slice(0, 3)

  return (
    <div className="py-12 md:py-24 bg-[#FFFDF6] min-h-screen">
      <div className="w-full px-4 md:px-8 max-w-[800px] mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-semibold mb-10 text-[#888888]">
          <Link href="/thong-bao" className="hover:text-[#D45A2A] transition-colors">Thông báo</Link>
          <span>/</span>
          <span className="text-[#111111]">{typeStyle.label}</span>
        </div>

        {/* Paper Card */}
        <div className="bg-white rounded-[32px] p-8 md:p-14 shadow-sm border border-[#E8E2D2]">
          
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider ${typeStyle.bg} ${typeStyle.text} flex items-center gap-2`}>
              <span>{typeStyle.icon}</span>
              {typeStyle.label}
            </span>
            {post.isPinned && (
              <span className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Quan trọng
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl md:text-[40px] font-bold text-[#111111] leading-tight mb-8">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pb-8 border-b border-[#E8E2D2] mb-10">
            <div className="flex items-center gap-2 text-[14px] text-[#555555]">
              <svg className="w-4 h-4 text-[#888888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Đăng lúc: <strong>{formatDate(post.createdAt)}</strong></span>
            </div>
            
            {post.effectiveDate && (
              <div className="flex items-center gap-2 text-[14px] text-[#111111] bg-[#F8F5E4] px-4 py-2 rounded-lg font-medium">
                <svg className="w-4 h-4 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Ngày áp dụng: <strong className="text-[#D45A2A]">{formatDate(post.effectiveDate)}</strong></span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-[#111111] prose-p:text-[#555555] prose-p:leading-[1.8] prose-li:text-[#555555] prose-strong:text-[#111111]">
            <p className="text-xl text-[#111111] font-medium leading-relaxed mb-10">
              {post.excerpt}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Footer Signature */}
          <div className="mt-16 pt-8 border-t border-[#E8E2D2] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="font-heading font-bold text-lg text-[#111111]">Ban Quản Lý HaloPadel</p>
              <p className="text-[14px] text-[#888888]">Trân trọng thông báo!</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-[#E8E2D2] flex items-center justify-center text-[#555555] hover:bg-[#D45A2A] hover:text-white hover:border-[#D45A2A] transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-10 text-center">
          <Link href="/thong-bao" className="inline-flex items-center gap-2 text-[#555555] font-bold hover:text-[#D45A2A] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại tất cả thông báo
          </Link>
        </div>

      </div>
    </div>
  )
}
