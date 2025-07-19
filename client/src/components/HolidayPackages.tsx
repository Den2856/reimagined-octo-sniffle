import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function HolidayPackages() {
  const { t } = useTranslation()
  const packages = t(
    'holidayPackages.packages',
    { returnObjects: true }
  ) as Array<{ title: string; desc: string; price: string }>

  return (
    <div className="max-w-screen mx-auto">
      <div className="min-h-screen bg-neutral-8 text-white flex flex-col">
        {/* Hero */}
        <motion.section
          className="relative flex-1 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/features/hero-holiday-packages.png')` }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.h1
            className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {t('holidayPackages.heading')}
          </motion.h1>
        </motion.section>

        {/* Packages List */}
        <motion.div
          className="space-y-8 px-4 sm:space-y-10 md:space-y-12 py-12 sm:py-16 md:py-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.3 } },
          }}
        >
          {packages.map((pkg, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col sm:flex-row items-start sm:items-center bg-neutral-15 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg space-y-4 sm:space-y-0 sm:space-x-6"
              variants={{
                hidden: { x: 100, opacity: 0 },
                visible: { x: 0, opacity: 1 },
              }}
              transition={{ type: 'spring', stiffness: 80 }}
            >
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                  {pkg.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-300">
                  {pkg.desc}
                </p>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                {pkg.price}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
