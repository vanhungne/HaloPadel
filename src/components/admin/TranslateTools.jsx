'use client'

import { useState } from 'react'
import { translateToEnglish } from '@/actions/ai/translateContent'

/**
 * Reusable AI translate button + language tabs for admin CMS forms
 * 
 * @param {Object} props
 * @param {string} props.langTab - Current language tab ('vi' or 'en')
 * @param {Function} props.setLangTab - Setter for language tab
 * @param {Object} props.viFields - Vietnamese field values to translate, e.g. { title: "...", shortDesc: "..." }
 * @param {Function} props.onTranslated - Callback with translated data, e.g. (data) => setFormData(...)
 * @param {boolean} props.disabled - Disable the button
 */
export function LanguageTabs({ langTab, setLangTab }) {
  return (
    <div className="flex items-center gap-2 p-1 bg-[#F8F5E4] rounded-xl w-fit">
      <button
        type="button"
        onClick={() => setLangTab('vi')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
          langTab === 'vi' 
            ? 'bg-white text-[#111111] shadow-sm' 
            : 'text-[#888888] hover:text-[#555555]'
        }`}
      >
        🇻🇳 Tiếng Việt
      </button>
      <button
        type="button"
        onClick={() => setLangTab('en')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
          langTab === 'en' 
            ? 'bg-white text-[#111111] shadow-sm' 
            : 'text-[#888888] hover:text-[#555555]'
        }`}
      >
        🇬🇧 English
      </button>
    </div>
  )
}

export function TranslateButton({ viFields, onTranslated, disabled }) {
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = async () => {
    // Filter out empty fields
    const fieldsToTranslate = {}
    for (const [key, value] of Object.entries(viFields)) {
      if (value && typeof value === 'string' && value.trim()) {
        fieldsToTranslate[key] = value
      }
    }

    if (Object.keys(fieldsToTranslate).length === 0) {
      alert('Vui lòng nhập nội dung tiếng Việt trước khi dịch.')
      return
    }

    setIsTranslating(true)
    try {
      const res = await translateToEnglish(fieldsToTranslate)
      if (res.success && res.data) {
        onTranslated(res.data)
      } else {
        alert(res.error || 'Lỗi khi dịch')
      }
    } catch (err) {
      alert('Lỗi: ' + err.message)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={isTranslating || disabled}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-bold text-[14px] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
    >
      {isTranslating ? (
        <>
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang dịch...
        </>
      ) : (
        <>🤖 Dịch sang English (AI)</>
      )}
    </button>
  )
}

/**
 * English field input with Vietnamese reference shown below
 */
export function EnField({ label, value, onChange, viValue, multiline = false, placeholder }) {
  const Component = multiline ? 'textarea' : 'input'
  return (
    <div>
      <label className="block text-[13px] font-bold text-[#111111] mb-1.5">{label}</label>
      <Component
        {...(multiline ? { rows: 3 } : { type: 'text' })}
        value={value || ''}
        onChange={onChange}
        className="w-full px-4 py-3 bg-[#F0F7FF] border border-blue-200 focus:bg-white focus:border-blue-400 rounded-xl text-[#111111] outline-none transition-all font-medium resize-none"
        placeholder={placeholder || `English ${label.toLowerCase()}...`}
      />
      {viValue && (
        <p className="text-[12px] text-[#888888] mt-1 line-clamp-2">🇻🇳 {viValue}</p>
      )}
    </div>
  )
}
