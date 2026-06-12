'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { uploadImageToCloudinary } from '@/actions/upload'

export default function ImageUpload({ value, onChange, folder = 'halopadel', label = 'Upload hình ảnh', className = '' }) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const objectUrl = URL.createObjectURL(file)
    // We can show preview immediately if needed, but here we just upload directly

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const result = await uploadImageToCloudinary(formData)
      if (result.success) {
        onChange(result.url)
      } else {
        alert(result.error || 'Lỗi tải ảnh')
      }
    } catch (error) {
      console.error(error)
      alert('Đã xảy ra lỗi khi upload')
    } finally {
      setIsUploading(false)
      // Cleanup
      URL.revokeObjectURL(objectUrl)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-[13px] font-bold text-[#111111]">{label}</label>
      
      <div className="flex flex-col gap-4">
        {value ? (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-[#E8E2D2] bg-gray-50 group">
            <Image src={value} alt="Preview" fill className="object-contain" unoptimized />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white text-[#111111] rounded-lg font-bold text-sm hover:bg-[#F8F5E4] transition-colors"
              >
                Đổi ảnh khác
              </button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <span className="text-[#D45A2A] font-bold text-sm">Đang tải lên...</span>
              </div>
            )}
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video rounded-xl border-2 border-dashed border-[#E8E2D2] hover:border-[#D45A2A] hover:bg-[#FFF9EE] bg-[#F8F5E4]/30 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {isUploading ? (
              <span className="text-[#D45A2A] font-bold text-sm animate-pulse">Đang tải lên...</span>
            ) : (
              <>
                <svg className="w-8 h-8 text-[#888888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[#555555] font-medium text-sm">Nhấn để chọn ảnh</span>
                <span className="text-[#888888] text-[11px]">Hỗ trợ: JPG, PNG, WEBP</span>
              </>
            )}
          </div>
        )}

        {/* Fallback to direct URL input just in case */}
        <div className="flex gap-2 items-center text-[12px] text-[#888888]">
          <span>Hoặc dán link:</span>
          <input 
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded outline-none transition-all"
            placeholder="https://..."
          />
        </div>
      </div>

      <input 
        type="file" 
        accept="image/*"
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  )
}
