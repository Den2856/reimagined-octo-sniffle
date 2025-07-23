import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function DreamStay() {
  const { t } = useTranslation()
  const places = t('dreamStay.places', { returnObjects: true }) as Array<{ title: string; desc: string; href: string }>

  return (
    <div className="min-h-screen bg-neutral-8 text-white flex flex-col">
      <motion.section
        className="relative flex-1 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('/assets/features/hero-dream-stay.jpg')` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <motion.h1
          className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-full sm:max-w-2xl px-4 sm:px-6 lg:px-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 60 }}
        >
          {t('dreamStay.heading')}
        </motion.h1>
      </motion.section>

      <motion.div
        className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10"
        initial="hidden"
        whileInView="visible"
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        transition={{ staggerChildren: 0.2 }}
      >
        {places.map((p, idx) => (
          <motion.div
            key={idx}
            className="bg-neutral-15 h-auto md:h-[200px] rounded-xl flex flex-col p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-shadow"
            initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 * idx }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">
              {p.title}
            </h2>
            <p className="text-gray-100 text-base sm:text-lg md:text-xl mb-4">
              {p.desc}
            </p>
            <Link
              to='/trips/685ae062d1dced7714503b1f'
              className="relative px-4 py-2 sm:px-6 sm:py-3 rounded-xl w-[150px] text-center bg-button-primary hover:bg-button-hover transition text-sm sm:text-base"
            >
              {t('dreamStay.bookTrip')}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}