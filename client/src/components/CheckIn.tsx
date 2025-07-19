import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function CheckIn() {
  const { t } = useTranslation()
  const steps = t('checkIn.steps', { returnObjects: true }) as string[]
  const desc  = t('checkIn.descriptions', { returnObjects: true }) as string[]

  return (
    <div className="min-h-screen bg-neutral-8 text-white flex flex-col">
      <motion.section
        className="relative flex-1 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('/assets/features/hero-check-in.jpg')` }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <motion.h1
          className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center px-4 sm:px-6 lg:px-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 70 }}
        >
          {t('checkIn.heading')}
        </motion.h1>
      </motion.section>

      <motion.ol
        className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10"
        initial="hidden"
        whileInView="visible"
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        transition={{ staggerChildren: 0.2 }}
      >
        {steps.map((step, i) => (
          <motion.li
            key={i}
            className="bg-neutral-15 p-4 sm:p-6 md:p-8 rounded-2xl relative text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <span className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-primary w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white font-bold text-sm sm:text-base">
              {i + 1}
            </span>
            <h3 className="mt-6 text-lg sm:text-xl md:text-2xl font-semibold mb-2">
              {step}
            </h3>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg">
              {desc[i]}
            </p>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  )
}