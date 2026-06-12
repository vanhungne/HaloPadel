import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'

const typeConfig = {
  INFO: { icon: 'ℹ', bg: 'bg-blue-50', text: 'text-blue-600', label: 'Thông tin' },
  PROMOTION: { icon: '🎁', bg: 'bg-[#BE4F24]/5', text: 'text-[#BE4F24]', label: 'Ưu đãi' },
  EVENT: { icon: '🏆', bg: 'bg-amber-50', text: 'text-amber-600', label: 'Sự kiện' },
  MAINTENANCE: { icon: '🔧', bg: 'bg-gray-100', text: 'text-gray-600', label: 'Bảo trì' },
  WARNING: { icon: '⚠', bg: 'bg-red-50', text: 'text-red-500', label: 'Cảnh báo' },
}

export default function AnnouncementsSection({ announcements, section }) {
  if (!announcements || announcements.length === 0) return null

  return (
    <section id="announcements" className="py-20 md:py-28 bg-[#FFFDF6]">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-[#BE4F24] uppercase tracking-[0.2em] mb-3">
            Cập nhật
          </p>
          <h2 className="font-heading text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-3">
            {section?.title || 'Thông báo'}
          </h2>
          <p className="text-[#555555] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {section?.subtitle || 'Cập nhật tin tức mới nhất'}
          </p>
        </div>

        {/* Announcements List */}
        <div className="max-w-2xl mx-auto space-y-3">
          {announcements.map((ann) => {
            const config = typeConfig[ann.type] || typeConfig.INFO
            return (
              <Link
                key={ann.id}
                href={`/thong-bao/${ann.slug}`}
                className="flex items-center gap-4 bg-white rounded-xl p-4 md:p-5 border border-[#E8E2D2] hover:border-[#BE4F24]/20 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200 group"
              >
                {/* Type icon */}
                <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0 text-base`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {ann.isPinned && (
                      <span className="text-[10px] font-bold text-[#BE4F24] bg-[#BE4F24]/8 px-1.5 py-0.5 rounded uppercase tracking-wide">
                        Ghim
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold ${config.text} ${config.bg} px-1.5 py-0.5 rounded uppercase tracking-wide`}>
                      {config.label}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-[#111111] group-hover:text-[#BE4F24] transition-colors truncate">
                    {ann.title}
                  </h3>
                  <p className="text-[11.5px] text-[#888888] mt-0.5">
                    {formatRelativeTime(ann.createdAt)}
                  </p>
                </div>

                {/* Arrow */}
                <svg className="w-4 h-4 text-[#CCCCCC] group-hover:text-[#BE4F24] shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )
          })}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            href="/thong-bao"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#BE4F24] hover:text-[#A9411D] transition-colors"
          >
            Xem tất cả thông báo
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
