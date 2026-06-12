'use client'

import { useState, useEffect } from 'react'
import { getLandingSections, updateLandingSectionStatus, updateLandingSectionOrder } from '@/actions/landing'

export default function AdminLandingPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sections, setSections] = useState([])

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getLandingSections()
        
        // Map data to match UI expectations
        const mappedSections = data.map(sec => ({
          id: sec.id,
          sectionKey: sec.sectionKey,
          name: sec.title || sec.name || sec.sectionKey,
          description: sec.subtitle || sec.description || '',
          isActive: sec.isActive,
          displayOrder: sec.displayOrder,
          // Lock hero and contact sections so they can't be hidden or moved
          locked: sec.sectionKey === 'hero' || sec.sectionKey === 'contact'
        }))
        
        setSections(mappedSections)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const toggleSection = async (index) => {
    const newSections = [...sections]
    if (!newSections[index].locked) {
      newSections[index].isActive = !newSections[index].isActive
      setSections(newSections)
      
      // Update DB instantly
      await updateLandingSectionStatus(newSections[index].id, newSections[index].isActive)
    }
  }

  const moveUp = (index) => {
    if (index === 0 || sections[index].locked || sections[index - 1].locked) return
    const newSections = [...sections]
    const temp = newSections[index]
    newSections[index] = newSections[index - 1]
    newSections[index - 1] = temp
    setSections(newSections)
  }

  const moveDown = (index) => {
    if (index === sections.length - 1 || sections[index].locked || sections[index + 1].locked) return
    const newSections = [...sections]
    const temp = newSections[index]
    newSections[index] = newSections[index + 1]
    newSections[index + 1] = temp
    setSections(newSections)
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    
    const sectionsToUpdate = sections.map((sec, index) => ({
      id: sec.id,
      displayOrder: index + 1
    }))
    
    const result = await updateLandingSectionOrder(sectionsToUpdate)
    
    setIsSaving(false)
    if (result?.success) {
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } else {
      alert(result?.error || 'Lỗi khi lưu')
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-[#888888]">Đang tải dữ liệu...</div>
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-[1000px] mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#111111]">
            Landing Page
          </h1>
          <p className="text-[#555555] mt-2">
            Quản lý bật/tắt và sắp xếp thứ tự các khối nội dung trên trang chủ.
          </p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 bg-[#D45A2A] hover:bg-[#B8431D] text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-70 shadow-md hover:shadow-lg hover:-translate-y-0.5"
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
          Lưu cài đặt
        </button>
      </div>

      {/* Success Notification */}
      {isSuccess && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-800 font-medium">Lưu cài đặt thành công! Thứ tự Landing Page đã được cập nhật.</p>
        </div>
      )}

      {/* Builder List */}
      <div className="bg-white rounded-2xl border border-[#E8E2D2] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E2D2] bg-[#F8F5E4]/30 flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-[#111111]">Cấu trúc Trang chủ</h2>
          <span className="text-[12px] font-medium text-[#888888]">{sections.length} Blocks</span>
        </div>
        
        <div className="p-0">
          <ul className="divide-y divide-[#E8E2D2]">
            {sections.map((section, index) => (
              <li 
                key={section.id}
                className={`p-4 flex items-center justify-between transition-colors ${
                  section.locked ? 'bg-gray-50/50' : 'hover:bg-[#F8F5E4]/30'
                }`}
              >
                {/* Left Info */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1 text-[#888888]">
                    <button 
                      onClick={() => moveUp(index)}
                      disabled={section.locked || index === 0 || sections[index - 1].locked}
                      className="p-0.5 rounded hover:bg-[#E8E2D2] disabled:opacity-30 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => moveDown(index)}
                      disabled={section.locked || index === sections.length - 1 || sections[index + 1].locked}
                      className="p-0.5 rounded hover:bg-[#E8E2D2] disabled:opacity-30 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111111] text-[15px] flex items-center gap-2">
                      {section.name}
                      {section.locked && (
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </h3>
                    <p className="text-[13px] text-[#888888] mt-0.5">{section.description}</p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                  {/* Status Badge */}
                  <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    section.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {section.isActive ? 'Đang bật' : 'Đã ẩn'}
                  </span>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleSection(index)}
                    disabled={section.locked}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      section.isActive ? 'bg-[#D45A2A]' : 'bg-gray-300'
                    } ${section.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="sr-only">Toggle {section.name}</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        section.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
