'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { Toaster } from 'react-hot-toast'

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Do not show sidebar and header on the login page
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-[#F8F5E4]">
        {children}
        <Toaster position="top-right" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F5E4]">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Wrapper */}
      <div className="lg:pl-[260px] flex flex-col min-h-screen transition-all duration-300">
        
        {/* Top Header */}
        <AdminHeader setIsSidebarOpen={setIsSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
