'use client'

import { useState } from 'react'
import ContactModal from '@/components/public/ContactModal'

export default function FloatingCTA({ venue }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!venue?.hotline && !venue?.zalo && !venue?.googleMapsUrl) return null

  const items = [
    {
      isButton: true,
      onClick: () => setIsModalOpen(true),
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      label: 'Tư vấn',
      highlight: false,
    },
    venue?.hotline && {
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Gọi ngay',
      href: `tel:${venue.hotline}`,
      highlight: true,
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
  ].filter(Boolean)

  return (
    <>
      {/* ===== DESKTOP: Vertical Quick Action ===== */}
      <div className="hidden md:flex fixed right-[32px] bottom-[36px] z-40 flex-col gap-[14px] items-end pointer-events-none">
        {items.map((item, i) => {
          const className = `pointer-events-auto flex items-center justify-center gap-3 h-[48px] px-4 rounded-full transition-all duration-300 hover:-translate-y-1 overflow-hidden group ${
            item.highlight
              ? 'bg-[#D45A2A] text-white hover:bg-[#B8431D]'
              : 'bg-white text-[#555555] hover:text-[#D45A2A]'
          }`
          const style = {
            boxShadow: item.highlight 
              ? '0 8px 24px rgba(212, 90, 42, 0.35)' 
              : '0 4px 16px rgba(0,0,0,0.08)',
            border: item.highlight ? 'none' : '1px solid rgba(58, 36, 24, 0.15)',
          }

          if (item.isButton) {
            return (
              <button key={i} onClick={item.onClick} className={className} style={style}>
                <div className="shrink-0">{item.icon}</div>
                <span className="text-[14px] font-bold whitespace-nowrap overflow-hidden w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 transition-all duration-300">
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <a
              key={i}
              href={item.href}
              target={item.target}
              rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
              className={className}
              style={style}
            >
              <div className="shrink-0">{item.icon}</div>
              <span className="text-[14px] font-bold whitespace-nowrap overflow-hidden w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 transition-all duration-300">
                {item.label}
              </span>
            </a>
          )
        })}
      </div>

      {/* ===== MOBILE: Bottom Sticky Bar ===== */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: 'rgba(255, 249, 238, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(58, 36, 24, 0.08)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
        }}
      >

        <div className="flex items-center justify-around py-2 px-3 gap-2" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
          {items.map((item, i) => {
            const className = `flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl transition-colors ${
              item.highlight
                ? 'bg-[#D45A2A] text-white'
                : 'bg-white text-[#555555] border border-[rgba(58,36,24,0.08)]'
            }`

            if (item.isButton) {
              return (
                <button key={i} onClick={item.onClick} className={className}>
                  {item.icon}
                  <span className={`text-[12px] font-bold ${item.highlight ? 'text-white' : 'text-[#333333]'}`}>
                    {item.label}
                  </span>
                </button>
              )
            }

            return (
              <a
                key={i}
                href={item.href}
                target={item.target}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                className={className}
              >
                {item.icon}
                <span className={`text-[12px] font-bold ${item.highlight ? 'text-white' : 'text-[#333333]'}`}>
                  {item.label}
                </span>
              </a>
            )
          })}
        </div>

        {/* Safe area spacer for iOS bottom notch - use padding instead */}
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
