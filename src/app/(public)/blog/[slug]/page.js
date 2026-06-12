'use client'

import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

// Import Mock Data from our blog list
const mockBlogs = [
  {
    id: 'padel-la-gi',
    title: 'Padel là gì? Tổng quan về môn thể thao đang hot nhất 2026',
    slug: 'padel-la-gi',
    excerpt: 'Padel là môn thể thao kết hợp giữa tennis và squash, đang phát triển mạnh mẽ trên toàn thế giới và đặc biệt bùng nổ tại Việt Nam trong năm 2026. Bài viết này sẽ giúp bạn hiểu rõ luật chơi cơ bản, điểm hấp dẫn và vì sao bạn nên bắt đầu chơi Padel ngay hôm nay.',
    content: `
      <h2>1. Padel là môn thể thao gì?</h2>
      <p>Padel là một môn thể thao dùng vợt, thường được mô tả là sự kết hợp hoàn hảo giữa Tennis và Squash. Sân Padel có kích thước bằng khoảng 1/3 sân tennis, được bao quanh bởi các bức tường kính hoặc lưới thép. Giống như Squash, bạn có thể đánh bóng bật tường.</p>
      <h2>2. Tại sao Padel lại "gây sốt"?</h2>
      <p>Điểm hấp dẫn nhất của Padel là sự thân thiện với người mới. Nếu như Tennis đòi hỏi nhiều tháng để tập kỹ thuật cơ bản, thì với Padel, bạn có thể bắt nhịp và chơi một trận đấu thú vị chỉ sau 1-2 buổi tập. Môn này cũng thiên về chiến thuật và sự khéo léo thay vì thuần sức mạnh.</p>
      <h2>3. Dụng cụ chơi Padel</h2>
      <p>Vợt Padel không có lưới cước như tennis mà là một mặt phẳng liền khối làm từ vật liệu carbon hoặc sợi thủy tinh, có đục các lỗ nhỏ để giảm sức cản không khí. Bóng Padel thoạt nhìn giống bóng tennis nhưng có áp suất thấp hơn một chút.</p>
      <blockquote>"Padel không chỉ là môn thể thao, nó là một lối sống. Sự gắn kết xã hội sau mỗi trận đấu mới là thứ khiến người ta say mê."</blockquote>
    `,
    category: 'KIẾN THỨC PADEL',
    author: 'HaloPadel Team',
    readTime: '5 phút đọc',
    thumbnail: '/images/gallery/gallery_action.png',
    createdAt: new Date('2026-06-12T10:00:00Z'),
    isFeatured: true
  },
  {
    id: '5-loi-ich-suc-khoe',
    title: '5 lợi ích sức khỏe tuyệt vời khi chơi Padel thường xuyên',
    slug: '5-loi-ich-suc-khoe-choi-padel',
    excerpt: 'Chơi Padel không chỉ vui mà còn mang lại nhiều lợi ích sức khỏe đáng kinh ngạc cho hệ tim mạch, xương khớp và tinh thần của bạn.',
    content: `
      <h2>1. Cải thiện sức khỏe tim mạch</h2>
      <p>Một trận Padel kéo dài 90 phút sẽ khiến bạn di chuyển liên tục, giúp nhịp tim được duy trì ở mức đốt mỡ và tăng cường sức bền một cách tự nhiên.</p>
      <h2>2. Giảm căng thẳng hiệu quả</h2>
      <p>Tính xã hội cao của Padel (luôn chơi đánh đôi) giúp bạn kết nối với bạn bè, giải phóng endorphin và xua tan mọi áp lực công việc.</p>
      <h2>3. Tăng cường phản xạ</h2>
      <p>Không gian sân nhỏ và bóng bật tường đòi hỏi người chơi phải phản xạ cực nhanh. Qua thời gian, sự nhạy bén của bạn sẽ tăng lên đáng kể.</p>
    `,
    category: 'SỨC KHỎE & THỂ THAO',
    author: 'HaloPadel Team',
    readTime: '4 phút đọc',
    thumbnail: '/images/gallery/gallery_match.png',
    createdAt: new Date('2026-06-11T14:30:00Z'),
    isFeatured: false
  },
  {
    id: 'luat-choi-co-ban',
    title: 'Luật chơi Padel cơ bản dành cho người mới bắt đầu',
    slug: 'luat-choi-padel-co-ban',
    excerpt: 'Hướng dẫn chi tiết từ cách tính điểm, cách giao bóng đến các quy định về tường kính trong môn Padel.',
    content: `
      <h2>Cách tính điểm</h2>
      <p>Padel có hệ thống tính điểm hoàn toàn giống Tennis: 15, 30, 40 và Game. Nếu hòa 40-40 sẽ đánh điểm lợi thế (Ad) hoặc điểm vàng (Golden Point) tùy quy định của giải.</p>
      <h2>Giao bóng (Serve)</h2>
      <p>Khác biệt lớn nhất: Giao bóng trong Padel luôn được thực hiện ở vị trí <strong>thấp hơn thắt lưng</strong> và bóng phải nảy trên mặt đất trước khi vợt chạm vào bóng. Bạn có 2 cơ hội giao bóng mỗi điểm.</p>
      <h2>Luật bật tường</h2>
      <p>Trong quá trình đánh bóng qua lại, bóng phải nảy trên sân trước khi chạm vào tường hoặc kính. Bạn cũng có thể chủ động đánh bóng vào tường sân mình để bóng dội ngược sang sân đối phương (Boast).</p>
    `,
    category: 'KIẾN THỨC PADEL',
    author: 'HaloPadel Team',
    readTime: '6 phút đọc',
    thumbnail: '/images/gallery/gallery_serve.png',
    createdAt: new Date('2026-06-10T09:15:00Z'),
    isFeatured: false
  },
  {
    id: 'nguoi-moi-can-chuan-bi-gi',
    title: 'Người mới chơi Padel cần chuẩn bị những dụng cụ gì?',
    slug: 'nguoi-moi-choi-padel-can-chuan-bi-gi',
    excerpt: 'Từ vợt, giày đến trang phục, đây là danh sách những món đồ "must-have" trước khi bạn ra sân Padel lần đầu tiên.',
    content: `
      <h2>1. Vợt Padel</h2>
      <p>Người mới nên chọn vợt hình tròn (Round shape) vì vùng điểm ngọt (Sweet spot) rộng lớn, giúp bạn dễ dàng kiểm soát bóng hơn.</p>
      <h2>2. Giày chơi Padel</h2>
      <p>Giày là vật dụng quan trọng nhất. Nên chọn loại giày có đế gai hình xương cá (Herringbone) hoặc đế dạng chấm bi (Omni) để bám sân tốt, tránh trơn trượt do cát rải trên mặt cỏ.</p>
      <h2>3. Trang phục</h2>
      <p>Trang phục thể thao thoải mái, thấm hút mồ hôi. Một chiếc mũ lưỡi trai và kem chống nắng là không thể thiếu nếu bạn chơi sân ngoài trời ban ngày.</p>
    `,
    category: 'KIẾN THỨC PADEL',
    author: 'HaloPadel Team',
    readTime: '3 phút đọc',
    thumbnail: '/images/gallery/gallery_racket.png',
    createdAt: new Date('2026-06-08T16:45:00Z'),
    isFeatured: false
  },
  {
    id: 'choi-padel-o-da-nang',
    title: 'Chơi Padel ở Đà Nẵng: Địa điểm, chi phí và kinh nghiệm',
    slug: 'choi-padel-o-da-nang',
    excerpt: 'Review chi tiết về phong trào Padel tại Đà Nẵng, các sân chơi nổi bật, chi phí thuê sân và cách đặt lịch dễ dàng nhất.',
    content: `
      <h2>Sự bùng nổ của Padel tại Đà Nẵng</h2>
      <p>Năm 2026, Đà Nẵng chứng kiến sự xuất hiện của hàng loạt sân Padel đạt tiêu chuẩn quốc tế. Cảnh quan thành phố biển cộng hưởng với tính chất sôi động của Padel đã tạo nên một cộng đồng người chơi khổng lồ.</p>
      <h2>Đến HaloPadel Sports Club</h2>
      <p>Là một trong những cụm sân tiên phong và đẳng cấp nhất, HaloPadel cung cấp cơ sở vật chất 5 sao với mặt cỏ nhập khẩu, đèn LED chống chói và khu Lounge cafe thư giãn cực chill.</p>
    `,
    category: 'TIN TỨC SÂN',
    author: 'HaloPadel Team',
    readTime: '7 phút đọc',
    thumbnail: '/images/gallery/gallery_sunset.png',
    createdAt: new Date('2026-06-05T11:20:00Z'),
    isFeatured: false
  },
  {
    id: 'kinh-nghiem-chon-khung-gio',
    title: 'Kinh nghiệm chọn khung giờ chơi Padel phù hợp nhất',
    slug: 'kinh-nghiem-chon-khung-gio-choi-padel',
    excerpt: 'Nên chơi buổi sáng sớm, chiều tà hay tối muộn? Phân tích ưu nhược điểm của từng khung giờ tập luyện.',
    content: `
      <h2>1. Sáng sớm (6:00 - 8:00)</h2>
      <p>Khung giờ vàng cho dân văn phòng khởi động ngày mới. Thời tiết mát mẻ, ít gió và tĩnh lặng.</p>
      <h2>2. Chiều tà (16:00 - 18:00)</h2>
      <p>Đông vui, nhộn nhịp nhất nhưng thường phải đặt sân trước rất sớm. Trải nghiệm đánh dưới ánh hoàng hôn cực kỳ lãng mạn.</p>
      <h2>3. Tối muộn (20:00 - 22:00)</h2>
      <p>Thời điểm để xả stress sau một ngày dài. Các sân dưới hệ thống đèn LED sẽ mang lại cảm giác cực kỳ chuyên nghiệp và tập trung.</p>
    `,
    category: 'SỨC KHỎE & THỂ THAO',
    author: 'HaloPadel Team',
    readTime: '4 phút đọc',
    thumbnail: '/images/gallery/gallery_night.png',
    createdAt: new Date('2026-06-03T08:00:00Z'),
    isFeatured: false
  },
  {
    id: 'cac-loi-thuong-gap',
    title: '5 lỗi kỹ thuật thường gặp khi mới chuyển từ Tennis sang Padel',
    slug: 'cac-loi-thuong-gap-khi-choi-padel',
    excerpt: 'Rất nhiều người chơi Tennis chuyển sang Padel mắc phải những sai lầm này. Hãy đọc để biết cách khắc phục ngay.',
    content: `
      <h2>1. Đánh quá mạnh</h2>
      <p>Trong Padel, đánh mạnh không bằng đánh hiểm. Việc đập bóng quá sức thường khiến bóng dội tường bật ngược lại cao và tạo cơ hội để đối phương ghi điểm.</p>
      <h2>2. Cầm vợt quá lỏng</h2>
      <p>Vợt Padel nặng hơn một chút so với vợt tennis và không có cước nên độ rung lớn. Cần cầm chắc cán vợt (Continental grip).</p>
      <h2>3. Quên không sử dụng tường</h2>
      <p>Nhiều tay vợt tennis cố gắng chạy lùi thật nhanh để đỡ bóng thay vì đợi bóng chạm tường nảy ra phía trước. Hãy làm bạn với bức tường kính!</p>
    `,
    category: 'KIẾN THỨC PADEL',
    author: 'HaloPadel Team',
    readTime: '5 phút đọc',
    thumbnail: '/images/gallery/gallery_action.png',
    createdAt: new Date('2026-06-01T15:10:00Z'),
    isFeatured: false
  }
]

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params?.slug

  const post = mockBlogs.find(b => b.slug === slug)

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FFFDF6]">
        <h1 className="text-4xl font-bold text-[#111111] mb-4">404 - Không tìm thấy</h1>
        <p className="text-[#555555] mb-8">Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
        <Link href="/blog" className="px-6 py-3 bg-[#D45A2A] text-white rounded-full font-bold">
          Quay lại danh sách Blog
        </Link>
      </div>
    )
  }

  // Related posts (excluding current)
  const relatedPosts = mockBlogs.filter(b => b.slug !== slug).slice(0, 3)

  return (
    <div className="py-12 md:py-24 bg-[#FFFDF6] min-h-screen">
      <div className="w-full px-4 md:px-8 max-w-[900px] mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-semibold mb-8 text-[#888888]">
          <Link href="/blog" className="hover:text-[#D45A2A] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[#D45A2A] uppercase tracking-wider">{post.category}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#111111] mb-6 leading-[1.15]">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 pt-6 border-t border-[#E8E2D2]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#111111] flex items-center justify-center text-white font-bold text-lg">
                H
              </div>
              <div>
                <p className="text-[#111111] font-bold text-[15px]">{post.author}</p>
                <div className="flex items-center gap-3 text-[13px] text-[#888888] font-medium mt-0.5">
                  <span>{formatDate(post.createdAt)}</span>
                  <span className="w-1 h-1 rounded-full bg-[#E8E2D2]" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="ml-auto flex gap-2">
              <button className="w-10 h-10 rounded-full border border-[#E8E2D2] flex items-center justify-center text-[#555555] hover:bg-[#D45A2A] hover:text-white hover:border-[#D45A2A] transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button className="w-10 h-10 rounded-full border border-[#E8E2D2] flex items-center justify-center text-[#555555] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13v-3h3v3h-3zm0 4h3v-3h-3v3zm-4-4h3v-3H8v3zm0 4h3v-3H8v3zm0-8h3V6H8v3zm4-4v3h3V6h-3zM8 2H6v2H4v2H2v14h20V6h-2V4h-2V2h-2v2h-4V2z" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-[32px] overflow-hidden shadow-sm border border-[#E8E2D2] mb-12">
          <Image 
            src={post.thumbnail} 
            alt={post.title} 
            fill 
            className="object-cover"
            priority
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-[#111111] prose-p:text-[#555555] prose-p:leading-[1.8] prose-a:text-[#D45A2A] prose-blockquote:border-l-4 prose-blockquote:border-[#D45A2A] prose-blockquote:bg-[#FFF9EE] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:font-medium prose-blockquote:text-[#111111] prose-blockquote:not-italic">
          <p className="text-xl md:text-2xl text-[#111111] font-medium leading-relaxed mb-10">
            {post.excerpt}
          </p>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="w-full px-4 md:px-8 max-w-[1200px] mx-auto mt-24">
          <div className="flex items-center justify-between mb-10 border-t border-[#E8E2D2] pt-12">
            <h2 className="font-heading text-3xl font-bold text-[#111111]">
              Bài viết cùng chủ đề
            </h2>
            <Link href="/blog" className="hidden sm:inline-flex items-center gap-2 text-[#D45A2A] font-bold hover:gap-3 transition-all">
              Xem tất cả <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((blog) => (
              <Link 
                key={blog.id} 
                href={`/blog/${blog.slug}`}
                className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-[#E8E2D2] transition-all duration-300 flex flex-col"
              >
                <div className="relative w-full h-[220px] overflow-hidden">
                  <Image 
                    src={blog.thumbnail} 
                    alt={blog.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#111111] px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    {blog.category}
                  </div>
                </div>
                
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <h3 className="font-heading text-xl font-bold text-[#111111] mb-3 leading-snug group-hover:text-[#D45A2A] transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-[#555555] text-[15px] mb-6 line-clamp-3 leading-relaxed flex-1">
                    {blog.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-[#E8E2D2] pt-5">
                    <span className="text-[#888888] text-[12px] font-medium">
                      {formatDate(blog.createdAt)}
                    </span>
                    <span className="text-[#D45A2A] font-bold text-[13px] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Đọc tiếp <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
