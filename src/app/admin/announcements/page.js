'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/actions/announcements'
import ImageUpload from '@/components/admin/ImageUpload'
import MarkdownEditor from '@/components/admin/MarkdownEditor'
import Pagination from '@/components/admin/Pagination'
import { formatDate } from '@/lib/utils'
import { ANNOUNCEMENT_TYPES } from '@/lib/constants'

const typeColors = {
  INFO: 'bg-blue-100 text-blue-700',
  PROMOTION: 'bg-green-100 text-green-700',
  EVENT: 'bg-purple-100 text-purple-700',
  MAINTENANCE: 'bg-orange-100 text-orange-700',
  WARNING: 'bg-red-100 text-red-700',
}

const typeLabels = {
  INFO: 'Thông tin',
  PROMOTION: 'Khuyến mãi',
  EVENT: 'Sự kiện',
  MAINTENANCE: 'Bảo trì',
  WARNING: 'Cảnh báo',
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'INFO',
    image: '',
    startDate: '',
    endDate: '',
    isActive: true,
    showOnHomepage: false,
    isPinned: false
  })

  const loadData = async (pageToLoad = page) => {
    setIsLoading(true)
    const res = await getAnnouncements({ page: pageToLoad, limit: 10 })
    setAnnouncements(res.data || [])
    setTotalPages(res.totalPages || 1)
    setPage(res.page || 1)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData(1)
  }, [])

  const openAddModal = () => {
    setFormData({ 
      title: '', content: '', type: 'INFO', image: '', 
      startDate: '', endDate: '', 
      isActive: true, showOnHomepage: false, isPinned: false 
    })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setFormData({
      title: item.title,
      content: item.content || '',
      type: item.type || 'INFO',
      image: item.image || '',
      startDate: item.startDate ? new Date(item.startDate).toISOString().slice(0, 16) : '',
      endDate: item.endDate ? new Date(item.endDate).toISOString().slice(0, 16) : '',
      isActive: item.isActive,
      showOnHomepage: item.showOnHomepage,
      isPinned: item.isPinned
    })
    setEditingId(item.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      const res = await deleteAnnouncement(id)
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
      res = await updateAnnouncement(editingId, formData)
    } else {
      res = await createAnnouncement(formData)
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
            Thông báo
          </h1>
          <p className="text-[#555555] mt-2">
            Quản lý thông báo, cập nhật tin tức hoặc lịch bảo trì cho khách hàng.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-[#D45A2A] hover:bg-[#B8431D] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tạo thông báo
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#E8E2D2] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#F8F5E4]/50 border-b border-[#E8E2D2]">
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Thông báo</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Phân loại</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Hiệu lực</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider text-center">Trạng thái</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D2]">
            {announcements.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-[#888888]">Chưa có thông báo nào</td>
              </tr>
            ) : (
              announcements.map(item => (
                <tr key={item.id} className="hover:bg-[#FFF9EE] transition-colors group">
                  <td className="py-4 px-6 max-w-[300px]">
                    <div className="flex items-start gap-3">
                      {item.isPinned && (
                        <svg className="w-5 h-5 text-[#D45A2A] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      )}
                      <div>
                        <p className="font-bold text-[#111111] line-clamp-2">{item.title}</p>
                        <p className="text-[12px] text-[#888888] mt-1 line-clamp-1">{item.content?.substring(0, 100).replace(/<[^>]+>/g, '')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${typeColors[item.type] || 'bg-gray-100 text-gray-700'}`}>
                      {typeLabels[item.type] || item.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[#555555] text-[13px]">
                    {item.startDate ? formatDate(item.startDate, 'dd/MM/yyyy') : 'Ngay lập tức'}
                    <br/>
                    {item.endDate ? `đến ${formatDate(item.endDate, 'dd/MM/yyyy')}` : 'Không thời hạn'}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                      item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.isActive ? 'Hiển thị' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="p-2 text-[#888888] hover:text-[#D45A2A] hover:bg-[#F8F5E4] rounded-lg transition-colors tooltip-trigger"
                        title="Sửa"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-[#888888] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip-trigger"
                        title="Xóa"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!isLoading && announcements.length > 0 && (
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={(p) => loadData(p)} 
          />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#111111]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1400px] h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#E8E2D2] flex items-center justify-between bg-[#F8F5E4]/30 shrink-0">
              <h3 className="font-heading font-bold text-lg text-[#111111]">
                {editingId ? 'Sửa thông báo' : 'Tạo thông báo mới'}
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
            
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
              {/* Left Column: Settings */}
              <div className="w-full lg:w-[400px] shrink-0 border-r border-[#E8E2D2] bg-white overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Tiêu đề <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all font-medium"
                    placeholder="Lịch nghỉ lễ, Bảo trì sân..."
                  />
                </div>
                
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Phân loại</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all cursor-pointer font-medium"
                  >
                    <option value="INFO">Thông tin chung</option>
                    <option value="PROMOTION">Khuyến mãi</option>
                    <option value="EVENT">Sự kiện</option>
                    <option value="MAINTENANCE">Bảo trì</option>
                    <option value="WARNING">Cảnh báo quan trọng</option>
                  </select>
                </div>

                <div>
                  <ImageUpload 
                    label="Hình ảnh đính kèm (Tùy chọn)"
                    folder="halopadel/announcements"
                    value={formData.image}
                    onChange={(url) => setFormData({...formData, image: url})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Ngày bắt đầu</label>
                    <input 
                      type="datetime-local" 
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Ngày kết thúc</label>
                    <input 
                      type="datetime-local" 
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all text-[13px]"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 bg-[#FFF9EE] border border-[#F8F5E4] p-3 rounded-xl cursor-pointer hover:border-[#D45A2A] transition-colors" onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
                    <input 
                      type="checkbox" 
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 rounded border-[#E8E2D2] text-[#D45A2A] focus:ring-[#D45A2A]/50 pointer-events-none"
                    />
                    <label htmlFor="isActive" className="text-[13px] font-bold text-[#111111] pointer-events-none">
                      Kích hoạt thông báo (Hiển thị)
                    </label>
                  </div>
                  <div className="flex items-center gap-3 bg-[#FFF9EE] border border-[#F8F5E4] p-3 rounded-xl cursor-pointer hover:border-[#D45A2A] transition-colors" onClick={() => setFormData({...formData, isPinned: !formData.isPinned})}>
                    <input 
                      type="checkbox" 
                      id="isPinned"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                      className="w-4 h-4 rounded border-[#E8E2D2] text-[#D45A2A] focus:ring-[#D45A2A]/50 pointer-events-none"
                    />
                    <label htmlFor="isPinned" className="text-[13px] font-bold text-[#111111] pointer-events-none">
                      Ghim lên đầu danh sách
                    </label>
                  </div>
                  <div className="flex items-center gap-3 bg-[#FFF9EE] border border-[#F8F5E4] p-3 rounded-xl cursor-pointer hover:border-[#D45A2A] transition-colors" onClick={() => setFormData({...formData, showOnHomepage: !formData.showOnHomepage})}>
                    <input 
                      type="checkbox" 
                      id="showOnHomepage"
                      checked={formData.showOnHomepage}
                      onChange={(e) => setFormData({...formData, showOnHomepage: e.target.checked})}
                      className="w-4 h-4 rounded border-[#E8E2D2] text-[#D45A2A] focus:ring-[#D45A2A]/50 pointer-events-none"
                    />
                    <label htmlFor="showOnHomepage" className="text-[13px] font-bold text-[#111111] pointer-events-none">
                      Hiển thị tại màn hình Trang chủ
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Markdown Editor */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA] p-0 lg:p-6 overflow-hidden">
                <div className="flex-1 flex flex-col h-full bg-white lg:rounded-xl shadow-sm lg:border border-[#E8E2D2] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[#E8E2D2] flex items-center justify-between bg-white">
                    <div>
                      <label className="block text-[15px] font-bold text-[#111111]">Nội dung thông báo (Markdown)</label>
                      <p className="text-[12px] text-[#888888] font-medium">Sử dụng Markdown để định dạng chữ đậm, chữ nghiêng, liên kết.</p>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <MarkdownEditor 
                      value={formData.content}
                      onChange={(content) => setFormData({...formData, content})}
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
                {editingId ? 'Lưu thay đổi' : 'Tạo thông báo'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
