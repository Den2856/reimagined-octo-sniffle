import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, type Variants, type RepeatType } from 'framer-motion';
import LeftPattern from '../../public/assets/forAll/pattern-left.svg';
import RightPattern from '../../public/assets/forAll/pattern-right.svg';

const MotionLink = motion(Link);

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};
const patternVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: [0, 5, 0, -5, 0],
    transition: { duration: 5, repeat: Infinity, repeatType: 'mirror' as RepeatType },
  },
};
const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CallToAction() {
  const { t } = useTranslation();

  return (
    <motion.section
      className="relative w-full max-w-screen-xl border-t-2.5 border-neutral-15 bg-neutral-8 text-white py-8 sm:py-16 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div className="absolute inset-y-0 left-0 z-10 pointer-events-none" variants={patternVariants}>
        <motion.img src={LeftPattern} alt="" aria-hidden="true" className="h-full w-auto object-cover" />
      </motion.div>
      <motion.div className="absolute inset-y-0 right-0 z-10 pointer-events-none" variants={patternVariants}>
        <motion.img src={RightPattern} alt="" aria-hidden="true" className="h-full w-auto object-cover" />
      </motion.div>

      <div className="relative z-10 px-4 flex flex-col md:flex-row items-center justify-between">
        <motion.div className="w-full md:w-2/3" variants={textVariants}>
          <motion.h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight" variants={textVariants}>
            {t('cta.heading')}
          </motion.h2>
          <motion.p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-100" variants={textVariants}>
            {t('cta.description')}
          </motion.p>
          <MotionLink
            to="/tours"
            className="mt-4 sm:mt-6 inline-block px-6 py-2 sm:px-8 sm:py-4 bg-button-primary hover:bg-button-hover text-white font-semibold rounded-full transition text-sm sm:text-base"
            variants={textVariants}
          >
            {t('cta.button')}
          </MotionLink>
        </motion.div>
      </div>
    </motion.section>
  );
}