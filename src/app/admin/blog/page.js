'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/actions/blog'
import { generateBlogContentWithAI } from '@/actions/ai/generateBlogContent'
import ImageUpload from '@/components/admin/ImageUpload'
import MarkdownEditor from '@/components/admin/MarkdownEditor'
import Pagination from '@/components/admin/Pagination'
import { LanguageTabs, TranslateButton, EnField } from '@/components/admin/TranslateTools'
import { formatDate } from '@/lib/utils'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    status: 'PUBLISHED',
    seoTitle: '',
    seoDescription: '',
    showOnHomepage: false,
    coverImagePrompt: '',
    titleEn: '',
    excerptEn: '',
    contentEn: '',
  })

  const [langTab, setLangTab] = useState('vi')

  // AI State
  const [showAiInput, setShowAiInput] = useState(false)
  const [aiIdea, setAiIdea] = useState('')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiProgressMessage, setAiProgressMessage] = useState('')

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadData = async (pageToLoad = page) => {
    setIsLoading(true)
    const res = await getBlogPosts({ page: pageToLoad, limit: 10 })
    setPosts(res.data || [])
    setTotalPages(res.totalPages || 1)
    setPage(res.page || 1)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData(1)
  }, [])

  const openAddModal = () => {
    setFormData({ 
      title: '', excerpt: '', content: '', coverImage: '', 
      status: 'PUBLISHED', seoTitle: '', seoDescription: '', showOnHomepage: false, coverImagePrompt: '',
      titleEn: '', excerptEn: '', contentEn: '',
    })
    setEditingId(null)
    setShowAiInput(false)
    setAiIdea('')
    setLangTab('vi')
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setFormData({
      title: item.title,
      excerpt: item.excerpt || '',
      content: item.content || '',
      coverImage: item.coverImage || '',
      status: item.status || 'DRAFT',
      seoTitle: item.seoTitle || '',
      seoDescription: item.seoDescription || '',
      showOnHomepage: item.showOnHomepage,
      coverImagePrompt: '',
      titleEn: item.titleEn || '',
      excerptEn: item.excerptEn || '',
      contentEn: item.contentEn || '',
    })
    setEditingId(item.id)
    setLangTab('vi')
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      const res = await deleteBlogPost(id)
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
      res = await updateBlogPost(editingId, formData)
    } else {
      res = await createBlogPost(formData)
    }
    
    if (res?.success) {
      setIsModalOpen(false)
      loadData()
    } else {
      alert(res?.error || 'Lỗi lưu dữ liệu')
    }
  }

  const handleGenerateAI = async () => {
    if (!aiIdea.trim()) return alert('Vui lòng nhập ý tưởng bài viết!')
    
    setIsGeneratingAI(true)
    setAiProgressMessage('Đang chọn API key và gửi yêu cầu tới Groq...')
    
    try {
      const res = await generateBlogContentWithAI(aiIdea)
      if (res.success) {
        setAiProgressMessage('Đang xử lý nội dung và hình ảnh...')
        const data = res.data
        
        // Tự động điền form
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          excerpt: data.excerpt || prev.excerpt,
          content: data.markdownContent || data.content || prev.content,
          seoTitle: data.seoTitle || prev.seoTitle,
          seoDescription: data.seoDescription || prev.seoDescription,
          coverImage: data.coverImageUrl || prev.coverImage,
          coverImagePrompt: data.coverImagePrompt || '',
          status: 'DRAFT' // Mặc định bài AI tạo ra phải ở trạng thái nháp
        }))
        
        setShowAiInput(false)
        setAiIdea('')
      } else {
        alert('Lỗi AI: ' + res.error)
      }
    } catch (err) {
      alert('Đã xảy ra lỗi hệ thống khi gọi AI.')
    } finally {
      setIsGeneratingAI(false)
      setAiProgressMessage('')
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
            Quản lý Bài viết (Blog)
          </h1>
          <p className="text-[#555555] mt-2">
            Đăng tin tức, kiến thức Padel để SEO lên top Google.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-[#D45A2A] hover:bg-[#B8431D] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Viết bài mới
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#E8E2D2] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#F8F5E4]/50 border-b border-[#E8E2D2]">
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Hình ảnh</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Thông tin bài viết</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider text-center">Trạng thái</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider">Ngày đăng</th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#888888] uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D2]">
            {posts.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-[#888888]">Chưa có bài viết nào</td>
              </tr>
            ) : (
              posts.map(item => (
                <tr key={item.id} className="hover:bg-[#F8F5E4]/30 transition-colors">
                  <td className="py-4 px-6 w-32">
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 border border-[#E8E2D2]">
                      <Image 
                        src={item.coverImage || '/placeholder.jpg'} 
                        alt={item.title} 
                        fill 
                        className="object-cover" 
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6 max-w-[300px]">
                    <p className="font-bold text-[#111111] line-clamp-2">{item.title}</p>
                    <p className="text-[12px] text-[#888888] mt-1 line-clamp-1">{item.excerpt}</p>
                    {item.showOnHomepage && <span className="inline-block mt-1 text-[10px] font-bold text-[#D45A2A] bg-[#FFF9EE] px-2 py-0.5 rounded">Hiện ở trang chủ</span>}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                      item.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[#555555] text-[13px]">
                    {formatDate(item.createdAt, 'dd/MM/yyyy')}
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
        {!isLoading && posts.length > 0 && (
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
                {editingId ? 'Sửa bài viết' : 'Viết bài mới'}
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
            
            {/* AI Generator Banner */}
            {!editingId && (
              <div className="bg-[#FFF9EE] border-b border-[#E8E2D2] px-6 py-4 flex flex-col sm:flex-row items-center gap-4 shrink-0">
                {!showAiInput ? (
                  <>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#D45A2A] flex items-center gap-2 text-sm">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Viết bài tự động bằng AI (Groq)
                      </h4>
                      <p className="text-xs text-[#555555] mt-1">Hệ thống sẽ tự động tạo bài viết chuẩn SEO, hình ảnh và điền vào form bên dưới.</p>
                    </div>
                    <button 
                      onClick={() => setShowAiInput(true)}
                      className="px-4 py-2 bg-gradient-to-r from-[#D45A2A] to-[#B8431D] text-white rounded-xl font-bold text-sm shadow hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      ✨ Viết bằng AI
                    </button>
                  </>
                ) : (
                  <div className="w-full flex flex-col sm:flex-row gap-3 items-center">
                    <input 
                      type="text" 
                      value={aiIdea}
                      onChange={(e) => setAiIdea(e.target.value)}
                      disabled={isGeneratingAI}
                      placeholder="Nhập ý tưởng... (VD: Vì sao người mới nên chơi Padel?)" 
                      className="flex-1 px-4 py-2 rounded-xl border border-[#E8E2D2] focus:border-[#D45A2A] outline-none w-full text-sm disabled:opacity-50"
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => setShowAiInput(false)}
                        disabled={isGeneratingAI}
                        className="px-4 py-2 text-[#555555] bg-white border border-[#E8E2D2] rounded-xl text-sm font-bold hover:bg-gray-50 disabled:opacity-50"
                      >
                        Hủy
                      </button>
                      <button 
                        onClick={handleGenerateAI}
                        disabled={isGeneratingAI || !aiIdea.trim()}
                        className="px-4 py-2 bg-[#D45A2A] text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isGeneratingAI ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang xử lý...
                          </>
                        ) : '✨ Tạo bài viết'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isGeneratingAI && (
              <div className="bg-blue-50 border-b border-blue-100 px-6 py-2 shrink-0 text-center text-sm font-medium text-blue-700 animate-pulse">
                {aiProgressMessage}
              </div>
            )}

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
              {/* Left Column: Post Settings */}
              <div className="w-full lg:w-[400px] shrink-0 border-r border-[#E8E2D2] bg-white overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Tiêu đề bài viết <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all font-medium"
                    placeholder="Luật chơi Padel cơ bản..."
                  />
                </div>
                
                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Trạng thái</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all cursor-pointer font-medium"
                  >
                    <option value="PUBLISHED">Đã xuất bản (Công khai)</option>
                    <option value="DRAFT">Bản nháp (Đang ẩn)</option>
                  </select>
                </div>

                <div>
                  <ImageUpload 
                    label="Ảnh bìa bài viết"
                    folder="halopadel/blog"
                    value={formData.coverImage}
                    onChange={(url) => setFormData({...formData, coverImage: url})}
                  />
                  {formData.coverImagePrompt && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <label className="block text-[11px] font-bold text-blue-700 uppercase mb-1">
                        Prompt ảnh bìa (Hãy copy lên Gemini tạo ảnh):
                      </label>
                      <p className="text-xs text-blue-800 italic">{formData.coverImagePrompt}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#111111] mb-1.5">Mô tả ngắn (Hiển thị ngoài danh sách)</label>
                  <textarea 
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all resize-none font-medium text-sm leading-relaxed"
                    placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                  />
                </div>

                {/* SEO Section */}
                <div className="bg-[#F8F5E4]/50 p-4 rounded-xl border border-[#E8E2D2]">
                  <h4 className="font-bold text-[#111111] mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Tối ưu SEO
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-bold text-[#111111] mb-1.5">SEO Title (Tiêu đề Google)</label>
                      <input 
                        type="text" 
                        value={formData.seoTitle}
                        onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-[#111111] mb-1.5">SEO Description (Mô tả Google)</label>
                      <textarea 
                        rows={2}
                        value={formData.seoDescription}
                        onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-[#E8E2D2] focus:border-[#D45A2A] rounded-xl text-[#111111] outline-none transition-all resize-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 bg-[#FFF9EE] border border-[#F8F5E4] p-3 rounded-xl cursor-pointer hover:border-[#D45A2A] transition-colors" onClick={() => setFormData({...formData, showOnHomepage: !formData.showOnHomepage})}>
                    <input 
                      type="checkbox" 
                      id="showOnHomepage"
                      checked={formData.showOnHomepage}
                      onChange={(e) => setFormData({...formData, showOnHomepage: e.target.checked})}
                      className="w-4 h-4 rounded border-[#E8E2D2] text-[#D45A2A] focus:ring-[#D45A2A]/50 pointer-events-none"
                    />
                    <label htmlFor="showOnHomepage" className="text-[13px] font-bold text-[#111111] pointer-events-none">
                      Ghim lên trang chủ (Mục Bài viết nổi bật)
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Content Editor + Translation */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA] p-0 lg:p-6 overflow-hidden">
                <div className="flex-1 flex flex-col h-full bg-white lg:rounded-xl shadow-sm lg:border border-[#E8E2D2] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[#E8E2D2] flex items-center justify-between bg-white">
                    <div>
                      <label className="block text-[15px] font-bold text-[#111111]">Nội dung bài viết</label>
                      <p className="text-[12px] text-[#888888] font-medium">Viết bằng Markdown, xem trước thời gian thực và chèn nhiều ảnh dễ dàng.</p>
                    </div>
                    <LanguageTabs langTab={langTab} setLangTab={setLangTab} />
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    {langTab === 'vi' ? (
                      <div className="h-full flex flex-col">
                        <div className="flex-1 min-h-0">
                          <MarkdownEditor 
                            value={formData.content}
                            onChange={(content) => setFormData({...formData, content})}
                          />
                        </div>
                        <div className="p-4 border-t border-[#E8E2D2]">
                          <TranslateButton
                            viFields={{ title: formData.title, excerpt: formData.excerpt, content: formData.content }}
                            onTranslated={(data) => {
                              setFormData(prev => ({
                                ...prev,
                                titleEn: data.title || prev.titleEn,
                                excerptEn: data.excerpt || prev.excerptEn,
                                contentEn: data.content || prev.contentEn,
                              }))
                              setLangTab('en')
                            }}
                            disabled={!formData.title}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 space-y-5 overflow-y-auto h-full">
                        <EnField label="Title (English)" value={formData.titleEn} onChange={(e) => setFormData({...formData, titleEn: e.target.value})} viValue={formData.title} />
                        <EnField label="Excerpt (English)" value={formData.excerptEn} onChange={(e) => setFormData({...formData, excerptEn: e.target.value})} viValue={formData.excerpt} multiline />
                        <EnField label="Content (English)" value={formData.contentEn} onChange={(e) => setFormData({...formData, contentEn: e.target.value})} viValue={formData.content?.substring(0, 100)} multiline />
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
                {editingId ? 'Lưu thay đổi' : 'Đăng bài viết'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
