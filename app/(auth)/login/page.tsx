'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { Eye, EyeOff } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const body = new URLSearchParams()
      body.append('username', username)
      body.append('password', password)

      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.detail || 'Incorrect username or password.')
      }

      const data = await res.json()
      localStorage.setItem('tt_token', data.access_token)
      localStorage.setItem('tt_user', JSON.stringify(data.user))

      const roleRoutes: Record<string, string> = {
        admin: '/admin',
        influencer: '/influencer',
        freelancer: '/freelancer',
      }
      router.push(roleRoutes[data.user.role] || '/admin')
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFEAE2] p-4 font-sans">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 sm:p-12 shadow-xl shadow-orange-900/5">

        <div className="flex items-center gap-0.5 select-none shrink-0">
          <span className="text-md sm:text-lg font-bold text-[#1A1A1A] tracking-tight">Talk</span>
          <span className="text-base sm:text-lg font-bold text-[#FF6B35] tracking-tight flex items-center gap-0.5">
            Tamila
            <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${buttonVariants({ variant: 'default' })} flex items-center justify-center gap-[1px] shrink-0 shadow-xs ml-0.5`}>
              <span className="w-[2px] h-[2px] sm:w-[2.5px] sm:h-[2.5px] rounded-full bg-white inline-block"></span>
              <span className="w-[2px] h-[2px] sm:w-[2.5px] sm:h-[2.5px] rounded-full bg-white inline-block"></span>
            </span>
          </span>
        </div>

        <div className="mt-6">
          <h1 style={{ fontFamily: 'var(--font-great-vibes)' }} className="text-4xl text-[#FA7A22] leading-none">
            Welcome
          </h1>
          <p className="mt-1 text-xs text-gray-500">Sign in to continue</p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-2.5 text-center text-xs text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-full bg-[#F3F4F6] px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:bg-[#EAECEF]"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full bg-[#F3F4F6] pl-5 pr-12 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:bg-[#EAECEF]"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end px-2">
            <Link href="/forgot-password" className="text-xs font-medium text-[#FA7A22] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full rounded-full bg-[#FA7A22] py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-[#E06412] transition disabled:opacity-60">
            {isSubmitting ? 'Signing in...' : 'Log in'}
          </button>

          <p className="text-center text-xs text-gray-500">
            Create a new account: <Link href="/Register" className="text-[#FA7A22] font-medium hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}