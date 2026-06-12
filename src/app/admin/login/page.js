'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { signIn } from 'next-auth/react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError('Email hoặc mật khẩu không chính xác')
        setIsLoading(false)
      } else {
        // Success, redirect to dashboard
        window.location.href = '/admin'
      }
    } catch (err) {
      setError('Đã xảy ra lỗi, vui lòng thử lại sau')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#111111]">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="login-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 100L100 0H50L0 50M100 100V50L50 100" fill="#D45A2A"/>
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#login-pattern)"/>
        </svg>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D45A2A]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image 
            src="/images/logo.png" 
            alt="HaloPadel Logo" 
            width={200} 
            height={60} 
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Đăng nhập Admin</h1>
          <p className="text-white/60 text-[14px]">Hệ thống quản trị sân Padel chuyên nghiệp</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[13px] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-bold text-white/80 mb-2 ml-1">Email quản trị</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@halopadel.vn"
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 focus:border-[#D45A2A] focus:bg-white/10 rounded-xl text-white placeholder-white/30 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-white/80 mb-2 ml-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 focus:border-[#D45A2A] focus:bg-white/10 rounded-xl text-white placeholder-white/30 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 mb-6 px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#D45A2A] focus:ring-[#D45A2A]/50 focus:ring-offset-0" />
              <span className="text-[13px] text-white/60 group-hover:text-white transition-colors">Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className="text-[13px] text-[#D45A2A] hover:text-[#B8431D] font-medium transition-colors">
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] flex items-center justify-center gap-2 bg-[#D45A2A] hover:bg-[#B8431D] text-white rounded-xl font-bold transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(212,90,42,0.3)] hover:shadow-[0_0_30px_rgba(212,90,42,0.5)]"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-[12px] text-white/40">
            © 2026 HaloPadel. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  )
}
