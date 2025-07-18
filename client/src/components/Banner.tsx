import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const patternUrl = new URL('../../public/assets/pattern.svg', import.meta.url).href

export type BannerVariant = 'promo' | 'info' | 'alert' | 'empty'

interface BannerProps {
  variant?: BannerVariant
  reopenDelayMs?: number
  rotateDeg?: number
}

const VARIANT_CONFIG: Record<BannerVariant, { linkHref?: string; backgroundColor: string }> = {
  promo: { linkHref: '/terms', backgroundColor: '#1A1A1A' },
  info:  { backgroundColor: '#23235C' },
  alert: { linkHref: '/register', backgroundColor: '#550000' },
  empty: { backgroundColor: '#1A1A1A' },
}

export default function Banner({
  variant = 'promo',
  reopenDelayMs = 10_000,
  rotateDeg = 0,
}: BannerProps) {
  const { t } = useTranslation()
  // Если пустой баннер — только фон
  if (variant === 'empty') {
    return (
      <div
        className="w-full h-[63px] overflow-hidden"
        style={{
          backgroundImage: `url(${patternUrl})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          backgroundColor: VARIANT_CONFIG.empty.backgroundColor,
          transform: `rotate(${rotateDeg}deg)`,
          transformOrigin: 'center center',
        }}
      />
    )
  }

  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(true)
  const { linkHref, backgroundColor } = VARIANT_CONFIG[variant]
  const message  = t(`banner.${variant}.message`)
  const linkText = t(`banner.${variant}.linkText`)

  // автопоявление promo
  useEffect(() => {
    if (variant === 'promo' && !isOpen && !isAuthenticated) {
      const timer = setTimeout(() => setIsOpen(true), reopenDelayMs)
      return () => clearTimeout(timer)
    }
  }, [isOpen, isAuthenticated, reopenDelayMs, variant])

  if (variant === 'promo' && (isAuthenticated || !isOpen)) {
    return null
  }

  return (
    <div
      className="w-full h-[63px] overflow-hidden text-white"
      style={{
        backgroundImage: `url(${patternUrl})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        backgroundColor,
        transform: `rotate(${rotateDeg}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <div className="h-full grid grid-cols-3 items-center px-4">
        <div />
        <div className="flex items-center justify-center space-x-2 text-sm">
          <span>{message}</span>
          {linkText && linkHref && (
            <Link to={linkHref} className="underline hover:text-gray-300">
              {linkText}
            </Link>
          )}
        </div>
        {variant === 'promo' && (
          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close banner"
              className="p-1 rounded-full w-[32px] bg-white/10 hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
