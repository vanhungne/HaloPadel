'use client'

import { useState } from 'react'
import { updateAiSettings, addApiKey, deleteApiKey, testGroqApiKey } from '@/actions/admin/aiSettings'
import { formatDate } from '@/lib/utils'

export default function AiSettingsClient({ initialSettings, initialApiKeys, initialLogs }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [settings, setSettings] = useState(initialSettings)
  const [apiKeys, setApiKeys] = useState(initialApiKeys)
  
  // API Key Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newKeyForm, setNewKeyForm] = useState({ name: '', apiKey: '', priority: 0 })
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const handleUpdateSettings = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      isEnabled: formData.get('isEnabled') === 'on',
      provider: formData.get('provider'),
      defaultModel: formData.get('defaultModel'),
      rotationStrategy: formData.get('rotationStrategy'),
      temperature: parseFloat(formData.get('temperature')),
      maxTokens: parseInt(formData.get('maxTokens'))
    }
    const res = await updateAiSettings(data)
    if (res.success) {
      alert('Đã cập nhật cấu hình!')
      setSettings({ ...settings, ...data })
    } else {
      alert('Lỗi: ' + res.error)
    }
  }

  const handleTestKey = async () => {
    if (!newKeyForm.apiKey) return alert('Vui lòng nhập API Key')
    setIsTesting(true)
    const res = await testGroqApiKey(newKeyForm.apiKey)
    setTestResult(res)
    setIsTesting(false)
  }

  const handleSaveKey = async () => {
    if (!newKeyForm.name || !newKeyForm.apiKey) return alert('Vui lòng nhập tên và API Key')
    const res = await addApiKey(newKeyForm)
    if (res.success) {
      alert('Thêm API Key thành công!')
      setIsModalOpen(false)
      window.location.reload() // Tạm thời reload để lấy data mới
    } else {
      alert('Lỗi: ' + res.error)
    }
  }

  const handleDeleteKey = async (id) => {
    if (confirm('Bạn có chắc muốn xóa API Key này?')) {
      const res = await deleteApiKey(id)
      if (res.success) {
        setApiKeys(apiKeys.filter(k => k.id !== id))
      }
    }
  }

  return (
    <div>
      {/* TABS */}
      <div className="flex items-center gap-6 border-b border-border-light mb-8">
        {['overview', 'keys', 'logs'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 font-bold text-[15px] border-b-2 transition-colors ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-sub hover:text-text-main'
            }`}
          >
            {tab === 'overview' ? 'Cấu Hình Chung' : tab === 'keys' ? 'Quản lý API Keys' : 'Lịch Sử Sử Dụng'}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <form onSubmit={handleUpdateSettings} className="bg-card-white p-6 md:p-8 rounded-2xl shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main">Thông số cơ bản</h3>
              
              <div className="flex items-center justify-between p-4 border border-border-light rounded-xl">
                <div>
                  <div className="font-bold">Trạng thái AI</div>
                  <div className="text-sm text-text-sub">Bật/tắt toàn bộ tính năng AI trên Admin</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isEnabled" defaultChecked={settings.isEnabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-main mb-2">Provider</label>
                <select name="provider" defaultValue={settings.provider} className="w-full h-12 px-4 rounded-xl border border-border-light bg-bg-light focus:outline-none">
                  <option value="GROQ">Groq (Mixtral, Llama 3)</option>
                  <option value="OPENAI" disabled>OpenAI (Coming soon)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-main mb-2">Model mặc định</label>
                <select name="defaultModel" defaultValue={settings.defaultModel} className="w-full h-12 px-4 rounded-xl border border-border-light bg-bg-light focus:outline-none">
                  <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile (Tốt nhất cho Tiếng Việt)</option>
                  <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant (Nhanh, nhẹ)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-text-main">Chiến lược xoay Key (Rotation)</h3>
              
              <div>
                <label className="block text-sm font-bold text-text-main mb-2">Thuật toán Load Balancing</label>
                <select name="rotationStrategy" defaultValue={settings.rotationStrategy} className="w-full h-12 px-4 rounded-xl border border-border-light bg-bg-light focus:outline-none">
                  <option value="ROUND_ROBIN">Round Robin (Xoay vòng đều)</option>
                  <option value="PRIORITY_FIRST">Priority First (Ưu tiên Key có điểm số cao)</option>
                  <option value="LEAST_USED">Least Used (Ưu tiên Key ít dùng trong ngày)</option>
                </select>
                <p className="text-xs text-text-sub mt-2">Hệ thống tự động bỏ qua các Key đang bị lỗi (Cooldown).</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-main mb-2">Temperature (Sáng tạo)</label>
                <input type="number" step="0.1" max="2" min="0" name="temperature" defaultValue={settings.temperature} className="w-full h-12 px-4 rounded-xl border border-border-light bg-bg-light focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-main mb-2">Max Tokens</label>
                <input type="number" name="maxTokens" defaultValue={settings.maxTokens} className="w-full h-12 px-4 rounded-xl border border-border-light bg-bg-light focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border-light">
            <button type="submit" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors">
              Lưu Cấu Hình
            </button>
          </div>
        </form>
      )}

      {/* API KEYS TAB */}
      {activeTab === 'keys' && (
        <div className="bg-card-white p-6 md:p-8 rounded-2xl shadow-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-text-main">Danh sách API Keys</h3>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm">
              + Thêm Key Mới
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-light text-text-sub text-sm">
                  <th className="py-3 px-4 font-bold">Tên Key</th>
                  <th className="py-3 px-4 font-bold">Key (Masked)</th>
                  <th className="py-3 px-4 font-bold text-center">Priority</th>
                  <th className="py-3 px-4 font-bold text-center">Lượt dùng</th>
                  <th className="py-3 px-4 font-bold text-center">Trạng thái</th>
                  <th className="py-3 px-4 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map(key => (
                  <tr key={key.id} className="border-b border-border-light hover:bg-bg-light/50">
                    <td className="py-3 px-4 font-medium">{key.name}</td>
                    <td className="py-3 px-4 text-text-sub font-mono text-sm">{key.maskedApiKey}</td>
                    <td className="py-3 px-4 text-center">{key.priority}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="text-sm font-bold">{key.dailyUsageCount} <span className="text-text-sub font-normal">hôm nay</span></div>
                      <div className="text-xs text-green-600">{key.successCount} OK / <span className="text-red-500">{key.failureCount} Lỗi</span></div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {key.cooldownUntil && new Date(key.cooldownUntil) > new Date() ? (
                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold">Cooldown</span>
                      ) : key.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">Disabled</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => handleDeleteKey(key.id)} className="text-red-500 hover:text-red-700 font-bold text-sm">Xóa</button>
                    </td>
                  </tr>
                ))}
                {apiKeys.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-text-sub">Chưa có API Key nào được cấu hình.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LOGS TAB */}
      {activeTab === 'logs' && (
        <div className="bg-card-white p-6 md:p-8 rounded-2xl shadow-card">
          <h3 className="font-bold text-lg text-text-main mb-6">Lịch sử sử dụng (100 lượt gần nhất)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-light text-text-sub text-sm">
                  <th className="py-3 px-4 font-bold">Thời gian</th>
                  <th className="py-3 px-4 font-bold">Key Sử Dụng</th>
                  <th className="py-3 px-4 font-bold">Prompt (Tóm tắt)</th>
                  <th className="py-3 px-4 font-bold text-center">Tokens</th>
                  <th className="py-3 px-4 font-bold text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {initialLogs.map(log => (
                  <tr key={log.id} className="border-b border-border-light hover:bg-bg-light/50">
                    <td className="py-3 px-4 text-sm">{formatDate(log.createdAt)}</td>
                    <td className="py-3 px-4 text-sm">{log.apiKey?.name || 'Env Fallback'}</td>
                    <td className="py-3 px-4 text-sm max-w-[200px] truncate" title={log.inputPrompt}>{log.inputPrompt}</td>
                    <td className="py-3 px-4 text-sm text-center">{log.tokensUsed}</td>
                    <td className="py-3 px-4 text-center">
                      {log.status === 'SUCCESS' ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Thành công ({log.durationMs}ms)</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold" title={log.errorMessage}>Thất bại</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL THÊM KEY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-border-light flex justify-between items-center">
              <h3 className="font-bold text-xl">Thêm Groq API Key</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-sub hover:text-text-main text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-main mb-2">Tên gợi nhớ (VD: Key Backup 1)</label>
                <input type="text" value={newKeyForm.name} onChange={e => setNewKeyForm({...newKeyForm, name: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-border-light bg-bg-light focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-main mb-2">API Key (gsk_...)</label>
                <input type="password" value={newKeyForm.apiKey} onChange={e => setNewKeyForm({...newKeyForm, apiKey: e.target.value})} className="w-full h-12 px-4 rounded-xl border border-border-light bg-bg-light focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-main mb-2">Độ ưu tiên (Số càng cao càng ưu tiên)</label>
                <input type="number" value={newKeyForm.priority} onChange={e => setNewKeyForm({...newKeyForm, priority: parseInt(e.target.value) || 0})} className="w-full h-12 px-4 rounded-xl border border-border-light bg-bg-light focus:outline-none focus:border-primary" />
              </div>
              
              {testResult && (
                <div className={`p-3 rounded-lg text-sm ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {testResult.success ? '✅ Test Key thành công!' : `❌ Lỗi: ${testResult.error}`}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-border-light bg-bg-light flex justify-end gap-3">
              <button type="button" onClick={handleTestKey} disabled={isTesting} className="px-4 py-2 border border-border-main text-text-main rounded-xl font-bold hover:bg-gray-100 disabled:opacity-50">
                {isTesting ? 'Đang Test...' : 'Test Key'}
              </button>
              <button type="button" onClick={handleSaveKey} disabled={!testResult?.success} className="px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover disabled:opacity-50">
                Lưu Key Này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
