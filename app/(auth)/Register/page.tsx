'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { authService } from '@/services/auth.service'



export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    username: '',
    role:''
  })

  const [showPassword, setShowPassword] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (!formData.fullName.trim()) return setError('Please enter your full name.');
  if (!formData.birthMonth || !formData.birthDay || !formData.birthYear)
    return setError('Please select your complete date of birth.');
  if (!formData.email.trim()) return setError('Please enter your email.');
  if (!formData.mobile.trim()) return setError('Please enter your mobile number.');
  if (!formData.password) return setError('Please enter a password.');
  if (!formData.username.trim()) return setError('Please choose a username.');
  if (!formData.role.trim()) return setError('Please choose a Role.');
  
  setIsSubmitting(true);

  const nameParts = formData.fullName.trim().split(' ');
  const first_name = nameParts[0];
  const last_name = nameParts.slice(1).join(' ') || first_name;

  const monthIndex = months.indexOf(formData.birthMonth) + 1;
  const dob = `${formData.birthYear}-${String(monthIndex).padStart(2, '0')}-${String(formData.birthDay).padStart(2, '0')}`;

  try {

     await authService.signUp({
      username: formData.username,
      first_name,
      last_name,
      email: formData.email,
      mobile_no: formData.mobile,
      password: formData.password,
      dob,
      role: formData.role
    });

    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => router.push('/login'), 1500);
  } catch (err) {
    setIsSubmitting(false);
    const errorInstance = err as Error;
    setError(errorInstance.message || 'Something went wrong. Please try again.');
  }
};
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFEAE2] py-8 px-4 font-sans">
      <div className="w-full max-w-4xl rounded-[32px] bg-white p-6 sm:p-8 shadow-xl shadow-orange-900/5 border border-orange-100/60">

        <div className="flex items-center justify-between mb-2">
          <button type="button" onClick={() => router.back()} className="p-1 -ml-1 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100/80" aria-label="Go back">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-0.5 select-none">
            <span className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight">Talk</span>
            <span className="text-base sm:text-lg font-bold text-[#FF6B35] tracking-tight">Tamila</span>
          </div>
          <div className="w-6" />
        </div>

        <div className="mt-4 mb-6">
          <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">Get started on TalkTamila</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">Sign up to see photos and videos from your friends.</p>
        </div>

        {success && (
          <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-center text-xs sm:text-sm text-emerald-700 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Account created! Redirecting to login...</span>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 border border-red-100 p-3 text-center text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold text-gray-800 mb-1.5">Name</label>
            <input type="text" name="fullName" id="fullName" placeholder="Full name" value={formData.fullName} onChange={handleChange}
              className="w-full rounded-2xl bg-[#F3F4F6] px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none border border-transparent focus:border-[#FF6B35]/50 focus:bg-white transition" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1.5">Birthday</label>
            <div className="grid grid-cols-3 gap-2">
              <select name="birthMonth" value={formData.birthMonth} onChange={handleChange} className="rounded-2xl bg-[#F3F4F6] px-3 py-3.5 text-sm text-gray-800 outline-none">
                <option value="">Month</option>
                {months.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select name="birthDay" value={formData.birthDay} onChange={handleChange} className="rounded-2xl bg-[#F3F4F6] px-3 py-3.5 text-sm text-gray-800 outline-none">
                <option value="">Day</option>
                {days.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select name="birthYear" value={formData.birthYear} onChange={handleChange} className="rounded-2xl bg-[#F3F4F6] px-3 py-3.5 text-sm text-gray-800 outline-none">
                <option value="">Year</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-800 mb-1.5">Email</label>
            <input type="email" name="email" id="email" placeholder="you@example.com" value={formData.email} onChange={handleChange}
              className="w-full rounded-2xl bg-[#F3F4F6] px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none border border-transparent focus:border-[#FF6B35]/50 focus:bg-white transition" />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-xs font-semibold text-gray-800 mb-1.5">Mobile number</label>
            <input type="tel" name="mobile" id="mobile" placeholder="9876543210" value={formData.mobile} onChange={handleChange}
              className="w-full rounded-2xl bg-[#F3F4F6] px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none border border-transparent focus:border-[#FF6B35]/50 focus:bg-white transition" />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-800 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} name="password" id="password" value={formData.password} onChange={handleChange}
                className="w-full rounded-2xl bg-[#F3F4F6] px-4 py-3.5 pr-12 text-sm text-gray-800 outline-none border border-transparent focus:border-[#FF6B35]/50 focus:bg-white transition" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-gray-800 mb-1.5">Username</label>
            <input type="text" name="username" id="username" placeholder="Choose a username" value={formData.username} onChange={handleChange}
              className="w-full rounded-2xl bg-[#F3F4F6] px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none border border-transparent focus:border-[#FF6B35]/50 focus:bg-white transition" />
          </div>
          {/* Role Dropdown Option */}
<div>
  <label htmlFor="role" className="block text-xs font-semibold text-gray-800 mb-1.5">Join as</label>
  <select
    name="role"
    id="role"
    value={formData.role}
    onChange={handleChange}
    className="w-full rounded-2xl bg-[#F3F4F6] px-4 py-3.5 text-sm text-gray-800 outline-none border border-transparent focus:border-[#FF6B35]/50 focus:bg-white transition"
    required
  >
    <option value="" disabled>Select your account type</option>
    <option value="influencer">Influencer</option>
    <option value="freelancer">Freelancer</option>
  </select>
</div>


          <button type="submit" disabled={isSubmitting}
            className="w-full rounded-full bg-[#FA7A22] py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-[#E06412] transition disabled:opacity-60">
            {isSubmitting ? 'Creating account...' : 'Submit'}
          </button>

          <button type="button" onClick={() => router.push('/login')}
            className="w-full rounded-full bg-[#FFEAE2] py-3.5 font-medium text-gray-700 hover:bg-[#FCDCCB] transition">
            I already have an account
          </button>
        </form>
      </div>
    </div>
  )
}
