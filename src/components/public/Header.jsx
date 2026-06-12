'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { NAV_ITEMS } from '@/lib/constants'

export default function Header({ venue }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-[#F8F5E4] border-b border-[#E8E2D2]"
      style={{
        boxShadow: isScrolled ? '0 2px 16px rgba(0,0,0,0.06)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div className="section-container">
        <div className="flex items-center justify-between" style={{ height: '76px' }}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src={venue?.logo || '/images/logo.png'}
              alt={venue?.name || 'HaloPadel'}
              className="h-11 w-11 rounded-full object-cover border border-[#E8E2D2] group-hover:border-[#BE4F24] transition-colors duration-200"
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-heading font-extrabold text-[17px] text-[#111111] tracking-tight">
                Halo<span className="text-[#BE4F24]">Padel</span>
              </span>
              <span className="text-[10px] tracking-[0.18em] uppercase text-[#888888] font-medium mt-0.5">
                Sports Club
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 rounded-lg text-[13.5px] font-medium text-[#333333] hover:text-[#BE4F24] hover:bg-[#BE4F24]/5 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Hotline + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Hotline pill */}
            {venue?.hotline && (
              <a
                href={`tel:${venue.hotline}`}
                className="hidden md:inline-flex items-center gap-2 h-10 px-5 bg-[#BE4F24] hover:bg-[#A9411D] text-white rounded-full text-sm font-semibold transition-all duration-200"
                style={{ boxShadow: '0 2px 8px rgba(190,79,36,0.25)' }}
              >
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {venue.hotline}
              </a>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#E8E2D2]/60 transition-colors"
              aria-label="Menu"
            >
              <svg className="w-[22px] h-[22px] text-[#333333]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-[26rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#F8F5E4] border-t border-[#E8E2D2] px-4 py-3">
          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-[15px] text-[#333333] font-medium hover:text-[#BE4F24] hover:bg-[#BE4F24]/5 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {venue?.hotline && (
            <a
              href={`tel:${venue.hotline}`}
              className="flex items-center justify-center gap-2 mt-3 h-12 bg-[#BE4F24] hover:bg-[#A9411D] text-white rounded-xl font-semibold text-[15px] transition-all"
            >
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Gọi ngay: {venue.hotline}
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
