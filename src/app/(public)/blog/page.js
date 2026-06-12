'use client'

import { useState } from 'react'
import { VENUE_ID } from '@/lib/constants'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

// Mock Data for SEO Blog Hub
const mockBlogs = [
  {
    id: 'padel-la-gi',
    title: 'Padel là gì? Tổng quan về môn thể thao đang hot nhất 2026',
    slug: 'padel-la-gi',
    excerpt: 'Padel là môn thể thao kết hợp giữa tennis và squash, đang phát triển mạnh mẽ trên toàn thế giới và đặc biệt bùng nổ tại Việt Nam trong năm 2026. Bài viết này sẽ giúp bạn hiểu rõ luật chơi cơ bản, điểm hấp dẫn và vì sao bạn nên bắt đầu chơi Padel ngay hôm nay.',
    content: '...',
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
    content: '...',
    category: 'SỨC KHỎE & THỂ THAO',
    author: 'HaloPadel Team',
    readTime: '4 phút đọc',
    thumbnail: '/images/gallery/gallery_match.png', // Assuming we have some generic fallback, we'll use action again
    createdAt: new Date('2026-06-11T14:30:00Z'),
    isFeatured: false
  },
  {
    id: 'luat-choi-co-ban',
    title: 'Luật chơi Padel cơ bản dành cho người mới bắt đầu',
    slug: 'luat-choi-padel-co-ban',
    excerpt: 'Hướng dẫn chi tiết từ cách tính điểm, cách giao bóng đến các quy định về tường kính trong môn Padel.',
    content: '...',
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
    content: '...',
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
    content: '...',
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
    content: '...',
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
    content: '...',
    category: 'KIẾN THỨC PADEL',
    author: 'HaloPadel Team',
    readTime: '5 phút đọc',
    thumbnail: '/images/gallery/gallery_action.png',
    createdAt: new Date('2026-06-01T15:10:00Z'),
    isFeatured: false
  }
]

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'KIẾN THỨC PADEL', label: 'Kiến thức Padel' },
    { id: 'TIN TỨC SÂN', label: 'Tin tức sân' },
    { id: 'SỨC KHỎE & THỂ THAO', label: 'Sức khỏe & Thể thao' },
  ]

  // Filter by tab and search
  const filteredBlogs = mockBlogs.filter(blog => {
    const matchTab = activeTab === 'ALL' || blog.category === activeTab
    const matchSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchTab && matchSearch
  })

  // Separate Featured
  // If user is searching or filtering by a specific tab, we might not show the layout as Featured + Grid.
  // But for standard view, we do.
  const isDefaultView = activeTab === 'ALL' && searchQuery === ''
  const featuredBlog = filteredBlogs.find(b => b.isFeatured)
  const listBlogs = isDefaultView ? filteredBlogs.filter(b => !b.isFeatured) : filteredBlogs

  // Fallback image helper if the specific one doesn't exist (since we mock paths)
  const getImageUrl = (path) => {
    // If it doesn't exist, Next.js Image component might throw an error or show broken image
    // For the sake of the demo, we use a single known good image if others fail, but we'll try to use the ones provided.
    // In a real app, these would come from DB. We'll use gallery_action.png as a safe fallback.
    return path || '/images/gallery/gallery_action.png'
  }

  return (
    <div className="py-12 md:py-20 bg-[#FFFDF6] min-h-screen">
      <div className="w-full px-4 md:px-8 max-w-[1200px] mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[13px] font-semibold text-[#D45A2A] uppercase tracking-[0.2em] mb-3">
            HaloPadel
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] font-bold text-[#111111] mb-4">
            Blog & Kiến Thức
          </h1>
          <p className="text-[#555555] text-lg">
            Khám phá kiến thức, hướng dẫn chơi và tin tức cộng đồng Padel
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-16 border-b border-[#E8E2D2] pb-8">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2 rounded-full text-[14px] font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#111111] text-white shadow-md' 
                      : 'bg-transparent text-[#888888] hover:bg-[#F8F5E4] hover:text-[#111111]'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-[350px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[#888888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm bài viết, luật chơi, sức khỏe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-[#E8E2D2] text-[#111111] placeholder-[#888888] focus:outline-none focus:border-[#D45A2A] focus:ring-1 focus:ring-[#D45A2A] transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[24px] border border-[#E8E2D2]">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-[#888888] text-lg">Không tìm thấy bài viết nào phù hợp.</p>
          </div>
        )}

        {/* Featured Article (Only show if default view and exists) */}
        {isDefaultView && featuredBlog && (
          <Link href={`/blog/${featuredBlog.slug}`} className="group block mb-16">
            <div className="flex flex-col lg:flex-row bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[#E8E2D2] transition-all duration-500">
              {/* Image */}
              <div className="relative w-full lg:w-[55%] h-[350px] lg:h-auto overflow-hidden">
                <Image 
                  src={getImageUrl(featuredBlog.thumbnail)} 
                  alt={featuredBlog.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
              </div>
              {/* Content */}
              <div className="w-full lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-[#FFF9EE] text-[#D45A2A] px-3 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase">
                    {featuredBlog.category}
                  </span>
                  <span className="text-[#888888] text-[13px] font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {featuredBlog.readTime}
                  </span>
                </div>
                
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#111111] mb-4 leading-tight group-hover:text-[#D45A2A] transition-colors">
                  {featuredBlog.title}
                </h2>
                
                <p className="text-[#555555] text-lg mb-8 leading-relaxed">
                  {featuredBlog.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto pt-8 border-t border-[#E8E2D2]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-white font-bold text-sm">
                      H
                    </div>
                    <div>
                      <p className="text-[#111111] font-bold text-[14px]">{featuredBlog.author}</p>
                      <p className="text-[#888888] text-[12px]">{formatDate(featuredBlog.createdAt)}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center justify-center bg-[#111111] group-hover:bg-[#D45A2A] text-white w-12 h-12 rounded-full transition-colors shadow-md">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grid Articles */}
        {listBlogs.length > 0 && (
          <div>
            {isDefaultView && (
              <h3 className="font-heading text-2xl font-bold text-[#111111] mb-8 flex items-center gap-3">
                Bài viết mới nhất
                <div className="h-px bg-[#E8E2D2] flex-1"></div>
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listBlogs.map((blog) => (
                <Link 
                  key={blog.id} 
                  href={`/blog/${blog.slug}`}
                  className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-[#E8E2D2] transition-all duration-300 flex flex-col"
                >
                  <div className="relative w-full h-[220px] overflow-hidden">
                    <Image 
                      src={getImageUrl(blog.thumbnail)} 
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
    </div>
  )
}
