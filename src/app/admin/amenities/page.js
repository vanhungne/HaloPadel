'use client'

import { useState, useEffect } from 'react'
import { getAmenities, createAmenity, updateAmenity, deleteAmenity } from '@/actions/amenities'
import Pagination from '@/components/admin/Pagination'
import ConfirmModal from '@/components/admin/ConfirmModal'
import ImageUpload from '@/components/admin/ImageUpload'
import { LanguageTabs, TranslateButton, EnField } from '@/components/admin/TranslateTools'
import { toast } from 'react-hot-toast'
import { AMENITY_ICONS } from '@/lib/constants'

export default function AdminAmenitiesPage() {
  const [amenities, setAmenities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null })
  
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'star',
    image: '',
    nameEn: '',
    descriptionEn: '',
    isActive: true
  })

  const [langTab, setLangTab] = useState('vi')

  const loadData = async (pageToLoad = page) => {
    setIsLoading(true)
    const res = await getAmenities({ page: pageToLoad, limit: 12 })
    setAmenities(res.data || [])
    setTotalPages(res.totalPages || 1)
    setPage(res.page || 1)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData(1)
  }, [])

  const openAddModal = () => {
    setFormData({ name: '', description: '', icon: 'star', image: '', nameEn: '', descriptionEn: '', isActive: true })
    setEditingId(null)
    setLangTab('vi')
    setIsModalOpen(true)
  }

  const openEditModal = (amenity) => {
    setFormData({
      name: amenity.name,
      description: amenity.description || '',
      icon: amenity.icon || 'star',
      image: amenity.image || '',
      isActive: amenity.isActive,
      nameEn: amenity.nameEn || '',
      descriptionEn: amenity.descriptionEn || '',
    })
    setEditingId(amenity.id)
    setLangTab('vi')
    setIsModalOpen(true)
  }

  const requestDelete = (id) => {
    setDeleteModal({ isOpen: true, id })
  }

  const confirmDelete = async () => {
    const id = deleteModal.id
    setDeleteModal({ isOpen: false, id: null })
    
    const loadingToast = toast.loading('Đang xóa tiện ích...')
    const res = await deleteAmenity(id)
    if (res?.success) {
      toast.success('Xóa tiện ích thành công!', { id: loadingToast })
      loadData()
    } else {
      toast.error(res?.error || 'Lỗi khi xóa', { id: loadingToast })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const loadingToast = toast.loading('Đang lưu dữ liệu...')
    let res
    if (editingId) {
      res = await updateAmenity(editingId, formData)
    } else {
      res = await createAmenity(formData)
    }
    
    if (res?.success) {
      toast.success(editingId ? 'Cập nhật thành công!' : 'Thêm mới thành công!', { id: loadingToast })
      setIsModalOpen(false)
      loadData()
    } else {
      toast.error(res?.error || 'Lỗi lưu dữ liệu', { id: loadingToast })
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
            Tiện ích sân
          </h1>
          <p className="text-[#555555] mt-2 text-[15px]">
            Quản lý các dịch vụ và tiện ích đi kèm tại sân Padel của bạn.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-[#D45A2A] hover:bg-[#B8431D] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 shrink-0"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm tiện ích
        </button>
      </div>

      {/* Grid List */}
      {amenities.length === 0 ? (
        <div className="py-16 bg-white border border-[#E8E2D2] rounded-2xl text-center shadow-sm">
          <p className="text-[#888888]">Chưa có tiện ích nào. Hãy thêm tiện ích đầu tiên!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {amenities.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-[#E8E2D2] shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col h-[220px]">
              {/* Card Header: Icon/Image & Status & Actions */}
              <div className="px-5 pt-5 pb-3 flex items-start justify-between">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F8F5E4] text-[#D45A2A] flex items-center justify-center text-2xl shadow-sm border border-[#E8E2D2]">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    AMENITY_ICONS[item.icon] || '✨'
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.isActive ? 'Hoạt động' : 'Tạm ẩn'}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(item)} className="p-1.5 text-[#888888] hover:text-[#D45A2A] hover:bg-[#F8F5E4] rounded-lg transition-colors" title="Sửa">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => requestDelete(item.id)} className="p-1.5 text-[#888888] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="px-5 pb-5 flex-1 flex flex-col">
                <h3 className="font-bold text-[#111111] text-[16px] mb-1.5 line-clamp-1">{item.name}</h3>
                <p className="text-[13px] text-[#555555] line-clamp-3 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && amenities.length > 0 && (
        <div className="mt-8">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => loadData(p)} />
        </div>
      )}

      {/* Modal */}
      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Xóa tiện ích"
        message="Bạn có chắc chắn muốn xóa tiện ích này? Dữ liệu sau khi xóa sẽ không thể khôi phục."
        confirmText="Xóa tiện ích"
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[800px] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-[#E8E2D2] flex items-center justify-between bg-[#F8F5E4]/30">
              <h3 className="font-heading font-bold text-lg text-[#111111]">
                {editingId ? 'Sửa tiện ích' : 'Thêm tiện ích mới'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#888888] hover:text-[#111111] transition-colors p-1 bg-white rounded-full hover:shadow-sm"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cột trái */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Tên tiện ích <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all font-medium"
                      placeholder="Vd: Bãi xe miễn phí, Nước uống..."
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Mô tả chi tiết</label>
                    <textarea 
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all resize-none text-[14px]"
                      placeholder="Vd: Bãi đỗ xe rộng rãi cho ô tô và xe máy..."
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Chọn Icon (Nội bộ)</label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                      {Object.entries(AMENITY_ICONS).map(([key, emoji]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({...formData, icon: key})}
                          className={`h-10 flex items-center justify-center text-xl rounded-xl border transition-all ${
                            formData.icon === key 
                            ? 'bg-[#F8F5E4] border-[#D45A2A] shadow-sm' 
                            : 'bg-[#FAFAFA] border-[#E8E2D2] hover:border-[#D45A2A]/50 hover:bg-white'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cột phải */}
                <div className="space-y-6 flex flex-col">
                  <div className="flex-1">
                    <ImageUpload 
                      label="Hình ảnh minh họa" 
                      value={formData.image} 
                      onChange={(url) => setFormData({...formData, image: url})} 
                      folder="halopadel/amenities" 
                    />
                  </div>

                  {/* Language Tabs + Translation */}
                  <LanguageTabs langTab={langTab} setLangTab={setLangTab} />
                  
                  {langTab === 'en' && (
                    <div className="space-y-4">
                      <EnField label="Name (English)" value={formData.nameEn} onChange={(e) => setFormData({...formData, nameEn: e.target.value})} viValue={formData.name} />
                      <EnField label="Description (English)" value={formData.descriptionEn} onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})} viValue={formData.description} multiline />
                    </div>
                  )}

                  <TranslateButton
                    viFields={{ name: formData.name, description: formData.description }}
                    onTranslated={(data) => {
                      setFormData(prev => ({
                        ...prev,
                        nameEn: data.name || prev.nameEn,
                        descriptionEn: data.description || prev.descriptionEn,
                      }))
                      setLangTab('en')
                    }}
                    disabled={!formData.name}
                  />

                  <div className="flex items-center gap-3 pt-2 p-4 bg-[#F8F5E4]/50 rounded-xl border border-[#E8E2D2]/50 cursor-pointer hover:border-[#D45A2A]/50 transition-colors" onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
                    <input 
                      type="checkbox" 
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 rounded border-[#E8E2D2] text-[#D45A2A] focus:ring-[#D45A2A]/50 pointer-events-none"
                    />
                    <label htmlFor="isActive" className="text-[13px] font-bold text-[#111111] pointer-events-none">
                      Kích hoạt tiện ích này (Hiển thị lên website)
                    </label>
                  </div>
                </div>
              </div>

            </form>
            <div className="px-6 md:px-8 py-4 flex gap-3 border-t border-[#E8E2D2] shrink-0 bg-white">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 bg-[#F8F5E4] hover:bg-[#E8E2D2] text-[#555555] rounded-xl font-bold transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-[#D45A2A] hover:bg-[#B8431D] text-white rounded-xl font-bold transition-colors shadow-md hover:shadow-lg"
              >
                {editingId ? 'Lưu thay đổi' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
