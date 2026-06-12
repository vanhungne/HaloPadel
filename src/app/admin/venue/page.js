'use client'

import { useState, useEffect } from 'react'
import { getVenue, updateVenue } from '@/actions/venue'

export default function AdminVenuePage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    hotline: '',
    zalo: '',
    email: '',
    address: '',
    googleMapsUrl: '',
    openingHours: '',
    shortDesc: '',
    facebook: '',
    tiktok: '',
  })

  useEffect(() => {
    async function loadData() {
      try {
        const venue = await getVenue()
        if (venue) {
          setFormData({
            name: venue.name || '',
            hotline: venue.hotline || '',
            zalo: venue.zalo || '',
            email: venue.email || '',
            address: venue.address || '',
            googleMapsUrl: venue.googleMapsUrl || '',
            openingHours: venue.openingHours || '',
            shortDesc: venue.shortDesc || '',
            facebook: venue.facebook || '',
            tiktok: venue.tiktok || '',
          })
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    
    const result = await updateVenue(formData)
    
    setIsSaving(false)
    if (result?.success) {
      setIsSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setIsSuccess(false), 3000)
    } else {
      alert(result?.error || 'Có lỗi xảy ra')
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-[#888888]">Đang tải dữ liệu...</div>
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-[1200px] mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#111111]">
            Thông tin sân
          </h1>
          <p className="text-[#555555] mt-2 text-[15px]">
            Cập nhật thông tin liên hệ, địa chỉ và mô tả chung hiển thị trên website.
          </p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 bg-[#D45A2A] hover:bg-[#B8431D] text-white px-8 py-2.5 rounded-xl font-bold transition-all disabled:opacity-70 shadow-md hover:shadow-lg hover:-translate-y-0.5 shrink-0"
        >
          {isSaving ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          )}
          Lưu thay đổi
        </button>
      </div>

      {/* Success Notification */}
      {isSuccess && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-800 font-medium">Lưu thông tin thành công! Giao diện web đã được cập nhật.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="font-heading font-bold text-lg text-[#111111] flex items-center gap-2">
              <svg className="w-5 h-5 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Thông tin cơ bản
            </h2>
            <p className="text-[#555555] text-[13.5px] mt-2 leading-relaxed">
              Tên thương hiệu và câu Slogan sẽ xuất hiện ở tiêu đề trang web, Footer và các khu vực giới thiệu chung.
            </p>
          </div>
          
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E2D2] shadow-sm p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Tên sân / Tên thương hiệu <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all font-medium"
                placeholder="Vd: HaloPadel"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Mô tả ngắn (Slogan)</label>
              <textarea 
                rows={2}
                name="shortDesc"
                value={formData.shortDesc}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all resize-none text-[14px]"
                placeholder="Vd: Sân Padel chuyên nghiệp hàng đầu TP.HCM..."
              />
            </div>
          </div>
        </div>

        <hr className="border-[#E8E2D2]" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="font-heading font-bold text-lg text-[#111111] flex items-center gap-2">
              <svg className="w-5 h-5 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Liên hệ & Địa chỉ
            </h2>
            <p className="text-[#555555] text-[13.5px] mt-2 leading-relaxed">
              Các thông tin này sẽ được dùng cho nút Gọi điện, nhắn tin Zalo, gửi Email và bản đồ chỉ đường trên toàn bộ website.
            </p>
          </div>
          
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E2D2] shadow-sm p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Hotline</label>
                <input 
                  type="text" 
                  name="hotline"
                  value={formData.hotline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all font-medium"
                  placeholder="0909 123 456"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Số Zalo</label>
                <input 
                  type="text" 
                  name="zalo"
                  value={formData.zalo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all font-medium"
                  placeholder="0909123456"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Email liên hệ</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all"
                  placeholder="info@halopadel.vn"
                />
              </div>
              <div className="md:col-span-2 pt-4 border-t border-[#E8E2D2]">
                <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Địa chỉ hiển thị</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all"
                  placeholder="Số nhà, Tên đường, Phường, Quận, Thành phố..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Link Google Maps (Nút Chỉ đường)</label>
                <input 
                  type="url" 
                  name="googleMapsUrl"
                  value={formData.googleMapsUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all text-sm font-mono"
                  placeholder="https://maps.app.goo.gl/..."
                />
                <p className="text-[11.5px] text-[#888888] mt-2">Dùng để mở ứng dụng Bản đồ khi khách hàng nhấn vào nút "Chỉ đường".</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-[#E8E2D2]" />

        {/* Social Media */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="font-heading font-bold text-lg text-[#111111] flex items-center gap-2">
              <svg className="w-5 h-5 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Mạng xã hội
            </h2>
            <p className="text-[#555555] text-[13.5px] mt-2 leading-relaxed">
              Các liên kết đến trang mạng xã hội chính thức của sân.
            </p>
          </div>
          
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E2D2] shadow-sm p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-1.5 flex items-center gap-1.5">
                  Facebook Page URL
                </label>
                <input 
                  type="url" 
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all text-sm font-mono"
                  placeholder="https://facebook.com/halopadel"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-1.5 flex items-center gap-1.5">
                  TikTok Profile URL
                </label>
                <input 
                  type="url" 
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all text-sm font-mono"
                  placeholder="https://tiktok.com/@halopadel"
                />
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  )
}
