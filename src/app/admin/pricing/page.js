'use client'

import { useState, useEffect } from 'react'
import { getPricingPlans, createPricingPlan, updatePricingPlan, deletePricingPlan } from '@/actions/pricing'
import Pagination from '@/components/admin/Pagination'

export default function AdminPricingPage() {
  const [plans, setPlans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [isFlexibleTime, setIsFlexibleTime] = useState(false)
  const [startTime, setStartTime] = useState('06:00')
  const [endTime, setEndTime] = useState('22:00')

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    timeSlot: '',
    description: '',
    notes: '',
    isActive: true
  })

  const loadData = async (pageToLoad = page) => {
    setIsLoading(true)
    const res = await getPricingPlans({ page: pageToLoad, limit: 10 })
    setPlans(res.data || [])
    setTotalPages(res.totalPages || 1)
    setPage(res.page || 1)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData(1)
  }, [])

  const openAddModal = () => {
    setFormData({ name: '', price: '', timeSlot: '06:00 - 22:00', description: '', notes: '', isActive: true })
    setIsFlexibleTime(false)
    setStartTime('06:00')
    setEndTime('22:00')
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (plan) => {
    let flex = false
    let start = '06:00'
    let end = '22:00'
    
    if (plan.timeSlot === 'Linh hoạt') {
      flex = true
    } else if (plan.timeSlot && plan.timeSlot.includes(' - ')) {
      const parts = plan.timeSlot.split(' - ')
      start = parts[0] || '06:00'
      end = parts[1] || '22:00'
    }

    setIsFlexibleTime(flex)
    setStartTime(start)
    setEndTime(end)

    setFormData({
      name: plan.name,
      price: plan.price || '',
      timeSlot: plan.timeSlot || '',
      description: plan.description || '',
      notes: plan.notes || '',
      isActive: plan.isActive
    })
    setEditingId(plan.id)
    setIsModalOpen(true)
  }

  useEffect(() => {
    if (!isModalOpen) return
    if (isFlexibleTime) {
      setFormData(prev => ({ ...prev, timeSlot: 'Linh hoạt' }))
    } else {
      setFormData(prev => ({ ...prev, timeSlot: `${startTime} - ${endTime}` }))
    }
  }, [isFlexibleTime, startTime, endTime, isModalOpen])

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa bảng giá này?')) {
      const res = await deletePricingPlan(id)
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
      res = await updatePricingPlan(editingId, formData)
    } else {
      res = await createPricingPlan(formData)
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
            Bảng giá thuê sân
          </h1>
          <p className="text-[#555555] mt-2 text-[15px]">
            Quản lý các mức giá theo giờ, theo ngày hoặc thẻ thành viên.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-[#D45A2A] hover:bg-[#B8431D] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 shrink-0"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Thêm bảng giá
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#E8E2D2] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#F8F5E4]/50 border-b border-[#E8E2D2]">
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider w-[35%]">Tên bảng giá</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Mức giá</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Khung giờ</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider text-center">Trạng thái</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D2]">
            {plans.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-[#888888]">Chưa có dữ liệu bảng giá</td>
              </tr>
            ) : (
              plans.map(item => (
                <tr key={item.id} className="hover:bg-[#FFF9EE] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F8F5E4] text-[#D45A2A] flex items-center justify-center shrink-0 shadow-sm">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-[#111111] text-[15px]">{item.name}</p>
                        <p className="text-[12px] text-[#888888] mt-0.5 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-[#D45A2A] text-[16px]">
                      {item.price}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#FAFAFA] border border-[#E8E2D2] text-[#555555] text-[13px] font-mono font-medium">
                      <svg className="w-4 h-4 mr-2 text-[#888888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.timeSlot}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                      item.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                      {item.isActive ? 'Hoạt động' : 'Tạm ẩn'}
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
        {!isLoading && plans.length > 0 && (
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={(p) => loadData(p)} 
          />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-[#E8E2D2] flex items-center justify-between bg-[#F8F5E4]/30 sticky top-0 z-10">
              <h3 className="font-heading font-bold text-lg text-[#111111]">
                {editingId ? 'Sửa bảng giá' : 'Thêm bảng giá mới'}
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
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Tên gói / Bảng giá <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all font-medium"
                    placeholder="Vd: Giờ hành chính, Cuối tuần..."
                  />
                </div>
                
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Mức giá</label>
                  <input 
                    type="text" 
                    name="price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all font-bold text-[#D45A2A]"
                    placeholder="Vd: 500.000đ/giờ"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[13px] font-bold text-[#111111]">Khung giờ áp dụng</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="isFlexibleTime"
                        checked={isFlexibleTime}
                        onChange={(e) => setIsFlexibleTime(e.target.checked)}
                        className="rounded border-[#E8E2D2] text-[#D45A2A] focus:ring-[#D45A2A]/50 cursor-pointer"
                      />
                      <label htmlFor="isFlexibleTime" className="text-[12px] text-[#555555] cursor-pointer select-none">Linh hoạt</label>
                    </div>
                  </div>
                  
                  {isFlexibleTime ? (
                    <input 
                      type="text" 
                      disabled
                      value="Linh hoạt"
                      className="w-full px-4 py-3 bg-[#E8E2D2]/50 border border-[#E8E2D2] rounded-xl text-[#888888] outline-none font-medium cursor-not-allowed"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <input 
                        type="time" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="flex-1 px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all font-mono"
                      />
                      <span className="text-[#888888] font-medium">-</span>
                      <input 
                        type="time" 
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="flex-1 px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Mô tả thêm</label>
                  <textarea 
                    name="description"
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E8E2D2] focus:bg-white focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all resize-none"
                    placeholder="Vd: Áp dụng cho hội viên VIP..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 p-4 bg-[#F8F5E4]/50 rounded-xl border border-[#E8E2D2]/50 cursor-pointer hover:border-[#D45A2A]/50 transition-colors" onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 rounded border-[#E8E2D2] text-[#D45A2A] focus:ring-[#D45A2A]/50 pointer-events-none"
                />
                <label htmlFor="isActive" className="text-[13px] font-bold text-[#111111] pointer-events-none">
                  Kích hoạt mức giá này (Hiển thị lên trang Booking)
                </label>
              </div>

              <div className="pt-4 flex gap-3 border-t border-[#E8E2D2] mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#F8F5E4] hover:bg-[#E8E2D2] text-[#555555] rounded-xl font-bold transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#D45A2A] hover:bg-[#B8431D] text-white rounded-xl font-bold transition-colors shadow-md hover:shadow-lg"
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
