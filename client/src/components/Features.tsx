import { motion, type Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const arrowIcon = new URL('src/assets/forAll/arrow.svg', import.meta.url).href

const featuresData = [
  { key: 'findYourDreamStay', icon: '/src/assets/forAll/icon-stay.svg', href: '/dream-stay' },
  { key: 'cheapHolidayPackages', icon: '/src/assets/forAll/icon-packages.svg', href: '/packages' },
  { key: 'effortlessCheckIn', icon: '/src/assets/forAll/icon-checkin.svg', href: '/checkin' },
  { key: 'explorePlaces', icon: '/src/assets/forAll/icon-explore.svg', href: '/tours' },
] as const

const containerVariants: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }
const itemVariants: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Features() {
  const { t } = useTranslation()

  return (
    <motion.div className="bg-neutral-8 px-4 py-8" initial="hidden" whileInView="visible" viewport={{ amount: 0.3 }} variants={containerVariants}>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants}>
        {featuresData.map(({ key, icon, href }) => (
          <motion.div key={key} variants={itemVariants}>
            <Link
              to={href}
              className="relative flex flex-col items-center justify-center bg-neutral-15 border border-neutral-20 rounded-lg p-6 hover:bg-neutral-20 transition-colors"
            >
              <img src={arrowIcon} alt="" className="absolute top-3 right-3 w-4 h-4 opacity-60 hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-center w-[82px] h-[82px] bg-neutral-08 rounded-full">
                <img src={new URL(icon, import.meta.url).href} alt="" className="w-[82px] h-[82px]" />
              </div>
              <span className="mt-4 text-center text-[20px] font-medium text-white">{t(`features.${key}`)}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
