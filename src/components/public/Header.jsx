'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { NAV_ITEMS } from '@/lib/constants'

export default function Header({ venue }) {
  const pathname = usePathname()
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFF9EE]/85 backdrop-blur-xl border-b border-[#E8E2D2]/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
          : 'bg-[#FFF9EE] border-b border-transparent shadow-none'
      }`}
    >
      <div className="section-container">
        <div 
          className="flex items-center justify-between transition-all duration-300" 
          style={{ height: isScrolled ? '60px' : '72px' }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3.5 shrink-0 group">
            <img
              src={venue?.logo || '/images/logo.png'}
              alt={venue?.name || 'HaloPadel'}
              className={`rounded-full object-cover border-[1.5px] border-[#E8E2D2] group-hover:border-[#D45A2A] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(212,90,42,0.15)] ${
                isScrolled ? 'h-[38px] w-[38px] md:h-[44px] md:w-[44px]' : 'h-[44px] w-[44px] md:h-[52px] md:w-[52px]'
              }`}
            />
            <div className="flex flex-col leading-none">
              <span className="font-heading font-extrabold text-[20px] text-[#111111] tracking-tight transition-colors group-hover:text-[#D45A2A]">
                Halo<span className="text-[#D45A2A]">Padel</span>
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#888888] font-medium mt-1">
                Sports Club
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 px-1 mx-3.5 text-[14.5px] font-bold transition-colors duration-300 group ${
                    isActive
                      ? 'text-[#D45A2A]'
                      : 'text-[#555555] hover:text-[#D45A2A]'
                  }`}
                >
                  {item.label}
                  {/* Sliding Underline Effect */}
                  <span 
                    className={`absolute bottom-[2px] left-0 h-[2.5px] rounded-full bg-[#D45A2A] transition-all duration-300 ease-out ${
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                  />
                </Link>
              )
            })}
          </nav>

          {/* Right: Hotline + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Hotline pill with Shine Effect */}
            {venue?.hotline && (
              <a
                href={`tel:${venue.hotline}`}
                className="relative hidden md:inline-flex items-center justify-center gap-2.5 h-[46px] px-7 bg-[#D45A2A] text-white rounded-full text-[14.5px] font-bold transition-all duration-300 hover:shadow-[0_8px_24px_rgba(212,90,42,0.35)] hover:-translate-y-1 overflow-hidden group"
              >
                {/* Moving Shine Layer */}
                <span className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] group-hover:animate-[shine_0.8s_ease-in-out_forwards]" />
                
                <svg className="w-[18px] h-[18px] relative z-10 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="relative z-10">{venue.hotline}</span>
              </a>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-[#F0EBD4]/40 hover:bg-[#E8E2D2] transition-colors"
              aria-label="Menu"
            >
              <svg className="w-[24px] h-[24px] text-[#333333]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          isMenuOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#FFF9EE] border-t border-[#E8E2D2] px-4 py-4">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-5 py-3.5 rounded-xl text-[15px] font-semibold transition-all ${
                    isActive
                      ? 'text-[#D45A2A] bg-[#D45A2A]/[0.08]'
                      : 'text-[#333333] hover:text-[#D45A2A] hover:bg-[#D45A2A]/5'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          {venue?.hotline && (
            <a
              href={`tel:${venue.hotline}`}
              className="flex items-center justify-center gap-2 mt-4 h-[52px] bg-[#D45A2A] hover:bg-[#B8431D] text-white rounded-xl font-bold text-[15px] transition-all"
            >
              <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
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
