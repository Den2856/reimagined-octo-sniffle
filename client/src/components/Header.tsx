import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'
import Sidebar from './SideBar'
import { LanguageSwitcher } from './LanguageSwitcher'
import defaultAvatarUrl from '../../public/assets/robot.png'
import { useTranslation } from 'react-i18next'

const logoUrl = new URL('../../public/assets/forAll/logo.png', import.meta.url).href

const headerVariants: Variants = {
  hidden:  { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}
const mobileNavVariants: Variants = {
  hidden:  { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.3 } },
  exit:    { height: 0, opacity: 0, transition: { duration: 0.2 } },
}

export default function Header() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)

  const navItems = [
    { name: t('header.nav.home'), to: '/' },
    { name: t('header.nav.aboutUs'), to: '/about' },
    { name: t('header.nav.places'), to: '/tours' },
    { name: t('header.nav.services'), to: '/services' },
  ]

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <motion.header
        className="w-full bg-neutral-10 text-white border-b border-neutral-30"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <nav className="max-w-screen-lg mx-auto flex items-center justify-between px-4 py-4">
          {/* Левая часть — логотип */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logoUrl} alt="Tripsy" className="h-8 w-auto" />
              <span className="text-xl font-bold">Tripsy</span>
            </Link>
          </div>

          {/* Центр — навигация */}
          <ul className="hidden md:flex items-center space-x-6">
            {navItems.map(({ name, to }) => {
              const isActive = location.pathname === to
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={
                      'px-3 py-2 rounded-lg hover:bg-neutral-8 transition-colors ' +
                      (isActive ? 'bg-neutral-8 border border-neutral-20' : '')
                    }
                  >
                    {name}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Правая часть — переключатель языка и аватар */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="px-3 py-2 rounded-lg transition-colors"
              >
                <img
                  src={defaultAvatarUrl}
                  alt="User avatar"
                  className="w-12 h-12 object-cover rounded-full"
                />
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-lg bg-button-primary hover:bg-button-hover transition-colors"
              >
                {t('header.login')}
              </Link>
            )}
          </div>

          {/* Мобильная панель: язык, профиль, бургер */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <button
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open profile sidebar"
                className="p-2 rounded-lg hover:bg-neutral-8 transition-colors"
              >
                <img
                  src={defaultAvatarUrl}
                  alt="User avatar"
                  className="w-8 h-8 object-cover rounded-full"
                />
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 rounded-lg bg-button-primary hover:bg-button-hover transition-colors text-sm"
              >
                {t('header.login')}
              </Link>
            )}

            <button
              onClick={() => setIsNavOpen(open => !open)}
              aria-label="Toggle navigation"
              className="p-2 rounded-lg hover:bg-neutral-8 transition-colors"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </nav>

        {/* Мобильное выпадающее меню */}
        <AnimatePresence>
          {isNavOpen && (
            <motion.div
              className="md:hidden overflow-hidden bg-neutral-10"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileNavVariants}
            >
              <ul className="flex flex-col px-4 py-2 space-y-1">
                {navItems.map(({ name, to }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={() => setIsNavOpen(false)}
                      className="block px-3 py-2 rounded-lg hover:bg-neutral-8 transition-colors"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
