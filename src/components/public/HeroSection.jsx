import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection({ venue, heroImage }) {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', minHeight: '650px', maxHeight: '960px' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {heroImage ? (
          <Image
            src={heroImage.url}
            alt={heroImage.altText || venue?.name || 'HaloPadel'}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#8A3518] via-[#BE4F24] to-[#D4784F]" />
        )}

        {/* === Multi-layer overlay for premium readability === */}
        {/* Layer 1: Strong left-side gradient for text area */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(100deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.60) 40%, rgba(10,10,10,0.22) 70%, rgba(10,10,10,0.10) 100%)',
          }}
        />
        {/* Layer 2: Top-down gradient to darken upper area where title sits */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0.15) 50%, transparent 70%)',
          }}
        />
        {/* Layer 3: Subtle full overlay for cohesion */}
        <div className="absolute inset-0 bg-black/8" />

        {/* Bottom fade to cream */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '160px',
            background: 'linear-gradient(to top, #F8F5E4 0%, rgba(248,245,228,0.7) 35%, rgba(248,245,228,0) 100%)',
          }}
        />
      </div>

      {/* Content - vertically centered with header offset */}
      <div className="relative z-10 h-full flex items-center" style={{ paddingTop: '76px' }}>
        <div className="section-container w-full">
          <div className="max-w-[640px]">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[13px] font-medium text-white mb-8"
              style={{
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Đang mở cửa
            </div>

            {/* Title */}
            <h1 className="font-heading font-extrabold text-white leading-[1.05] mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 3.8rem)',
                textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 1px 6px rgba(0,0,0,0.3)',
              }}
            >
              HaloPadel<br />
              <span className="text-white">Sports Club</span>
            </h1>

            {/* Accent line */}
            <div className="w-16 h-[3px] bg-[#BE4F24] rounded-full mb-6" />

            {/* Subtitle */}
            <p
              className="text-white/85 leading-[1.8] mb-10 max-w-[500px]"
              style={{
                fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                textShadow: '0 1px 8px rgba(0,0,0,0.3)',
              }}
            >
              Sân padel chuyên nghiệp với không gian hiện đại, tiện ích đầy đủ và vị trí thuận tiện tại TP. Đà Nẵng.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              {/* 1. Gọi tư vấn - Primary solid */}
              {venue?.hotline && (
                <a
                  href={`tel:${venue.hotline}`}
                  className="inline-flex items-center justify-center gap-2.5 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    height: '52px',
                    padding: '0 30px',
                    borderRadius: '14px',
                    fontSize: '15px',
                    background: '#BE4F24',
                    boxShadow: '0 4px 20px rgba(190,79,36,0.4)',
                  }}
                >
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Gọi tư vấn
                </a>
              )}

              {/* 2. Chat Zalo - Glass */}
              {venue?.zalo && (
                <a
                  href={`https://zalo.me/${venue.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/18 active:translate-y-0"
                  style={{
                    height: '52px',
                    padding: '0 28px',
                    borderRadius: '14px',
                    fontSize: '15px',
                    background: 'rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.20)',
                  }}
                >
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  Chat Zalo
                </a>
              )}

              {/* 3. Xem hình ảnh sân - Glass outline */}
              <Link
                href="/hinh-anh"
                className="inline-flex items-center justify-center gap-2.5 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/14 active:translate-y-0"
                style={{
                  height: '52px',
                  padding: '0 28px',
                  borderRadius: '14px',
                  fontSize: '15px',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.16)',
                }}
              >
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Xem hình ảnh sân
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/30">
        <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
