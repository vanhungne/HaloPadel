'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function ContactPageHeader() {
  const { t } = useLanguage()

  return (
    <div className="text-center max-w-3xl mx-auto mb-4">
      <p className="text-[13px] font-semibold text-[#D45A2A] uppercase tracking-[0.2em] mb-3">
        {t.contactPage.label}
      </p>
      <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] font-bold text-[#111111] mb-4">
        {t.contactPage.title}
      </h1>
      <p className="text-[#555555] text-lg">
        {t.contactPage.subtitle}
      </p>
    </div>
  )
}
