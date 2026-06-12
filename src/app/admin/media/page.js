'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getMediaFiles, createMediaFile, updateMediaFile, deleteMediaFile } from '@/actions/media'
import ImageUpload from '@/components/admin/ImageUpload'
import Pagination from '@/components/admin/Pagination'
import { formatDate } from '@/lib/utils'

export default function AdminMediaPage() {
  const [mediaFiles, setMediaFiles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    url: '',
    category: 'GALLERY',
    altText: '',
    caption: '',
    isActive: true,
    showOnHomepage: false
  })

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadData = async (pageToLoad = page) => {
    setIsLoading(true)
    const res = await getMediaFiles({ page: pageToLoad, limit: 12 })
    setMediaFiles(res.data || [])
    setTotalPages(res.totalPages || 1)
    setPage(res.page || 1)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData(1)
  }, [])

  const openAddModal = () => {
    setFormData({ url: '', category: 'GALLERY', altText: '', caption: '', isActive: true, showOnHomepage: false })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setFormData({
      url: item.url,
      category: item.category || 'GALLERY',
      altText: item.altText || '',
      caption: item.caption || '',
      isActive: item.isActive,
      showOnHomepage: item.showOnHomepage
    })
    setEditingId(item.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
      const res = await deleteMediaFile(id)
      if (res?.success) {
        loadData()
      } else {
        alert(res?.error || 'Lỗi khi xóa')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let res
    if (editingId) {
      res = await updateMediaFile(editingId, formData)
    } else {
      res = await createMediaFile(formData)
    }
    
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
            Thư viện hình ảnh
          </h1>
          <p className="text-[#555555] mt-2">
            Quản lý tất cả hình ảnh sân, banner, sự kiện.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm hình ảnh
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaFiles.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#888888] bg-white rounded-2xl border border-[#E8E2D2]">
            Chưa có hình ảnh nào. Hãy thêm ảnh đầu tiên!
          </div>
        ) : (
          mediaFiles.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-[#E8E2D2] shadow-sm overflow-hidden group">
              <div className="aspect-[4/3] relative bg-[#F8F5E4] overflow-hidden">
                <Image 
                  src={item.url || '/placeholder.jpg'} 
                  alt={item.altText || 'Media'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized // For remote URLs if not configured in next.config
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => openEditModal(item)} className="p-2 bg-white/20 hover:bg-white text-white hover:text-[#111111] rounded-full backdrop-blur-sm transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#D45A2A] bg-[#FFF9EE] px-2 py-0.5 rounded uppercase">{item.category}</span>
                  {!item.isActive && <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Đã ẩn</span>}
                </div>
                <p className="text-[13px] text-[#111111] font-medium line-clamp-1">{item.caption || item.altText || 'Không có mô tả'}</p>
                <p className="text-[11px] text-[#888888] mt-1">{formatDate(item.createdAt, 'dd/MM/yyyy')}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && mediaFiles.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl border border-[#E8E2D2] shadow-sm overflow-hidden">
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={(p) => loadData(p)} 
          />
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-[#E8E2D2] flex items-center justify-between bg-[#F8F5E4]/30 sticky top-0 z-10">
              <h3 className="font-heading font-bold text-lg text-[#111111]">
                {editingId ? 'Sửa thông tin ảnh' : 'Thêm ảnh mới'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#888888] hover:text-[#111111] transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              <div className="mb-5">
                <ImageUpload 
                  label="Hình ảnh *"
                  folder="halopadel/media"
                  value={formData.url}
                  onChange={(url) => setFormData({...formData, url})}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Danh mục</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all cursor-pointer"
                  >
                    <option value="GALLERY">Thư viện ảnh</option>
                    <option value="HERO">Ảnh bìa (Hero)</option>
                    <option value="COURT">Ảnh sân tập</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Alt Text (Tốt cho SEO)</label>
                  <input 
                    type="text" 
                    value={formData.altText}
                    onChange={(e) => setFormData({...formData, altText: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all"
                    placeholder="Sân Padel Đà Nẵng..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Mô tả (Caption)</label>
                <input 
                  type="text" 
                  value={formData.caption}
                  onChange={(e) => setFormData({...formData, caption: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all"
                  placeholder="Khai trương sân mới..."
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 rounded border-[#E8E2D2] text-[#D45A2A] focus:ring-[#D45A2A]/50"
                  />
                  <label htmlFor="isActive" className="text-[13px] font-bold text-[#111111] cursor-pointer">
                    Hiển thị trên website
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="showOnHomepage"
                    checked={formData.showOnHomepage}
                    onChange={(e) => setFormData({...formData, showOnHomepage: e.target.checked})}
                    className="w-4 h-4 rounded border-[#E8E2D2] text-[#D45A2A] focus:ring-[#D45A2A]/50"
                  />
                  <label htmlFor="showOnHomepage" className="text-[13px] font-bold text-[#111111] cursor-pointer">
                    Hiển thị nổi bật ở trang chủ
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-[#F8F5E4] hover:bg-[#E8E2D2] text-[#555555] rounded-xl font-bold transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#D45A2A] hover:bg-[#B8431D] text-white rounded-xl font-bold transition-colors"
                >
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
