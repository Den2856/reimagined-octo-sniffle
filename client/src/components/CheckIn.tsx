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
        style={{ backgroundImage: `url('/src/assets/features/hero-check-in.jpg')` }}
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <motion.h1
          className="relative text-5xl md:text-6xl font-bold"
          initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 70 }}
        >
          {t('checkIn.heading')}
        </motion.h1>
      </motion.section>

      <motion.ol className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map((step, i) => (
          <motion.li
            key={i}
            className="bg-neutral-15 p-8 rounded-2xl relative text-center"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}
          >
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary w-10 h-10 flex items-center justify-center rounded-full text-white font-bold">
              {i + 1}
            </span>
            <h3 className="text-xl font-semibold mb-2">{step}</h3>
            <p className="text-gray-300">{desc[i]}</p>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  )
}
