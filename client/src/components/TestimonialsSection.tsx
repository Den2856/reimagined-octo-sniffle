import { useRef, useState, useEffect } from "react"
import { motion, type Variants } from "framer-motion"
import { Link } from "react-router-dom"
import axios from "axios"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import Stars from "../../public/assets/stars.png"
import ArrowLeft from "../../public/assets/swiper/left-arrow.svg"
import ArrowRight from "../../public/assets/swiper/right-arrow.svg"
import RewStar from "../../public/assets/swiper/rewiew-star.svg"

type Testimonial = {
  rating: number
  title: string
  text: string
  name: string
  location: string
  avatar: string
  trip: string
}

interface TestimonialsSectionProps {
  tripId?: string
}

export default function TestimonialsSection({
  tripId,
}: TestimonialsSectionProps) {
  const [reviews, setReviews] = useState<Testimonial[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagesCount, setPagesCount] = useState(1)
  const swiperRef = useRef<any>(null)
  const spvRef = useRef<number>(1)
  const API = import.meta.env.VITE_API_URL || ""

  useEffect(() => {
    const base = tripId
      ? `${API}/api/reviews?trip=${tripId}`
      : `${API}/api/reviews`
    const url = `${base}${base.includes('?') ? '&' : '?'}rating=5&limit=9`
    axios
      .get<Testimonial[]>(url)
      .then(res => setReviews(res.data))
      .catch(console.error)
  }, [API, tripId])

  const recalcPages = () => {
    const total = reviews.length
    const spv = spvRef.current || 1
    const count = total > spv ? total - spv + 1 : 1
    setPagesCount(count)
    setCurrentPage(prev => Math.min(prev, count))
  }

  useEffect(() => {
    recalcPages()
    setCurrentPage(1)
  }, [reviews])

  const handleSwiperInit = (swiper: any) => {
    swiperRef.current = swiper
    const spv =
      typeof swiper.params.slidesPerView === "number"
        ? swiper.params.slidesPerView
        : 1
    spvRef.current = spv
    recalcPages()
    setCurrentPage(swiper.realIndex + 1)
  }

  if (reviews.length === 0) {
    return (
      <motion.section
        className="py-16 bg-neutral-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.3 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="block max-sm:hidden text-4xl flex-col font-bold text-white space-x-2">
            <img className="flex-start" src={Stars} alt="stars" />
            <span>What Our Clients Say</span>
          </h2>
          <Link
            to="/reviews"
            className="px-4 py-2 border border-neutral-20 rounded-lg text-white hover:bg-neutral-15 transition"
          >
            View all reviews
          </Link>
        </div>
        <motion.div
          className="max-w-xl mx-auto text-center px-4 py-8 space-y-6"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h3 className="text-3xl font-extrabold text-white">
            There are no reviews here yet
          </h3>
          <p className="text-gray-400 text-lg">
            Travelers have not left their impressions yet. Be the first and share!
          </p>
          <Link
            to="/reviews"
            className="inline-block px-6 py-3 bg-primary-light hover:bg-primary text-white font-semibold rounded-lg shadow-md transition-transform transform hover:-translate-y-1"
          >
            View all reviews
          </Link>
        </motion.div>
      </motion.section>
    )
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.section
      className="py-16 bg-neutral-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
    >
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl flex-col font-bold text-white space-x-2">
            <img className="flex-start" src={Stars} alt="stars" />
            <span>What Our Clients Say</span>
          </h2>
          <Link
            to="/reviews"
            className="px-4 py-2 border border-neutral-20 rounded-lg text-white hover:bg-neutral-15 transition"
          >
            View all reviews
          </Link>
        </div>

        <Swiper
          modules={[Navigation]}
          onSwiper={handleSwiperInit}
          onSlideChange={(s: any) => setCurrentPage(s.realIndex + 1)}
          spaceBetween={24}
          slidesPerView={1}
          slidesPerGroup={1}
          breakpoints={{
            768:  { slidesPerView: 2, slidesPerGroup: 1 },
            1024: { slidesPerView: 3, slidesPerGroup: 1 },
          }}
          navigation={false}
          loop={false}
        >
          {reviews.map((r, idx) => (
            <SwiperSlide key={idx}>
              <motion.div
                className="p-6 bg-neutral-8 rounded-lg border border-neutral-15 h-full flex flex-col"
                variants={itemVariants}
              >
                <div className="flex space-x-1">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <img key={j} src={RewStar} alt="RewStar" />
                  ))}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {r.title}
                </h3>
                <p className="mt-2 text-gray-400 flex-1">{r.text}</p>
                <div className="mt-4 flex items-center space-x-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white">{r.name}</p>
                    <p className="text-gray-400 text-sm">{r.location}</p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-8 flex items-center justify-between">
          <span className="text-gray-400">
            {String(currentPage).padStart(2, "0")} of{" "}
            {String(pagesCount).padStart(2, "0")}
          </span>
          <div className="flex space-x-4">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={currentPage === 1}
              className="p-2 bg-neutral-15 rounded-full hover:bg-neutral-20 text-white disabled:opacity-50"
              aria-label="Previous testimonial"
            >
              <img src={ArrowLeft} alt="ArrowLeft" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={currentPage === pagesCount}
              className="p-2 bg-neutral-15 rounded-full hover:bg-neutral-20 text-white disabled:opacity-50"
              aria-label="Next testimonial"
            >
              <img src={ArrowRight} alt="ArrowRight" />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
