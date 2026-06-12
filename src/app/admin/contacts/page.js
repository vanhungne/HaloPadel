'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils'
import { getContacts, updateContactStatus } from '@/actions/contacts'

export default function AdminContactsPage() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [contacts, setContacts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getContacts()
        setContacts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredContacts = contacts.filter(c => activeTab === 'ALL' || c.status === activeTab)

  const handleStatusChange = async (id, newStatus) => {
    setIsUpdating(true)
    
    // Optimistic UI update
    setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c))
    
    // API Call
    const result = await updateContactStatus(id, newStatus)
    if (!result?.success) {
      alert(result?.error || 'Lỗi cập nhật trạng thái')
      // Revert on failure (could refetch, but let's just alert for now)
      const data = await getContacts()
      setContacts(data)
    }
    
    setIsUpdating(false)
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'NEW': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold bg-red-100 text-red-700">Mới</span>
      case 'CONTACTED': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold bg-blue-100 text-blue-700">Đang xử lý</span>
      case 'RESOLVED': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold bg-green-100 text-green-700">Hoàn thành</span>
      default: return null
    }
  }

  const newCount = contacts.filter(c => c.status === 'NEW').length

  if (isLoading) {
    return <div className="p-8 text-center text-[#888888]">Đang tải dữ liệu...</div>
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-[1200px] mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#111111]">
            Khách hàng liên hệ
          </h1>
          <p className="text-[#555555] mt-2">
            Quản lý danh sách khách hàng để lại thông tin tư vấn từ Website.
          </p>
        </div>
        <div className="flex bg-[#E8E2D2] p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${activeTab === 'ALL' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#888888] hover:text-[#111111]'}`}
          >
            Tất cả
          </button>
          <button 
            onClick={() => setActiveTab('NEW')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-2 ${activeTab === 'NEW' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#888888] hover:text-[#111111]'}`}
          >
            Mới {newCount > 0 && <span className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]">{newCount}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('CONTACTED')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${activeTab === 'CONTACTED' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#888888] hover:text-[#111111]'}`}
          >
            Đang xử lý
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-[#E8E2D2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F8F5E4]/50 border-b border-[#E8E2D2]">
                <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Thời gian</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Khách hàng</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Nội dung tư vấn</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider text-center">Trạng thái</th>
                <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D2]">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[#888888]">
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-[#F8F5E4]/30 transition-colors">
                    <td className="py-4 px-6 text-[#555555] text-[14px] whitespace-nowrap">
                      {formatDate(new Date(contact.time), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-[#111111]">{contact.name}</p>
                      <p className="text-[13px] text-[#D45A2A] font-semibold mt-0.5">{contact.phone}</p>
                      {contact.email && contact.email !== 'N/A' && <p className="text-[12px] text-[#888888]">{contact.email}</p>}
                    </td>
                    <td className="py-4 px-6 text-[#555555] max-w-[300px]">
                      <p className="line-clamp-2">{contact.note || <span className="italic text-gray-400">Không có nội dung</span>}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select 
                        value={contact.status}
                        onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                        disabled={isUpdating}
                        className="bg-[#F8F5E4] border border-[#E8E2D2] text-[#111111] text-[13px] font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:border-[#D45A2A] disabled:opacity-50"
                      >
                        <option value="NEW">Mới</option>
                        <option value="CONTACTED">Đang xử lý</option>
                        <option value="RESOLVED">Hoàn thành</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
