'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/actions/blog'
import ImageUpload from '@/components/admin/ImageUpload'
import MarkdownEditor from '@/components/admin/MarkdownEditor'
import Pagination from '@/components/admin/Pagination'
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
    showOnHomepage: false
  })

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
      status: 'PUBLISHED', seoTitle: '', seoDescription: '', showOnHomepage: false 
    })
    setEditingId(null)
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
      showOnHomepage: item.showOnHomepage
    })
    setEditingId(item.id)
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

              {/* Right Column: Markdown Editor */}
              <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA] p-0 lg:p-6 overflow-hidden">
                <div className="flex-1 flex flex-col h-full bg-white lg:rounded-xl shadow-sm lg:border border-[#E8E2D2] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[#E8E2D2] flex items-center justify-between bg-white">
                    <div>
                      <label className="block text-[15px] font-bold text-[#111111]">Nội dung bài viết (Markdown)</label>
                      <p className="text-[12px] text-[#888888] font-medium">Viết bằng Markdown, xem trước thời gian thực và chèn nhiều ảnh dễ dàng.</p>
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
                {editingId ? 'Lưu thay đổi' : 'Đăng bài viết'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
