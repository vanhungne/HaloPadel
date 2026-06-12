export default function QuickInfo({ venue }) {
  if (!venue) return null

  const items = [
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: 'Địa chỉ',
      value: venue.address,
      href: venue.googleMapsUrl,
      target: '_blank',
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: 'Hotline',
      value: venue.hotline,
      href: venue.hotline ? `tel:${venue.hotline}` : null,
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
      label: 'Zalo',
      value: venue.zalo ? `Zalo: ${venue.zalo}` : null,
      href: venue.zalo ? `https://zalo.me/${venue.zalo}` : null,
      target: '_blank',
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: 'Giờ mở cửa',
      value: '06:00 – 22:00 hàng ngày',
    },
  ].filter((item) => item.value)

  return (
    <section id="quickinfo" className="relative z-20 -mt-10 md:-mt-12">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-[#FFFDF6] rounded-2xl p-5 border border-[#E8E2D2] hover:border-[#BE4F24]/20 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] group"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F8F5E4] group-hover:bg-[#BE4F24]/8 flex items-center justify-center shrink-0 text-[#BE4F24] transition-colors duration-300">
                  {item.icon}
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[11px] text-[#888888] font-medium uppercase tracking-[0.12em] mb-1">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.target}
                      rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className="text-[13.5px] font-semibold text-[#111111] hover:text-[#BE4F24] transition-colors break-words leading-snug"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-[13.5px] font-semibold text-[#111111] break-words leading-snug">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
