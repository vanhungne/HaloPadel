import Link from 'next/link'
import { getDashboardStats } from '@/actions/dashboard'

export default async function AdminDashboard() {
  const data = await getDashboardStats()

  const stats = [
    {
      id: 1,
      title: 'Khách liên hệ mới',
      value: data.newContactsCount.toString(),
      trend: `+${data.todayContactsCount} hôm nay`,
      trendColor: 'text-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bg: 'bg-blue-50 text-blue-600',
      href: '/admin/contacts'
    },
    {
      id: 2,
      title: 'Khuyến mãi đang chạy',
      value: data.activePromotionsCount.toString(),
      trend: 'Xem chi tiết chiến dịch',
      trendColor: 'text-orange-600',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      bg: 'bg-green-50 text-green-600',
      href: '/admin/promotions'
    },
    {
      id: 3,
      title: 'Bài viết Blog',
      value: data.blogPostsCount.toString(),
      trend: 'Đã xuất bản',
      trendColor: 'text-[#888888]',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
        </svg>
      ),
      bg: 'bg-orange-50 text-orange-600',
      href: '/admin/blog'
    }
  ]

  const recentContacts = data.recentContacts

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#111111]">
          Tổng quan hệ thống
        </h1>
        <p className="text-[#555555] mt-2">
          Chào mừng trở lại! Dưới đây là tóm tắt hoạt động của HaloPadel hôm nay.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Link key={stat.id} href={stat.href} className="bg-white p-6 rounded-2xl border border-[#E8E2D2] shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>
              <span className="text-[12px] font-medium text-[#888888] bg-[#F8F5E4] px-2.5 py-1 rounded-full group-hover:bg-[#111111] group-hover:text-white transition-colors">
                Xem chi tiết
              </span>
            </div>
            <div>
              <h3 className="text-[32px] font-bold text-[#111111] leading-none mb-2">{stat.value}</h3>
              <p className="text-[15px] font-medium text-[#555555] mb-2">{stat.title}</p>
              <p className={`text-[13px] font-medium ${stat.trendColor}`}>{stat.trend}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Contacts */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E2D2] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E8E2D2] flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-[#111111]">Khách hàng vừa liên hệ</h2>
            <Link href="/admin/contacts" className="text-[13px] font-bold text-[#D45A2A] hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#F8F5E4]/50 border-b border-[#E8E2D2]">
                  <th className="py-3 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Khách hàng</th>
                  <th className="py-3 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Số điện thoại</th>
                  <th className="py-3 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Thời gian</th>
                  <th className="py-3 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D2]">
                {recentContacts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-[#888888]">Chưa có khách hàng liên hệ</td>
                  </tr>
                ) : (
                  recentContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-[#F8F5E4]/30 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#111111]">{contact.name}</td>
                      <td className="py-4 px-6 text-[#555555]">{contact.phone}</td>
                      <td className="py-4 px-6 text-[#555555] text-[14px]">{formatTime(contact.time)}</td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold ${
                          contact.status === 'NEW' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {contact.status === 'NEW' ? 'Mới' : 'Đã liên hệ'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="bg-white rounded-2xl border border-[#E8E2D2] shadow-sm p-6">
          <h2 className="font-heading font-bold text-lg text-[#111111] mb-6">Thao tác nhanh</h2>
          <div className="space-y-3">
            <Link href="/admin/blog" className="flex items-center gap-3 p-4 rounded-xl border border-[#E8E2D2] hover:border-[#D45A2A] hover:bg-[#FFF9EE] transition-all group">
              <div className="w-10 h-10 rounded-full bg-[#F8F5E4] group-hover:bg-[#D45A2A] group-hover:text-white flex items-center justify-center text-[#555555] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#111111] text-[15px]">Viết bài Blog mới</p>
                <p className="text-[13px] text-[#888888]">Đăng tin tức SEO</p>
              </div>
            </Link>

            <Link href="/admin/promotions" className="flex items-center gap-3 p-4 rounded-xl border border-[#E8E2D2] hover:border-[#D45A2A] hover:bg-[#FFF9EE] transition-all group">
              <div className="w-10 h-10 rounded-full bg-[#F8F5E4] group-hover:bg-[#D45A2A] group-hover:text-white flex items-center justify-center text-[#555555] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#111111] text-[15px]">Tạo Khuyến mãi</p>
                <p className="text-[13px] text-[#888888]">Kích cầu doanh thu</p>
              </div>
            </Link>

            <Link href="/admin/venue" className="flex items-center gap-3 p-4 rounded-xl border border-[#E8E2D2] hover:border-[#111111] hover:bg-[#F8F5E4] transition-all group">
              <div className="w-10 h-10 rounded-full bg-[#F8F5E4] group-hover:bg-[#111111] group-hover:text-white flex items-center justify-center text-[#555555] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#111111] text-[15px]">Cập nhật thông tin sân</p>
                <p className="text-[13px] text-[#888888]">Giờ mở cửa, Hotline...</p>
              </div>
            </Link>

          </div>
        </div>
      </div>

    </div>
  )
}
