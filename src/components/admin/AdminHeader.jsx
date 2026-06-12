'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { getContacts } from '@/actions/contacts'

export default function AdminHeader({ setIsSidebarOpen }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const notifRef = useRef(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    async function fetchNotifs() {
      const contacts = await getContacts()
      const newContacts = contacts.filter(c => c.status === 'NEW')
      setNotifications(newContacts)
    }
    fetchNotifs()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  return (
    <header className="h-[72px] bg-white border-b border-[#E8E2D2] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
      {/* Left: Mobile Menu Toggle & Search */}
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 -ml-2 text-[#555555] hover:text-[#111111] hover:bg-[#F8F5E4] rounded-lg transition-colors"
          onClick={() => setIsSidebarOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden md:flex items-center relative">
          <svg className="w-4 h-4 text-[#888888] absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Tìm kiếm nhanh..." 
            className="pl-9 pr-4 py-2 w-[300px] bg-[#F8F5E4] border-transparent focus:border-[#D45A2A] focus:bg-white rounded-full text-[14px] text-[#111111] placeholder-[#888888] transition-all outline-none ring-0"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* View Site Button */}
        <Link 
          href="/" 
          target="_blank"
          className="hidden md:flex items-center gap-2 text-[13px] font-bold text-[#D45A2A] bg-[#FFF9EE] px-4 py-2 rounded-full border border-[#D45A2A]/20 hover:bg-[#D45A2A] hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Xem Website
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 rounded-full transition-colors ${isNotifOpen ? 'bg-[#F8F5E4] text-[#111111]' : 'text-[#555555] hover:text-[#111111] hover:bg-[#F8F5E4]'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>
          
          {/* Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E8E2D2] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-[#E8E2D2] flex justify-between items-center bg-[#FAFAFA]">
                <h3 className="font-bold text-[14px] text-[#111111]">Thông báo mới</h3>
                <span className="text-[11px] text-[#D45A2A] font-bold cursor-pointer hover:underline" onClick={() => {setNotifications([]); setIsNotifOpen(false);}}>Đánh dấu đã đọc</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div key={notif.id} className="p-3 border-b border-[#E8E2D2] hover:bg-[#F8F5E4] transition-colors">
                      <p className="text-[13px] font-semibold text-[#111111]">Khách hàng mới: {notif.name}</p>
                      <p className="text-[12px] text-[#555555] line-clamp-1">{notif.note || 'Để lại số điện thoại'}</p>
                      <p className="text-[10px] text-[#888888] mt-1">{new Date(notif.time).toLocaleString('vi-VN')}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-[13px] text-[#888888]">
                    Chưa có thông báo mới nào.
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-[#E8E2D2] text-center bg-[#FAFAFA]">
                <Link href="/admin/contacts" className="text-[13px] font-bold text-[#D45A2A] hover:underline" onClick={() => setIsNotifOpen(false)}>
                  Xem tất cả
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <Link href="/admin/venue" className="p-2 text-[#555555] hover:text-[#111111] hover:bg-[#F8F5E4] rounded-full transition-colors" title="Cài đặt hệ thống">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>

      </div>
    </header>
  )
}
