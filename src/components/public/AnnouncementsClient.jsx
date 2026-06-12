'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { localize } from '@/lib/i18n/localize'

export default function AnnouncementsClient({ announcements = [] }) {
  const [activeTab, setActiveTab] = useState('ALL')
  const { t, locale } = useLanguage()

  const tabs = [
    { id: 'ALL', label: t.common.all },
    { id: 'INFO', label: t.announcements.tabSchedule },
    { id: 'EVENT', label: t.announcements.tabEvent },
    { id: 'PROMO', label: t.announcements.tabPromo },
    { id: 'RULE', label: t.announcements.tabRule }
  ]

  const filteredAnnouncements = announcements.filter(item => {
    if (activeTab === 'ALL') return true
    return item.type === activeTab
  })

  const featuredItem = filteredAnnouncements.find(item => item.isPinned)
  const listItems = filteredAnnouncements.filter(item => !item.isPinned)

  const getTypeStyle = (type) => {
    switch (type) {
      case 'INFO': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'ℹ️' }
      case 'EVENT': return { bg: 'bg-purple-100', text: 'text-purple-700', icon: '🏆' }
      case 'PROMO': return { bg: 'bg-green-100', text: 'text-green-700', icon: '🎁' }
      case 'RULE': return { bg: 'bg-red-100', text: 'text-red-700', icon: '⚠️' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '📌' }
    }
  }

  return (
    <div className="py-12 md:py-20 bg-[#FFFDF6] min-h-screen">
      <div className="w-full px-4 md:px-8 max-w-[1000px] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#111111] mb-4 uppercase tracking-wide">
            {t.announcements.pageTitle}
          </h1>
          <p className="text-[#555555] text-lg">
            {t.announcements.pageSubtitle}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#111111] text-white shadow-md' 
                    : 'bg-white text-[#555555] border border-[#E8E2D2] hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Featured Announcement */}
        {featuredItem && (
          <div className="mb-8">
            <Link 
              href={`/thong-bao/${featuredItem.slug}`}
              className="block relative p-8 md:p-12 rounded-[28px] overflow-hidden group transition-transform hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #FFF9EE 0%, #FBEAD8 100%)',
                border: '1px solid rgba(212, 90, 42, 0.18)',
                boxShadow: '0 24px 70px rgba(212, 90, 42, 0.12)'
              }}
            >
              {featuredItem.image && (
                <div className="w-full h-[250px] relative rounded-[20px] mb-8 overflow-hidden">
                  <Image src={featuredItem.image} alt={featuredItem.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      {t.announcements.pinned}
                    </span>
                    <span className="bg-[#D45A2A]/10 text-[#D45A2A] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {t.announcements.importantNotice}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#111111] mb-4 leading-tight group-hover:text-[#D45A2A] transition-colors">
                    {localize(featuredItem, 'title', locale)}
                  </h2>
                  <p className="text-[#555555] text-lg mb-6 leading-relaxed line-clamp-3">
                    {localize(featuredItem, 'excerpt', locale) || featuredItem.content?.substring(0, 150) + '...'}
                  </p>
                  <div className="flex flex-wrap items-center gap-6">
                    {featuredItem.effectiveDate && (
                      <div className="flex items-center gap-2 text-[14px] font-semibold text-[#111111]">
                        <svg className="w-5 h-5 text-[#D45A2A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      {t.common.validFrom} {formatDate(featuredItem.effectiveDate)}
                      </div>
                    )}
                    <span className="inline-flex items-center justify-center bg-[#111111] hover:bg-[#D45A2A] text-white px-6 py-2.5 rounded-[12px] font-bold text-[14px] transition-colors shadow-md">
                      {t.announcements.readAnnouncement}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* List Announcements */}
        <div className="flex flex-col gap-4">
          {listItems.map(item => {
            const typeStyle = getTypeStyle(item.type)
            return (
              <Link
                key={item.id}
                href={`/thong-bao/${item.slug}`}
                className="group flex flex-col md:flex-row gap-6 p-6 md:p-8 rounded-[20px] transition-all duration-300"
                style={{
                  background: '#FFFDF7',
                  border: '1px solid rgba(58, 36, 24, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(58, 36, 24, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${typeStyle.bg} ${typeStyle.text} flex items-center gap-1.5`}>
                      <span>{typeStyle.icon}</span>
                      {tabs.find(t => t.id === item.type)?.label || item.type}
                    </span>
                    <span className="text-[#888888] text-[13px] font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#111111] mb-2 group-hover:text-[#D45A2A] transition-colors">
                    {localize(item, 'title', locale)}
                  </h3>
                  <p className="text-[#555555] text-[14px] line-clamp-2 mb-4">
                    {localize(item, 'excerpt', locale) || item.content?.substring(0, 100) + '...'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    {item.effectiveDate ? (
                      <span className="text-[#111111] font-semibold text-[13px]">
                        {t.common.applied} <span className="text-[#D45A2A]">{formatDate(item.effectiveDate)}</span>
                      </span>
                    ) : (
                      <span/>
                    )}
                    <span className="text-[#D45A2A] font-bold text-[14px] flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t.common.viewDetails} <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[24px] border border-[#E8E2D2]">
            <span className="text-5xl mb-4 block">📭</span>
            <p className="text-[#888888] text-lg">{t.announcements.noAnnouncements}</p>
          </div>
        )}

      </div>
    </div>
  )
}
