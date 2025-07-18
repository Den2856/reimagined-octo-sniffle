import { motion, type Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Статические импорты SVG через ?url, чтобы Vite подхватил их при сборке
import arrowIcon    from '../assets/forAll/arrow.svg?url'
import stayIcon     from '../assets/forAll/icon-stay.svg?url'
import packagesIcon from '../assets/forAll/icon-packages.svg?url'
import checkinIcon  from '../assets/forAll/icon-checkin.svg?url'
import exploreIcon  from '../assets/forAll/icon-explore.svg?url'

const featuresData = [
  { key: 'findYourDreamStay',    icon: stayIcon,     href: '/dream-stay' },
  { key: 'cheapHolidayPackages',  icon: packagesIcon, href: '/packages' },
  { key: 'effortlessCheckIn',     icon: checkinIcon,  href: '/checkin' },
  { key: 'explorePlaces',         icon: exploreIcon,  href: '/tours' },
] as const

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function Features() {
  const { t } = useTranslation()

  return (
    <motion.div
      className="bg-neutral-8 px-4 py-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {featuresData.map(({ key, icon, href }) => (
          <motion.div key={key} variants={itemVariants}>
            <Link
              to={href}
              className="relative flex flex-col items-center justify-center bg-neutral-15 border border-neutral-20 rounded-lg p-6 hover:bg-neutral-20 transition-colors"
            >
              <img
                src={arrowIcon}
                alt=""
                className="absolute top-3 right-3 w-4 h-4 opacity-60 hover:opacity-100 transition-opacity"
              />
              <div className="flex items-center justify-center w-[82px] h-[82px] bg-neutral-08 rounded-full">
                <img
                  src={icon}
                  alt=""
                  className="w-[82px] h-[82px]"
                />
              </div>
              <span className="mt-4 text-center text-[20px] font-medium text-white">
                {t(`features.${key}`)}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
