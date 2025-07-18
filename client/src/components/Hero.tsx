import { motion, type Variants } from 'framer-motion'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

type HeroSectionProps = {
  backgroundImage: string
}

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } }
}
const titleVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { delay: 0.5, duration: 0.8 } }
}

export default function HeroSection({
  backgroundImage,
}: HeroSectionProps) {
  const { t } = useTranslation()
  const lines = t('heroSection.slogan').split('\n')

  return (
    <motion.section
      className="relative w-full h-[600px] bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <motion.div
        className="absolute inset-0 bg-black/40"
        variants={sectionVariants}
      />

      <div className="relative z-10 container mx-auto h-full px-4 flex flex-col items-center justify-center">
        <motion.h1
          className="text-white text-6xl md:text-5xl lg:text-6xl font-bold text-center leading-snug"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          {lines.map((line, i) => (
            <Fragment key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </Fragment>
          ))}
        </motion.h1>
      </div>
    </motion.section>
  )
}
