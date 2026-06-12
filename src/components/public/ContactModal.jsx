'use client'

import { useState } from 'react'
import { createContact } from '@/actions/contacts'

export default function ContactModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    message: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const res = await createContact(formData)
    setIsSubmitting(false)
    
    if (res?.success) {
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 3000)
    } else {
      alert(res?.error || 'Có lỗi xảy ra')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#111111]/60 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[480px] bg-white rounded-[24px] shadow-2xl z-[101] overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="relative h-[120px] bg-[#D45A2A] overflow-hidden">
          {/* Abstract Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="modal-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="currentColor"/>
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#modal-pattern)"/>
            </svg>
          </div>
          
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
            <h3 className="font-heading font-bold text-2xl text-white">Để lại thông tin</h3>
            <p className="text-white/80 text-[14px] mt-1">
              Đội ngũ HaloPadel sẽ liên hệ tư vấn trong vòng 15 phút.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-heading font-bold text-2xl text-[#111111] mb-2">Đăng ký thành công!</h4>
              <p className="text-[#555555]">
                Cảm ơn bạn đã quan tâm. Chúng tôi sẽ gọi lại cho bạn vào thời gian sớm nhất.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-1.5 ml-1">
                  Họ và tên <span className="text-[#D45A2A]">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Nhập tên của bạn"
                  className="w-full px-4 py-3 bg-[#F8F5E4] border border-transparent focus:border-[#D45A2A] focus:bg-white rounded-xl text-[#111111] placeholder-[#888888] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-1.5 ml-1">
                  Số điện thoại <span className="text-[#D45A2A]">*</span>
                </label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-3 bg-[#F8F5E4] border border-transparent focus:border-[#D45A2A] focus:bg-white rounded-xl text-[#111111] placeholder-[#888888] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-1.5 ml-1">
                  Nội dung cần tư vấn
                </label>
                <textarea 
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="Bạn quan tâm đến đặt sân, đăng ký học hay mua gói tháng?"
                  className="w-full px-4 py-3 bg-[#F8F5E4] border border-transparent focus:border-[#D45A2A] focus:bg-white rounded-xl text-[#111111] placeholder-[#888888] outline-none transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[52px] mt-4 flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#D45A2A] text-white rounded-xl font-bold transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Gửi yêu cầu
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
