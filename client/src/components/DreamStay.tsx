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
        style={{ backgroundImage: `url('../../public/assets/features/hero-dream-stay.jpg')` }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <motion.h1
          className="relative text-5xl md:text-6xl font-bold text-center max-w-3xl px-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 60 }}
        >
          {t('dreamStay.heading')}
        </motion.h1>
      </motion.section>

      <motion.div
        className="container mx-auto px-3 py-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        initial="hidden" whileInView="visible"
        variants={{ hidden: { opacity: 0, y: 10}, visible: { opacity: 1, y: 0 } }}
        transition={{ staggerChildren: 0.2 }}
      >
        {places.map((p, idx) => (
          <motion.div
            key={idx}
            className="bg-neutral-15 h-[200px] rounded-xl flex flex-col p-6 shadow-lg hover:shadow-2xl transition-shadow"
            initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 * idx }}
          >
            <h2 className="text-2xl font-semibold mb-2">{p.title}</h2>
            <p className="text-gray-100 text-lg mb-6">{p.desc}</p>
            <Link to={p.href} className="relative px-4 py-2 rounded-xl w-[150px] text-center bg-button-primary hover:bg-button-hover">
              {t('dreamStay.bookTrip')}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
