'use client'

import { useState, useRef, useEffect } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { uploadImageToCloudinary } from '@/actions/upload'

// Cấu hình marked để render markdown an toàn và đẹp
marked.setOptions({
  breaks: true,
  gfm: true
})

export default function MarkdownEditor({ value, onChange, placeholder = 'Nội dung bài viết...' }) {
  const [isPreview, setIsPreview] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  // Render HTML an toàn
  const getRenderedHTML = () => {
    const rawHTML = marked(value || '')
    // Chỉ chạy DOMPurify trên client
    if (typeof window !== 'undefined') {
      return { __html: DOMPurify.sanitize(rawHTML) }
    }
    return { __html: rawHTML }
  }

  // Chèn text vào vị trí con trỏ
  const insertText = (before, after = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    onChange(newText)

    // Đặt lại vị trí con trỏ sau khi React render xong
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  // Upload nhiều ảnh vào nội dung
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'halopadel/blog_content')

      const result = await uploadImageToCloudinary(formData)
      if (result.success) {
        insertText(`\n![Hình ảnh](${result.url})\n`)
      } else {
        alert(result.error || 'Lỗi tải ảnh')
      }
    } catch (error) {
      console.error(error)
      alert('Đã xảy ra lỗi khi upload')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col border border-[#E8E2D2] rounded-xl overflow-hidden bg-white h-full min-h-[500px]">
      
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#E8E2D2] bg-[#F8F5E4]/30">
        <div className="flex items-center gap-1 flex-wrap">
          <button type="button" onClick={() => insertText('**', '**')} className="p-1.5 text-[#555555] hover:bg-[#E8E2D2] rounded transition-colors tooltip" title="In đậm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 100-8H6v8zm0 0h9a4 4 0 110 8H6v-8z" /></svg>
          </button>
          <button type="button" onClick={() => insertText('*', '*')} className="p-1.5 text-[#555555] hover:bg-[#E8E2D2] rounded transition-colors tooltip" title="In nghiêng">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          </button>
          <div className="w-px h-5 bg-[#E8E2D2] mx-1"></div>
          <button type="button" onClick={() => insertText('## ')} className="p-1.5 font-bold text-[#555555] hover:bg-[#E8E2D2] rounded transition-colors text-sm" title="Tiêu đề 2">H2</button>
          <button type="button" onClick={() => insertText('### ')} className="p-1.5 font-bold text-[#555555] hover:bg-[#E8E2D2] rounded transition-colors text-sm" title="Tiêu đề 3">H3</button>
          <div className="w-px h-5 bg-[#E8E2D2] mx-1"></div>
          <button type="button" onClick={() => insertText('- ')} className="p-1.5 text-[#555555] hover:bg-[#E8E2D2] rounded transition-colors" title="Danh sách">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <button type="button" onClick={() => insertText('[Link text](url)')} className="p-1.5 text-[#555555] hover:bg-[#E8E2D2] rounded transition-colors" title="Chèn Link">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          </button>
          <div className="w-px h-5 bg-[#E8E2D2] mx-1"></div>
          
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            className="flex items-center gap-1 p-1.5 text-[#D45A2A] font-medium hover:bg-[#FFF9EE] rounded transition-colors text-sm"
          >
            {isUploading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            )}
            Chèn ảnh
          </button>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        </div>

        <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg">
          <button 
            type="button" 
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${!isPreview ? 'bg-white shadow-sm text-[#111111]' : 'text-[#888888] hover:text-[#111111]'}`}
          >
            Hai cột
          </button>
          <button 
            type="button" 
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${isPreview ? 'bg-white shadow-sm text-[#111111]' : 'text-[#888888] hover:text-[#111111]'}`}
          >
            Xem trước
          </button>
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className={`flex-1 border-r border-[#E8E2D2] ${isPreview ? 'hidden' : 'block'}`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 resize-none outline-none font-mono text-[14px] leading-relaxed text-[#111111] bg-white"
          />
        </div>

        {/* Preview */}
        <div className={`flex-1 overflow-y-auto bg-[#FAFAFA] p-6 prose prose-slate max-w-none ${isPreview ? 'block w-full' : 'hidden lg:block'}`}>
          {value ? (
            <div dangerouslySetInnerHTML={getRenderedHTML()} />
          ) : (
            <div className="text-gray-400 italic mt-4 text-center">Nội dung xem trước sẽ hiển thị ở đây...</div>
          )}
        </div>
      </div>
    </div>
  )
}
