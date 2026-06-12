'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getSeoSettings, updateSeoSetting } from '@/actions/seo'
import ImageUpload from '@/components/admin/ImageUpload'

export default function AdminSeoPage() {
  const [settings, setSettings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    pageName: '',
    pageKey: '',
    metaTitle: '',
    metaDescription: '',
    ogImage: '',
    canonicalUrl: '',
    schemaMarkup: '',
  })

  const loadData = async () => {
    setIsLoading(true)
    const data = await getSeoSettings()
    setSettings(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const openEditModal = (item) => {
    setFormData({
      pageName: item.pageName,
      pageKey: item.pageKey,
      metaTitle: item.metaTitle || '',
      metaDescription: item.metaDescription || '',
      ogImage: item.ogImage || '',
      canonicalUrl: item.canonicalUrl || '',
      schemaMarkup: item.schemaMarkup || '',
    })
    setEditingId(item.id)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!editingId) return

    const res = await updateSeoSetting(editingId, formData)
    
    if (res?.success) {
      setIsModalOpen(false)
      loadData()
    } else {
      alert(res?.error || 'Lỗi lưu dữ liệu')
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
            Tối ưu SEO (Search Engine Optimization)
          </h1>
          <p className="text-[#555555] mt-2">
            Cấu hình thẻ Meta, ảnh chia sẻ mạng xã hội và dữ liệu cấu trúc (Schema) cho từng trang.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#E8E2D2] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#F8F5E4]/50 border-b border-[#E8E2D2]">
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider w-[20%]">Trang hiển thị</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider w-[35%]">Meta Title</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider w-[30%]">OG Image</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider text-right w-[15%]">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D2]">
            {settings.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-[#888888]">Chưa có dữ liệu</td>
              </tr>
            ) : (
              settings.map(item => (
                <tr key={item.id} className="hover:bg-[#FFF9EE] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F8F5E4] text-[#D45A2A] flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-[#111111]">{item.pageName}</p>
                        <p className="text-[11px] text-[#888888] uppercase mt-0.5 font-mono">/{item.pageKey === 'home' ? '' : item.pageKey}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] text-[#111111] font-medium line-clamp-1">{item.metaTitle || '(Chưa cấu hình)'}</p>
                    <p className="text-[12px] text-[#888888] mt-1 line-clamp-1">{item.metaDescription || 'Không có mô tả'}</p>
                  </td>
                  <td className="py-4 px-6">
                    {item.ogImage ? (
                      <div className="relative w-20 h-10 rounded overflow-hidden border border-[#E8E2D2]">
                        <Image src={item.ogImage} alt="OG" fill className="object-cover" sizes="80px" />
                      </div>
                    ) : (
                      <span className="text-[12px] text-[#888888] italic">Chưa có ảnh</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#E8E2D2] hover:border-[#D45A2A] hover:text-[#D45A2A] text-[#111111] rounded-xl font-bold transition-all shadow-sm text-[13px]"
                    >
                      Cấu hình SEO
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#111111]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1200px] h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#E8E2D2] flex items-center justify-between bg-[#F8F5E4]/30 shrink-0">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#111111]">
                  Cấu hình SEO
                </h3>
                <p className="text-[13px] text-[#555555]">Đang sửa trang: <strong className="text-[#D45A2A]">{formData.pageName}</strong></p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#888888] hover:text-[#111111] transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
              {/* Left Column: Meta & Image */}
              <div className="w-full lg:w-[500px] shrink-0 border-r border-[#E8E2D2] bg-white overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Meta Title (Tiêu đề trang) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all font-medium"
                    placeholder="HaloPadel - Sân Thể Thao Đẳng Cấp..."
                  />
                  <p className="text-[11px] text-[#888888] mt-1.5">Tối ưu: Khoảng 50-60 ký tự. Hiển thị lớn nhất trên Google.</p>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Meta Description (Mô tả trang)</label>
                  <textarea 
                    rows={3}
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all resize-none text-sm leading-relaxed"
                    placeholder="Mô tả ngắn gọn nội dung trang..."
                  />
                  <p className="text-[11px] text-[#888888] mt-1.5">Tối ưu: Khoảng 150-160 ký tự.</p>
                </div>

                <div className="pt-2 border-t border-[#E8E2D2]">
                  <label className="block text-[14px] font-bold text-[#111111] mb-3">OG Image (Ảnh chia sẻ mạng xã hội)</label>
                  <p className="text-[12px] text-[#555555] mb-4">Hình ảnh sẽ hiển thị khi bạn chia sẻ link web lên Facebook, Zalo. Kích thước khuyến nghị: 1200x630px.</p>
                  <ImageUpload 
                    label="Tải ảnh OG Image"
                    folder="halopadel/seo"
                    value={formData.ogImage}
                    onChange={(url) => setFormData({...formData, ogImage: url})}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Canonical URL (Tùy chọn)</label>
                  <input 
                    type="url" 
                    value={formData.canonicalUrl}
                    onChange={(e) => setFormData({...formData, canonicalUrl: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all text-sm font-mono"
                    placeholder="https://..."
                  />
                  <p className="text-[11px] text-[#888888] mt-1.5">URL gốc của trang, dùng để chống trùng lặp nội dung. Thường để trống nếu không hiểu rõ.</p>
                </div>
              </div>

              {/* Right Column: Schema Markup preview or edit */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA] p-0 lg:p-6 overflow-hidden">
                <div className="flex-1 flex flex-col h-full bg-white lg:rounded-xl shadow-sm lg:border border-[#E8E2D2] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[#E8E2D2] flex items-center justify-between bg-white">
                    <div>
                      <label className="block text-[15px] font-bold text-[#111111]">Schema Markup (JSON-LD)</label>
                      <p className="text-[12px] text-[#888888] font-medium">Dữ liệu cấu trúc dành cho Google Bot (Dành cho chuyên gia SEO).</p>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 p-5 bg-[#1E1E1E]">
                    <textarea 
                      value={formData.schemaMarkup}
                      onChange={(e) => setFormData({...formData, schemaMarkup: e.target.value})}
                      className="w-full h-full bg-transparent text-[#D4D4D4] font-mono text-[13px] outline-none resize-none"
                      placeholder='{
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": "HaloPadel"
}'
                      spellCheck="false"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#E8E2D2] flex justify-end gap-3 bg-white shrink-0">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-[#F8F5E4] hover:bg-[#E8E2D2] text-[#555555] rounded-xl font-bold transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                className="px-8 py-2.5 bg-[#D45A2A] hover:bg-[#B8431D] text-white rounded-xl font-bold transition-colors shadow-md hover:shadow-lg"
              >
                Lưu cấu hình SEO
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
