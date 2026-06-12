'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function GalleryPageHeader() {
  const { t } = useLanguage()

  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] font-bold text-[#111111] mb-4">
        {t.gallery.pageTitle}
      </h1>
      <p className="text-[#555555] text-lg">
        {t.gallery.pageSubtitle}
      </p>
    </div>
  )
}
