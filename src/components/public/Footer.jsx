import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/constants'

export default function Footer({ venue }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#111111] text-white">
      {/* Main Footer */}
      <div className="section-container py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={venue?.logo || '/images/logo.png'}
                alt={venue?.name || 'HaloPadel'}
                className="w-12 h-12 rounded-full object-cover border border-white/10"
              />
              <div>
                <span className="font-heading font-extrabold text-lg block leading-tight">
                  Halo<span className="text-[#BE4F24]">Padel</span>
                </span>
                <span className="text-[10px] tracking-[0.15em] uppercase text-white/40 font-medium">
                  Sports Club
                </span>
              </div>
            </div>
            <p className="text-white/40 text-[13px] leading-relaxed mb-5">
              {venue?.shortDesc || 'Sân Padel chuyên nghiệp tại Đà Nẵng - Không gian tập luyện đẳng cấp với tiện nghi hiện đại.'}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2.5">
              {venue?.facebook && (
                <a href={venue.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-[#BE4F24] flex items-center justify-center transition-all duration-200" aria-label="Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {venue?.zalo && (
                <a href={`https://zalo.me/${venue.zalo}`} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-[#BE4F24] flex items-center justify-center transition-all duration-200" aria-label="Zalo">
                  <span className="text-[10px] font-bold">Zalo</span>
                </a>
              )}
              {venue?.tiktok && (
                <a href={venue.tiktok} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-[#BE4F24] flex items-center justify-center transition-all duration-200" aria-label="TikTok">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-[15px] mb-5 text-white/90">Liên kết nhanh</h3>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/40 hover:text-[#BE4F24] text-[13px] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-[15px] mb-5 text-white/90">Liên hệ</h3>
            <ul className="space-y-3 text-[13px] text-white/40">
              {venue?.address && (
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 mt-0.5 text-[#BE4F24] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span>{venue.address}</span>
                </li>
              )}
              {venue?.hotline && (
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#BE4F24] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  <a href={`tel:${venue.hotline}`} className="hover:text-[#BE4F24] transition-colors">{venue.hotline}</a>
                </li>
              )}
              {venue?.email && (
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#BE4F24] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
                  <a href={`mailto:${venue.email}`} className="hover:text-[#BE4F24] transition-colors">{venue.email}</a>
                </li>
              )}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-heading font-bold text-[15px] mb-5 text-white/90">Giờ mở cửa</h3>
            <div className="text-[13px] text-white/40 space-y-2.5">
              <div className="flex justify-between">
                <span>Thứ 2 – Thứ 6</span>
                <span className="text-white/80 font-medium">06:00 – 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Thứ 7 – Chủ nhật</span>
                <span className="text-white/80 font-medium">06:00 – 23:00</span>
              </div>
              <div className="mt-4 px-3 py-2.5 rounded-xl bg-[#BE4F24]/10 border border-[#BE4F24]/20 text-[#BE4F24] text-[12px] text-center">
                Mở cửa tất cả các ngày trong tuần
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="section-container py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[12px] text-white/30">
          <p>© {currentYear} {venue?.name || 'HaloPadel'}. Tất cả quyền được bảo lưu.</p>
          <p>Thiết kế & phát triển bởi <span className="text-[#BE4F24]/70">HaloPadel Team</span></p>
        </div>
      </div>
    </footer>
  )
}
