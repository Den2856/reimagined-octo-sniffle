import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function HolidayPackages() {
  const { t } = useTranslation()
  const packages = t('holidayPackages.packages', { returnObjects: true }) as Array<{ title: string; desc: string; price: string }>

  return (
    <div className="min-h-screen bg-neutral-8 text-white flex flex-col">
      {/* Hero */}
      <motion.section
        className="relative flex-1 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('/src/assets/features/hero-holiday-packages.png')` }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <motion.h1
          className="relative text-5xl md:text-6xl font-bold text-center max-w-3xl px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {t('holidayPackages.heading')}
        </motion.h1>
      </motion.section>

      {/* Packages List */}
      <motion.div
        className="container mx-auto px-4 py-16 space-y-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.3 } }
        }}
      >
        {packages.map((pkg, idx) => (
          <motion.div
            key={idx}
            className="flex items-center bg-neutral-15 p-6 rounded-xl shadow-lg"
            variants={{
              hidden: { x: 100, opacity: 0 },
              visible: { x: 0, opacity: 1 }
            }}
            transition={{ type: 'spring', stiffness: 80 }}
          >
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{pkg.title}</h2>
              <p className="text-gray-300">{pkg.desc}</p>
            </div>
            <div className="text-2xl font-bold text-primary">
              {pkg.price}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
