'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from '@/actions/promotions'
import ImageUpload from '@/components/admin/ImageUpload'
import Pagination from '@/components/admin/Pagination'
import { LanguageTabs, TranslateButton, EnField } from '@/components/admin/TranslateTools'
import { formatDate } from '@/lib/utils'

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '',
    banner: '',
    shortDesc: '',
    content: '',
    startDate: '',
    endDate: '',
    conditions: '',
    ctaText: 'Nhận ưu đãi',
    ctaUrl: '/lien-he',
    titleEn: '',
    shortDescEn: '',
    contentEn: '',
    ctaTextEn: '',
    isActive: true,
    showOnHomepage: false,
    displayOrder: 0
  })

  const [langTab, setLangTab] = useState('vi')

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadData = async (pageToLoad = page) => {
    setIsLoading(true)
    const res = await getPromotions({ page: pageToLoad, limit: 10 })
    setPromotions(res.data || [])
    setTotalPages(res.totalPages || 1)
    setPage(res.page || 1)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData(1)
  }, [])

  const openAddModal = () => {
    setFormData({ 
      title: '', banner: '', shortDesc: '', content: '', 
      startDate: '', endDate: '', conditions: '', 
      ctaText: 'Nhận ưu đãi', ctaUrl: '/lien-he', 
      titleEn: '', shortDescEn: '', contentEn: '', ctaTextEn: '',
      isActive: true, showOnHomepage: false, displayOrder: 0 
    })
    setEditingId(null)
    setLangTab('vi')
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setFormData({
      title: item.title,
      banner: item.banner || '',
      shortDesc: item.shortDesc || '',
      content: item.content || '',
      startDate: item.startDate ? new Date(item.startDate).toISOString().slice(0, 16) : '',
      endDate: item.endDate ? new Date(item.endDate).toISOString().slice(0, 16) : '',
      conditions: item.conditions || '',
      ctaText: item.ctaText || 'Nhận ưu đãi',
      ctaUrl: item.ctaUrl || '/lien-he',
      isActive: item.isActive,
      showOnHomepage: item.showOnHomepage,
      displayOrder: item.displayOrder || 0,
      titleEn: item.titleEn || '',
      shortDescEn: item.shortDescEn || '',
      contentEn: item.contentEn || '',
      ctaTextEn: item.ctaTextEn || '',
    })
    setEditingId(item.id)
    setLangTab('vi')
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
      const res = await deletePromotion(id)
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
      res = await updatePromotion(editingId, formData)
    } else {
      res = await createPromotion(formData)
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
            Chương trình Khuyến mãi
          </h1>
          <p className="text-[#555555] mt-2">
            Quản lý các sự kiện ưu đãi, giảm giá để thu hút khách hàng.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-[#D45A2A] hover:bg-[#B8431D] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tạo khuyến mãi
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#E8E2D2] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#F8F5E4]/50 border-b border-[#E8E2D2]">
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Banner</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Chương trình</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Thời gian áp dụng</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider text-center">Thứ tự</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider text-center">Trạng thái</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D2]">
            {promotions.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-[#888888]">Chưa có chương trình khuyến mãi nào</td>
              </tr>
            ) : (
              promotions.map(item => (
                <tr key={item.id} className="hover:bg-[#F8F5E4]/30 transition-colors">
                  <td className="py-4 px-6 w-32">
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 border border-[#E8E2D2]">
                      <Image 
                        src={item.banner || '/placeholder.jpg'} 
                        alt={item.title} 
                        fill 
                        className="object-cover" 
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6 max-w-[300px]">
                    <p className="font-bold text-[#111111] line-clamp-2">{item.title}</p>
                    <p className="text-[12px] text-[#888888] mt-1 line-clamp-1">{item.shortDesc}</p>
                    {item.showOnHomepage && <span className="inline-block mt-1 text-[10px] font-bold text-[#D45A2A] bg-[#FFF9EE] px-2 py-0.5 rounded">Hiện ở trang chủ</span>}
                  </td>
                  <td className="py-4 px-6 text-[#555555] text-[13px]">
                    {item.startDate ? formatDate(item.startDate, 'dd/MM/yyyy') : 'Chưa xác định'}
                    <br/>
                    đến {item.endDate ? formatDate(item.endDate, 'dd/MM/yyyy') : 'Chưa xác định'}
                  </td>
                  <td className="py-4 px-6 text-center text-[#555555] text-[13px] font-bold">
                    {item.displayOrder}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                      item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.isActive ? 'Đang chạy' : 'Tạm dừng'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!isLoading && promotions.length > 0 && (
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
                {editingId ? 'Sửa khuyến mãi' : 'Tạo khuyến mãi mới'}
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
              {/* Left Column: Settings & Banner */}
              <div className="w-full lg:w-[400px] shrink-0 border-r border-[#E8E2D2] bg-white overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Tên chương trình khuyến mãi <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all font-medium"
                    placeholder="Giảm 50% cho học viên mới..."
                  />
                </div>
                
                <div>
                  <ImageUpload 
                    label="Banner Khuyến mãi"
                    folder="halopadel/promotions"
                    value={formData.banner}
                    onChange={(url) => setFormData({...formData, banner: url})}
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

                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Mức độ ưu tiên (Số nhỏ xếp trước)</label>
                  <input 
                    type="number" 
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all font-medium"
                    placeholder="Vd: 1"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Mô tả ngắn</label>
                  <textarea 
                    rows={3}
                    value={formData.shortDesc}
                    onChange={(e) => setFormData({...formData, shortDesc: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all resize-none text-sm leading-relaxed"
                  />
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
                      Kích hoạt chương trình (Hiển thị)
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
                      Ghim lên khối "Khuyến mãi nổi bật" ở trang chủ
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Content + Translation */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA] p-0 lg:p-6 overflow-hidden">
                <div className="flex-1 flex flex-col h-full bg-white lg:rounded-xl shadow-sm lg:border border-[#E8E2D2] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[#E8E2D2] flex items-center justify-between bg-white">
                    <div>
                      <label className="block text-[15px] font-bold text-[#111111]">Nội dung chi tiết chương trình</label>
                      <p className="text-[12px] text-[#888888] font-medium">Chi tiết về ưu đãi, cách thức tham gia, v.v.</p>
                    </div>
                    <LanguageTabs langTab={langTab} setLangTab={setLangTab} />
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-6">
                    {langTab === 'vi' ? (
                      <>
                        <div>
                          <textarea 
                            rows={12}
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all resize-none text-sm leading-relaxed"
                            placeholder="Nhập nội dung chi tiết ở đây..."
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Điều kiện áp dụng</label>
                          <textarea 
                            rows={4}
                            value={formData.conditions}
                            onChange={(e) => setFormData({...formData, conditions: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all resize-none text-sm leading-relaxed"
                            placeholder="Vd: Không áp dụng kèm các CTKM khác..."
                          />
                        </div>
                        <TranslateButton
                          viFields={{ title: formData.title, shortDesc: formData.shortDesc, content: formData.content, ctaText: formData.ctaText }}
                          onTranslated={(data) => {
                            setFormData(prev => ({
                              ...prev,
                              titleEn: data.title || prev.titleEn,
                              shortDescEn: data.shortDesc || prev.shortDescEn,
                              contentEn: data.content || prev.contentEn,
                              ctaTextEn: data.ctaText || prev.ctaTextEn,
                            }))
                            setLangTab('en')
                          }}
                          disabled={!formData.title}
                        />
                      </>
                    ) : (
                      <div className="space-y-5">
                        <EnField label="Title (English)" value={formData.titleEn} onChange={(e) => setFormData({...formData, titleEn: e.target.value})} viValue={formData.title} />
                        <EnField label="Short Description (English)" value={formData.shortDescEn} onChange={(e) => setFormData({...formData, shortDescEn: e.target.value})} viValue={formData.shortDesc} multiline />
                        <EnField label="Content (English)" value={formData.contentEn} onChange={(e) => setFormData({...formData, contentEn: e.target.value})} viValue={formData.content?.substring(0, 100)} multiline />
                        <EnField label="CTA Text (English)" value={formData.ctaTextEn} onChange={(e) => setFormData({...formData, ctaTextEn: e.target.value})} viValue={formData.ctaText} />
                      </div>
                    )}
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
                {editingId ? 'Lưu thay đổi' : 'Tạo chương trình'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
