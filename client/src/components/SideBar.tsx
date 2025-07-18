import type { FC, Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  XMarkIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  ArrowLeftEndOnRectangleIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'
import defaultAvatarUrl from '../../public/assets/robot.png'
import { useTranslation } from 'react-i18next'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}
const sidebarVariants: Variants = {
  hidden:  { x: 300, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:    { x: 300, opacity: 0, transition: { duration: 0.2 } },
}
const menuContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
}
const menuItemVariants: Variants = {
  hidden:  { x: 30, opacity: 0 },
  visible: { x: 0,  opacity: 1, transition: { duration: 0.4 } },
}

const SideBar: FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const email = user?.email ?? ''

  return (
    <AnimatePresence>
      {isOpen && user && (
        <motion.div
          className="fixed inset-0 z-50"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsOpen(false)}
            variants={overlayVariants}
          />

          {/* Sidebar */}
          <motion.aside
            className="absolute right-0 top-0 h-full w-80 bg-neutral-8 shadow-xl flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-30">
              <h2 className="text-lg text-white font-semibold">
                {t('sidebar.profile')}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-neutral-15"
                aria-label="Close sidebar"
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Avatar & Name */}
            <motion.div
              className="flex flex-col items-center py-6 px-4 border-b border-neutral-30"
              variants={menuItemVariants}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-primary">
                <img src={defaultAvatarUrl} alt="avatar" className="object-cover w-full h-full" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-white">{user.name}</h3>
            </motion.div>

            {/* Menu */}
            <motion.nav
              className="flex-1 overflow-auto"
              initial="hidden"
              animate="visible"
              variants={menuContainerVariants}
            >
              <ul className="divide-y divide-neutral-30">
                <motion.li variants={menuItemVariants}>
                  <Link
                    to="/cart"
                    className="relative w-full flex justify-center items-center px-4 py-3 hover:bg-neutral-15"
                  >
                    <ShoppingCartIcon className="absolute left-4 h-5 w-5 text-primary" />
                    <span className="text-sm text-white">{t('sidebar.yourCart')}</span>
                  </Link>
                </motion.li>
                <motion.li variants={menuItemVariants}>
                  <button className="relative w-full flex justify-center items-center px-4 py-3 hover:bg-neutral-15">
                    <EnvelopeIcon className="absolute left-4 h-5 w-5 text-primary" />
                    <span className="text-sm text-white">{email}</span>
                  </button>
                </motion.li>
                <motion.li variants={menuItemVariants}>
                  <Link
                    to="/terms"
                    className="relative w-full flex justify-center items-center px-4 py-3 hover:bg-neutral-15"
                  >
                    <QuestionMarkCircleIcon className="absolute left-4 h-5 w-5 text-primary" />
                    <span className="text-sm text-white">{t('sidebar.reference')}</span>
                  </Link>
                </motion.li>
                <motion.li variants={menuItemVariants}>
                  <button
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="relative w-full flex justify-center items-center px-4 py-3 hover:bg-neutral-15"
                  >
                    <ArrowLeftEndOnRectangleIcon className="absolute left-4 h-5 w-5 text-primary" />
                    <span className="text-sm text-white">{t('sidebar.logout')}</span>
                  </button>
                </motion.li>
              </ul>
            </motion.nav>

          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SideBar
