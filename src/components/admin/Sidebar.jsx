'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { ADMIN_NAV_ITEMS } from '@/lib/constants'

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#111111]/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-[#111111] text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-white/10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="h-[72px] flex items-center px-6 border-b border-white/10 shrink-0">
          <Link href="/admin" className="flex items-center gap-3 group">
            <Image 
              src="/images/logo.png" 
              alt="HaloPadel Logo" 
              width={160} 
              height={48} 
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>
          {/* Close button on mobile */}
          <button 
            className="ml-auto lg:hidden text-white/50 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="text-[11px] font-bold text-white/30 uppercase tracking-wider mb-4 px-3">
            Menu Quản Trị
          </div>
          <nav className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all group ${
                    isActive 
                      ? 'bg-[#D45A2A] text-white shadow-md' 
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={`text-[18px] transition-transform ${isActive ? '' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Profile (Bottom) */}
        <div className="p-4 border-t border-white/10 shrink-0 relative" ref={userMenuRef}>
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D45A2A] to-[#FBEAD8] flex items-center justify-center text-[#111111] font-bold shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white truncate">Admin User</p>
              <p className="text-[11px] text-[#4ade80] flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" /> Online
              </p>
            </div>
            <svg className={`w-4 h-4 text-white/50 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {isUserMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              <Link href="/admin/venue" className="flex items-center gap-2 px-4 py-3 text-[13px] text-white/80 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Hồ sơ cá nhân
              </Link>
              <div className="border-t border-white/10"></div>
              <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="w-full flex items-center gap-2 px-4 py-3 text-[13px] text-red-400 hover:bg-red-400/10 transition-colors text-left">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
