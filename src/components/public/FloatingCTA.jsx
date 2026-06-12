'use client'

import { useState } from 'react'

export default function FloatingCTA({ venue }) {
  const [isOpen, setIsOpen] = useState(true)

  if (!venue?.hotline && !venue?.zalo && !venue?.googleMapsUrl) return null

  const items = [
    venue?.googleMapsUrl && {
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Chỉ đường',
      href: venue.googleMapsUrl,
      target: '_blank',
    },
    venue?.zalo && {
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      label: 'Zalo',
      href: `https://zalo.me/${venue.zalo}`,
      target: '_blank',
    },
    venue?.hotline && {
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Gọi ngay',
      href: `tel:${venue.hotline}`,
      highlight: true,
    },
  ].filter(Boolean)

  return (
    <>
      {/* ===== DESKTOP: Floating Card ===== */}
      <div
        className={`hidden md:block fixed right-5 z-40 transition-all duration-300 ${
          isOpen
            ? 'bottom-5 opacity-100 translate-y-0'
            : 'bottom-5 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div
          className="w-[220px] rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,253,246,0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid #E8E2D2',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
            <span className="text-[12px] font-semibold text-[#555555] uppercase tracking-wider">
              Liên hệ nhanh
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[#888888] hover:text-[#BE4F24] hover:bg-[#BE4F24]/8 transition-colors"
              aria-label="Đóng"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="px-3 pb-3 space-y-1">
            {items.map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.target}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  item.highlight
                    ? 'bg-[#BE4F24] text-white hover:bg-[#A9411D]'
                    : 'text-[#333333] hover:bg-[#BE4F24]/6 hover:text-[#BE4F24]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    item.highlight
                      ? 'bg-white/20'
                      : 'bg-[#F8F5E4] group-hover:bg-[#BE4F24]/10'
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-[13.5px] font-medium">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Reopen button (desktop) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="hidden md:flex fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: '#BE4F24',
            boxShadow: '0 4px 16px rgba(190,79,36,0.35)',
          }}
          aria-label="Mở liên hệ nhanh"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* ===== MOBILE: Bottom Bar ===== */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: 'rgba(255,253,246,0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid #E8E2D2',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center justify-around py-2 px-2">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.href}
              target={item.target}
              rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
              className={`flex flex-col items-center gap-0.5 flex-1 py-1.5 rounded-xl transition-colors ${
                item.highlight
                  ? 'text-[#BE4F24]'
                  : 'text-[#555555] hover:text-[#BE4F24]'
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                item.highlight ? 'bg-[#BE4F24] text-white' : 'bg-[#F8F5E4]'
              }`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </a>
          ))}
        </div>

        {/* Safe area for bottom notch */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </>
  )
}
