export default function GoogleMap({ venue, section }) {
  return (
    <section id="map" className="py-20 md:py-28">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-[#BE4F24] uppercase tracking-[0.2em] mb-3">
            Vị trí
          </p>
          <h2 className="font-heading text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-3">
            {section?.title || 'Bản đồ'}
          </h2>
          <p className="text-[#555555] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {section?.subtitle || 'Tìm đường đến với chúng tôi'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* Map */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-[#E8E2D2] h-[320px] md:h-[400px]">
            {venue?.googleMapsEmbed ? (
              <div
                dangerouslySetInnerHTML={{ __html: venue.googleMapsEmbed }}
                className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
              />
            ) : (
              <div className="w-full h-full bg-[#F8F5E4] flex items-center justify-center">
                <div className="text-center text-[#888888]">
                  <svg className="w-12 h-12 mx-auto mb-3 text-[#CCCCCC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-sm">Bản đồ đang được cập nhật</p>
                </div>
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-[#FFFDF6] rounded-2xl p-6 md:p-7 border border-[#E8E2D2]">
            <h3 className="font-heading text-lg font-bold text-[#111111] mb-6">
              Thông tin liên hệ
            </h3>
            <div className="space-y-5">
              {[
                { icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', icon2: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Địa chỉ', value: venue?.address, href: venue?.googleMapsUrl, target: '_blank' },
                { icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z', label: 'Hotline', value: venue?.hotline, href: venue?.hotline ? `tel:${venue.hotline}` : null },
                { icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z', label: 'Zalo', value: venue?.zalo, href: venue?.zalo ? `https://zalo.me/${venue.zalo}` : null, target: '_blank' },
                { icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', icon2: 'M22 6l-10 7L2 6', label: 'Email', value: venue?.email, href: venue?.email ? `mailto:${venue.email}` : null },
              ].filter(i => i.value).map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F8F5E4] flex items-center justify-center shrink-0 text-[#BE4F24]">
                    <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                      {item.icon2 && <path d={item.icon2} />}
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#888888] uppercase tracking-[0.1em] font-medium mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target={item.target} rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                        className="text-[13px] font-medium text-[#111111] hover:text-[#BE4F24] transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-[13px] font-medium text-[#111111]">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Direction button */}
            {venue?.googleMapsUrl && (
              <a
                href={venue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 w-full inline-flex items-center justify-center gap-2 h-[44px] bg-[#BE4F24] hover:bg-[#A9411D] text-white rounded-xl font-semibold text-[13.5px] transition-all"
              >
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Xem chỉ đường
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
