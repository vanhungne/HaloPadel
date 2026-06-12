import { getAiSettings, getApiKeys, getAiUsageLogs } from '@/actions/admin/aiSettings'
import AiSettingsClient from './AiSettingsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'AI Settings | HaloPadel Admin',
  description: 'Quản lý cấu hình AI, API Keys và lịch sử sử dụng Groq'
}

export default async function AiSettingsPage() {
  const [settings, apiKeys, logs] = await Promise.all([
    getAiSettings(),
    getApiKeys(),
    getAiUsageLogs(100)
  ])

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-text-main mb-2">AI Settings</h1>
          <p className="text-text-sub">Quản lý API Keys, Load Balancing và lịch sử tạo nội dung</p>
        </div>
      </div>

      <AiSettingsClient 
        initialSettings={settings} 
        initialApiKeys={apiKeys} 
        initialLogs={logs} 
      />
    </div>
  )
}
