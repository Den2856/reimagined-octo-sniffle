import { motion, type Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { when: 'beforeChildren', staggerChildren: 0.1, duration: 0.6 }
  }
}

const childVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export default function TermsAndConditions() {
  const { t } = useTranslation()
  const sections = t('termsAndConditions.sections', { returnObjects: true }) as Array<{
    title: string
    content: string
    contact?: string
  }>

  return (
    <motion.main className="relative container mx-auto px-4 py-16">
      {/* decorative circles */}
      <div className="absolute top-0 -left-16 w-48 h-48 bg-primary opacity-20 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 -right-16 w-48 h-48 bg-sky-700 opacity-20 rounded-full filter blur-3xl" />

      <motion.div
        className="relative bg-neutral-15 border border-neutral-30 rounded-xl shadow-2xl p-8 md:p-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-4xl font-bold text-white mb-4"
          variants={childVariants}
        >
          {t('termsAndConditions.title')}
        </motion.h1>

        <motion.p
          className="text-sm text-gray-400 mb-8"
          variants={childVariants}
        >
          {t('termsAndConditions.lastUpdated')}
        </motion.p>

        <div className="space-y-12">
          {sections.map(({ title, content, contact }) => (
            <motion.div key={title} variants={childVariants}>
              <h2 className="text-2xl font-semibold text-white border-b border-primary pb-1 mb-3">
                {title}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {content}
                {contact && (
                  <a
                    href={`mailto:${contact}`}
                    className="text-primary underline ml-1"
                  >
                    {contact}
                  </a>
                )}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.main>
  )
}
