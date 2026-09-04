'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, HelpCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    contact: '',
    password: '',
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    fullName: '',
    username: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showInfoPopover, setShowInfoPopover] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 90 }, (_, i) => currentYear - i)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

  if (!formData.fullName.trim()) {
      setError('Please enter your full name.')
      return
    }
     if (!formData.birthMonth || !formData.birthDay || !formData.birthYear) {
      setError('Please select your complete date of birth.')
      return
    }
    if (!formData.contact.trim()) {
      setError('Please enter your mobile number or email.')
      return
    }
    if (!formData.password) {
      setError('Please enter a password.')
      return
    }
   
    
    if (!formData.username.trim()) {
      setError('Please choose a username.')
      return
    }

    setIsSubmitting(true)

   
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)

      const newUser = {
        name: formData.fullName,
        username: formData.username,
        email: formData.contact,
        role: 'user'
      }
      localStorage.setItem('talktamila_user', JSON.stringify(newUser))

      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }, 800)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFEAE2] py-8 px-4 font-sans select-none sm:select-auto">
      <div className="w-full max-w-4xl   rounded-[32px] bg-white p-6 sm:p-8 shadow-xl shadow-orange-900/5 border border-orange-100/60 transition-all">
        
      
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-1 -ml-1 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100/80 cursor-pointer"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          
          <div className="flex items-center gap-0.5 select-none">
            <span className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight">Talk</span>
            <span className="text-base sm:text-lg font-bold text-[#FF6B35] tracking-tight flex items-center gap-0.5">
              <span>Tamila</span>
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[linear-gradient(135deg,#E6703A,#FFA663)] flex items-center justify-center gap-[1px] shrink-0 shadow-xs ml-0.5">
                <span className="w-[2px] h-[2px] sm:w-[2.5px] sm:h-[2.5px] rounded-full bg-white inline-block"></span>
                <span className="w-[2px] h-[2px] sm:w-[2.5px] sm:h-[2.5px] rounded-full bg-white inline-block"></span>
              </span>
            </span>
          </div>

          <div className="w-6" />
        </div>

        <div className="mt-4 mb-6">
          <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight leading-snug">
            Get started on TalkTamila
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Sign up to see photos and videos from your friends.
          </p>
        </div>

       
        {success && (
          <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-center text-xs sm:text-sm text-emerald-700 flex items-center justify-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Account created successfully! Redirecting to login...</span>
          </div>
        )}

   
        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 border border-red-100 p-3 text-center text-xs text-red-600 animate-in fade-in duration-150">
            {error}
          </div>
        )}

   
        <form onSubmit={handleSubmit} className="space-y-4">
         
          <div>
            <label htmlFor='fullName' className="block text-xs font-semibold text-gray-800 mb-1.5">
              Name
            </label>
            <input
              type="text"
              name="fullName"
              id='fullName'
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-2xl bg-[#F3F4F6] px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none border border-transparent focus:border-[#FF6B35]/50 focus:bg-white transition duration-200"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label htmlFor="birthMonth" className="text-xs font-semibold text-gray-800">
                Birthday
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowInfoPopover(!showInfoPopover)}
                  className="text-gray-400 hover:text-[#FF6B35] transition-colors focus:outline-none cursor-pointer"
                  aria-label="Birthday information"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                {showInfoPopover && (
                  <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-lg z-20 animate-in fade-in duration-150">
                    Providing your birthday helps ensure you get the right age-appropriate experience on TalkTamila.
                    <div className="absolute left-2.5 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              <div className="relative">
                <select
                  id="birthMonth"
                  name="birthMonth"
                  value={formData.birthMonth}
                  onChange={handleChange}
                  aria-label="Birth Month"
                  className="w-full appearance-none rounded-2xl bg-[#F3F4F6] px-3.5 py-3 text-xs sm:text-sm text-gray-800 outline-none border border-transparent focus:border-[#FF6B35]/50 focus:bg-white transition duration-200 cursor-pointer pr-8"
                >
                  <option value="" disabled>Month</option>
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  id="birthDay"
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleChange}
                  aria-label="Birth Day"
                  className="w-full appearance-none rounded-2xl bg-[#F3F4F6] px-3.5 py-3 text-xs sm:text-sm text-gray-800 outline-none border border-transparent focus:border-[#FF6B35]/50 focus:bg-white transition duration-200 cursor-pointer pr-8"
                >
                  <option value="" disabled>Day</option>
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  id="birthYear"
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleChange}
                  aria-label="Birth Year"
                  className="w-full appearance-none rounded-2xl bg-[#F3F4F6] px-3.5 py-3 text-xs sm:text-sm text-gray-800 outline-none border border-transparent focus:border-[#FF6B35]/50 focus:bg-white transition duration-200 cursor-pointer pr-8"
                >
                  <option value="" disabled>Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="contact" className="block text-xs font-semibold text-gray-800 mb-1.5">
              Mobile number or email
            </label>
            <input
              type="text"
              name="contact"
              id="contact"
              placeholder="Mobile number or email"
              value={formData.contact}
              onChange={handleChange}
              className="w-full rounded-2xl bg-[#F3F4F6] px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none border border-transparent focus:border-[#FF6B35]/50 focus:bg-white transition duration-200"
            />
            <p className="mt-1.5 text-[11px] sm:text-xs text-gray-500 leading-relaxed">
              You may receive notifications from us.{' '}
              <button
                type="button"
                className="text-[#FF6B35] font-semibold hover:underline bg-transparent p-0 inline border-none cursor-pointer"
              >
                Learn why we ask for your contact information
              </button>
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-800 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-2xl bg-[#F3F4F6] px-4 py-3.5 pr-11 text-sm text-gray-800 placeholder-gray-400 outline-none border border-transparent focus:border-[#FF6B35]/50 focus:bg-white transition duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-gray-800 mb-1.5">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-2xl bg-[#F3F4F6] px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none border border-transparent focus:border-[#FF6B35]/50 focus:bg-white transition duration-200"
            />
          </div>

          <div className="pt-2 pb-1 space-y-2.5 text-[11px] sm:text-xs text-gray-500 leading-relaxed">
            <p>
              People who use our service may have uploaded your contact information to TalkTamila.{' '}
              <button
                type="button"
                className="text-[#FF6B35] font-medium hover:underline bg-transparent p-0 inline border-none cursor-pointer"
              >
                Learn more
              </button>.
            </p>

            <p>
              By tapping Submit, you agree to create an account and to TalkTamila&apos;s{' '}
              <button
                type="button"
                className="text-[#FF6B35] font-semibold hover:underline bg-transparent p-0 inline border-none cursor-pointer"
              >
                Terms
              </button>,{' '}
              <button
                type="button"
                className="text-[#FF6B35] font-semibold hover:underline bg-transparent p-0 inline border-none cursor-pointer"
              >
                Privacy Policy
              </button>{' '}
              and{' '}
              <button
                type="button"
                className="text-[#FF6B35] font-semibold hover:underline bg-transparent p-0 inline border-none cursor-pointer"
              >
                Cookies Policy
              </button>.
            </p>

            <p>
              The{' '}
              <button
                type="button"
                className="text-[#FF6B35] font-semibold hover:underline bg-transparent p-0 inline border-none cursor-pointer"
              >
                Privacy Policy
              </button>{' '}
              describes the ways we can use the information we collect when you create an account. For example, we use this information to provide, personalize and improve our products, including ads.
            </p>
          </div>

        
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#FA7A22] py-3.5 font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-[#E06412] active:scale-[0.99] transition duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isSubmitting ? 'Creating account...' : 'Submit'}
            </button>

            <Link
              href="/login"
              className="w-full rounded-full bg-[#FFEFE0] py-3.5 font-semibold text-gray-700 hover:bg-[#FCE3CC] active:scale-[0.99] transition duration-200 text-center block text-sm sm:text-base cursor-pointer mt-3"
            >
              I already have an account
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}
