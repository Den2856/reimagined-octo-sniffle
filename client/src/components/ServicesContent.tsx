import { motion } from 'framer-motion'
import { FiStar, FiMap, FiClock, FiRadio, FiLock, FiCamera, FiCompass } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'


type Feature = { title: string; desc: string }
type Testimonial = { author: string; text: string }

export default function ServicesPage() {
  const { t } = useTranslation()
  const services = t('servicesPage.list', { returnObjects: true }) as string[]
  const features = t('servicesPage.features', { returnObjects: true }) as Feature[]
  const testimonials = t('servicesPage.testimonials', { returnObjects: true }) as Testimonial[]

  return (
    <div className="min-h-screen bg-neutral-8 text-white flex flex-col">
      {/* Hero Section */}
      <motion.header
        className="relative h-56 bg-cover bg-center"
        style={{ backgroundImage: `url('/public/assets/forAll/hero-services.jpg')` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center text-center px-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-2">
            {t('servicesPage.hero.heading')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            {t('servicesPage.hero.description')}
          </p>
        </motion.div>
      </motion.header>

      {/* Services Grid */}
      <motion.section
        className="container mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        initial="hidden"
        whileInView="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
      >
        {services.map((name, idx) => (
          <motion.div
            key={idx}
            className="bg-neutral-15 rounded-xl p-6 flex flex-col items-center justify-center shadow-lg group hover:scale-105 transition-transform"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ scale: 1.05 }}
          >
            {idx === 0 ? (
              <>
                <FiCamera className="mb-4 text-primary" size={48} />
                <h3 className="text-xl font-semibold text-center">{name}</h3>
              </>
            ) : idx === 1 ? (
              <>
                <FiRadio className="mb-4 text-primary" size={48} />
                <h3 className="text-xl font-semibold text-center">{name}</h3>
              </>
            ) : idx === 2 ? (
              <>
                <FiCompass className="mb-4 text-primary" size={48} />
                <h3 className="text-xl font-semibold text-center">{name}</h3>
              </>
            ) : (
              <>
                <FiLock className="mb-4 text-primary" size={48} />
                <h3 className="text-xl font-semibold text-center">{name}</h3>
              </>
            )}
          </motion.div>
        ))}
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="bg-neutral-9 py-16"
        initial="hidden"
        whileInView="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center text-center"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              {idx === 0 ? (
                <FiStar size={40} className="mb-4 text-yellow-400" />
              ) : idx === 1 ? (
                <FiMap size={40} className="mb-4 text-primary" />
              ) : (
                <FiClock size={40} className="mb-4 text-teal-400" />
              )}
              <h4 className="text-2xl font-bold mb-2">{f.title}</h4>
              <p className="text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-16 container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          {t('servicesPage.rewiew.heading')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((ts, idx) => (
            <motion.div
              key={idx}
              className="bg-neutral-15 p-6 rounded-lg shadow-md"
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            >
              <p className="italic mb-4">"{ts.text}"</p>
              <h5 className="font-semibold text-right">– {ts.author}</h5>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call To Action Section */}
      <section className="bg-primary py-12">
        <div className="mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('servicesPage.callToAction.heading')}
          </h2>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-gray-200 transition"
          >
            {t('servicesPage.callToAction.button')}
          </Link>
        </div>
      </section>
    </div>
  )
}
