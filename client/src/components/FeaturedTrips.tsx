import { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import ExpandableText from './ExpandableText'
import Stars from '../../public/assets/stars.png'
import ArrowLeft from '../../public/assets/swiper/left-arrow.svg'
import ArrowRight from '../../public/assets/swiper/right-arrow.svg'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'

type Trip = {
  id: string
  title: string
  location: string
  description: string
  price: number
  rating: number
  reviewsCount: number
  imageUrl: string
}

// Контейнер со staggerChildren для всех карточек
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}
// Каждая карточка: fade-in + slide-up
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function FeaturedTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagesCount, setPagesCount] = useState(1)

  const swiperRef = useRef<any>(null)
  // сколько показывается слайдов одновременно
  const spvRef = useRef<number>(3)

  const API = import.meta.env.VITE_API_URL || ''

  // Загрузка туров
  useEffect(() => {
    axios
      .get<Trip[]>(`${API}/api/trips/featured`)
      .then(res => {
        setTrips(res.data)
        // после загрузки, если инициализация ещё не прошла, сбросим на 1
        setPagesCount(1)
      })
      .catch(console.error)
  }, [API])

  // Функция пересчёта количества «страниц»
  const recalcPages = () => {
    const total = trips.length
    const spv = spvRef.current || 1
    // если всего меньше или равно slidesPerView — одна «страница»
    const count = total > spv ? total - spv + 1 : 1
    setPagesCount(count)
    // скорректировать currentPage, если за границами
    setCurrentPage(prev => Math.min(prev, count))
  }

  // Инициализация Swiper
  const handleSwiperInit = (s: any) => {
    swiperRef.current = s
    // определяем slidesPerView после инициализации
    const spv = typeof s.params.slidesPerView === 'number'
      ? s.params.slidesPerView
      : 1
    spvRef.current = spv
    recalcPages()
    // установить текущую страницу (индекс первого видимого слайда +1)
    setCurrentPage(s.realIndex + 1)
  }

  // Обновлять pagesCount при изменении списка туров
  useEffect(() => {
    if (swiperRef.current) {
      recalcPages()
    }
  }, [trips])

  // Кнопка «назад»
  const goPrev = () => {
    swiperRef.current?.slidePrev()
  }
  // Кнопка «вперед»
  const goNext = () => {
    swiperRef.current?.slideNext()
  }

  return (
    <motion.section
      className="w-full py-12 bg-neutral-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.6 }}
      variants={containerVariants}
    >
      <div className="mx-auto px-4">
        {/* Заголовок и описание */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="block max-sm:hidden text-4xl font-bold text-white space-x-2">
            <img className="flex-start" src={Stars} alt="stars" />
            <span>Featured Trips</span>
          </h2>
          <Link
            to="/tours"
            className="px-4 py-2 border border-neutral-20 rounded-lg text-white hover:bg-neutral-15 transition"
          >
            View all trips
          </Link>
        </div>

        {/* Слайдер */}
        <Swiper
          modules={[Navigation]}
          onSwiper={handleSwiperInit}
          onSlideChange={(s: { realIndex: number }) => setCurrentPage(s.realIndex + 1)}
          spaceBetween={24}
          slidesPerView={3}
          slidesPerGroup={1}
          breakpoints={{
            0:    { slidesPerView: 1, slidesPerGroup: 1 },
            768:  { slidesPerView: 2, slidesPerGroup: 1 },
            1200: { slidesPerView: 3, slidesPerGroup: 1 },
          }}
          navigation={false}
          loop={false}
        >
          {trips.map((item) => (
            <SwiperSlide key={item.id}>
              <motion.div
                className="bg-neutral-15 border border-neutral-20 rounded-lg overflow-hidden"
                variants={itemVariants}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-3xl text-white">{item.location}</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    <ExpandableText text={item.title} maxChars={52} />
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xl text-gray-400">From</p>
                      <p className="text-2xl font-bold text-white">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <Link
                      to={`/trips/${item.id}`}
                      className="px-4 py-3 bg-button-primary hover:bg-button-hover text-white rounded-lg transition"
                    >
                      View Details
                    </Link>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-white text-[20px] font-medium">
                      {item.rating.toFixed(2)}
                    </span>
                    <span className="text-[20px] text-neutral-60">
                      {' '}({item.reviewsCount})
                    </span>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Пагинация */}
        <div className="mt-8 flex items-center justify-between">
          <span className="text-gray-400">
            {String(currentPage).padStart(2, '0')} of{' '}
            {String(pagesCount).padStart(2, '0')}
          </span>
          <div className="flex space-x-4">
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className="p-2 bg-neutral-15 rounded-full hover:bg-neutral-20 text-white disabled:opacity-50"
              aria-label="Previous trip"
            >
              <img src={ArrowLeft} alt="Prev" />
            </button>
            <button
              onClick={goNext}
              disabled={currentPage === pagesCount}
              className="p-2 bg-neutral-15 rounded-full hover:bg-neutral-20 text-white disabled:opacity-50"
              aria-label="Next trip"
            >
              <img src={ArrowRight} alt="Next" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
