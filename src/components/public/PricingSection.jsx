export default function PricingSection({ plans, section }) {
  if (!plans || plans.length === 0) return null

  return (
    <section id="pricing" className="py-20 md:py-28 bg-[#FFFDF6]">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-[13px] font-semibold text-[#BE4F24] uppercase tracking-[0.2em] mb-3">
            Bảng giá
          </p>
          <h2 className="font-heading text-3xl md:text-[2.5rem] font-bold text-[#111111] leading-tight mb-3">
            {section?.title || 'Bảng giá thuê sân'}
          </h2>
          <p className="text-[#555555] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {section?.subtitle || 'Giá cả hợp lý, nhiều ưu đãi hấp dẫn'}
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="max-w-4xl mx-auto">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_140px_140px_1fr] gap-0 bg-[#111111] rounded-t-2xl px-6 py-3.5 text-[12px] font-semibold text-white/70 uppercase tracking-wider">
            <span>Khung giờ</span>
            <span className="text-center">Thời gian</span>
            <span className="text-center">Giá</span>
            <span>Ghi chú</span>
          </div>

          {/* Table Rows */}
          <div className="space-y-0">
            {plans.map((plan, index) => {
              const isHighlight = plan.notes?.includes('Tiết kiệm')
              return (
                <div
                  key={plan.id}
                  className={`relative group transition-all duration-200 border border-[#E8E2D2] md:border-t-0 ${
                    index === 0 ? 'rounded-t-2xl md:rounded-t-none' : ''
                  } ${index === plans.length - 1 ? 'rounded-b-2xl' : ''} ${
                    isHighlight
                      ? 'bg-[#BE4F24]/[0.03] border-[#BE4F24]/20'
                      : 'bg-white hover:bg-[#F8F5E4]/50'
                  }`}
                >
                  {/* HOT badge */}
                  {isHighlight && (
                    <div className="absolute -top-2.5 right-4 md:right-6 px-3 py-0.5 bg-[#BE4F24] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Tiết kiệm
                    </div>
                  )}

                  {/* Mobile layout */}
                  <div className="md:hidden p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-[15px] text-[#111111]">{plan.name}</h3>
                        {plan.timeSlot && (
                          <p className="text-[12px] text-[#888888] mt-0.5">{plan.timeSlot}</p>
                        )}
                      </div>
                      <span className={`text-lg font-bold ${isHighlight ? 'text-[#BE4F24]' : 'text-[#111111]'}`}>
                        {plan.price}
                      </span>
                    </div>
                    {plan.description && (
                      <p className="text-[12px] text-[#555555] mb-1">{plan.description}</p>
                    )}
                    {plan.notes && (
                      <p className="text-[11px] text-[#888888]">{plan.notes}</p>
                    )}
                  </div>

                  {/* Desktop layout - table row */}
                  <div className="hidden md:grid grid-cols-[1fr_140px_140px_1fr] gap-0 items-center px-6 py-4">
                    <div>
                      <h3 className="font-semibold text-[14px] text-[#111111]">{plan.name}</h3>
                      {plan.description && (
                        <p className="text-[12px] text-[#888888] mt-0.5">{plan.description}</p>
                      )}
                    </div>
                    <span className="text-center text-[13px] text-[#555555] font-medium">
                      {plan.timeSlot || '—'}
                    </span>
                    <span className={`text-center text-[16px] font-bold ${isHighlight ? 'text-[#BE4F24]' : 'text-[#111111]'}`}>
                      {plan.price}
                    </span>
                    <span className="text-[12px] text-[#888888]">
                      {plan.notes || '—'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-[14px] text-[#555555] mb-4">
            Liên hệ để được tư vấn gói phù hợp nhất
          </p>
          <a
            href="tel:0909123456"
            className="inline-flex items-center gap-2.5 h-[48px] px-8 bg-[#BE4F24] hover:bg-[#A9411D] text-white rounded-2xl font-semibold text-[15px] transition-all duration-200 hover:-translate-y-0.5"
            style={{ boxShadow: '0 4px 14px rgba(190,79,36,0.25)' }}
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Liên hệ tư vấn
          </a>
        </div>
      </div>
    </section>
  )
}
