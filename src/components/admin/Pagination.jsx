import React from 'react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const getPages = () => {
    let pages = []
    const delta = 2
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i)
    }

    if (currentPage - delta > 2) {
      pages.unshift('...')
    }
    if (currentPage + delta < totalPages - 1) {
      pages.push('...')
    }

    pages.unshift(1)
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-[#E8E2D2]">
      <div className="text-[13px] text-[#888888]">
        Trang <span className="font-bold text-[#111111]">{currentPage}</span> trên tổng số <span className="font-bold text-[#111111]">{totalPages}</span>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg text-[#555555] hover:bg-[#F8F5E4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {getPages().map((page, idx) => (
          <button
            key={idx}
            onClick={() => page !== '...' && onPageChange(page)}
            disabled={page === '...'}
            className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-[13px] font-bold transition-colors ${
              page === currentPage
                ? 'bg-[#D45A2A] text-white'
                : page === '...'
                ? 'text-[#888888] cursor-default'
                : 'text-[#555555] hover:bg-[#F8F5E4]'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg text-[#555555] hover:bg-[#F8F5E4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
