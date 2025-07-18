import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import Header from '../components/Header'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post<{ token: string }>(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        form,
        { headers: { 'Content-Type': 'application/json' } }
      )
      await login(res.data.token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen w-full flex items-center justify-center bg-[url('/assets/forAll/bg.svg')] bg-no-repeat bg-cover bg-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[540px] h-[456px] bg-blue px-24 py-[50px] rounded-[20px] shadow"
        >
          <h2 className="text-[28px] text-foreground-h font-bold mb-8">Login to your account</h2>
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

          <label className="block mb-4">
            <span className="text-base text-foreground-d font-medium">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-3 block w-full border text-foreground-d border-outline-default bg-blue rounded px-3 py-2 focus:outline-none focus:ring"
              placeholder='example@gmail.com'
            />
          </label>

          <label className="block mb-8">
            <span className="text-base text-foreground-d font-medium">Password</span>
            <div className="relative mt-3">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="block w-full border text-foreground-d border-outline-default bg-blue rounded px-3 py-2 pr-10 focus:outline-none focus:ring"
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-d hover:text-white transition"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="w-full py-2 text-foreground-b bg-button-primary rounded-lg transition"
          >
            Login now
          </button>

          <p className="mt-4 text-center text-sm text-foreground-l">
            Don't have an account?{' '}
            <a href="/register" className="text-foreground-p hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </>
  )
}
