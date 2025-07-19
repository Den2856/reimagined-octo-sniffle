import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import RewStar from '../../public/assets/swiper/rewiew-star.svg'
import ArrowLeft from '../../public/assets/swiper/left-arrow.svg'
import ArrowRight from '../../public/assets/swiper/right-arrow.svg'

type Review = {
  rating: number
  title: string
  text: string
  name: string
  avatar: string
  location: string
  trip: string
}

export default function AllReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratingFilter, setRatingFilter] = useState<number>(0)
  const [countryFilter, setCountryFilter] = useState<string>('All')

  // пагинация
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    axios.get<Review[]>('/api/reviews')
      .then(res => setReviews(res.data))
      .catch(console.error)
  }, [])

  const countries = useMemo(() => {
    const setC = new Set(reviews.map(r => r.location))
    return ['All', ...Array.from(setC)]
  }, [reviews])

  const filtered = useMemo(() => {
    return reviews.filter(r => {
      const byRating  = ratingFilter  === 0 || r.rating  === ratingFilter
      const byCountry = countryFilter === 'All' || r.location === countryFilter
      return byRating && byCountry
    })
  }, [reviews, ratingFilter, countryFilter])

  // сброс страницы при фильтрах
  useEffect(() => {
    setCurrentPage(1)
  }, [ratingFilter, countryFilter])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="bg-neutral-8 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-5xl font-extrabold text-gray-100 mb-12">
          Reviews
        </h1>

        {/* Фильтры */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <select
              value={ratingFilter}
              onChange={e => setRatingFilter(+e.target.value)}
              className="w-full bg-neutral-15 text-white border border-neutral-20 rounded-lg px-4 py-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            >
              <option value={0}>All ratings</option>
              {[5,4,3,2,1].map(n => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'star' : 'stars'}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
              className="w-full bg-neutral-15 text-white border border-neutral-20 rounded-lg px-4 py-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            >
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Список отзывов */}
        <AnimatePresence>
          {paginated.length > 0 ? (
            paginated.map((r, idx) => (
              <motion.div
                key={`${r.trip}-${(currentPage-1)*pageSize + idx}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="
                  bg-neutral-15
                  border border-neutral-20
                  rounded-xl
                  shadow-md
                  p-6
                  mb-6
                  flex items-start gap-5
                  hover:shadow-lg
                  transition-shadow"
              >
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="
                    w-16 h-16
                    rounded-full
                    object-cover
                    border-2 border-sky-500
                    flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-gray-100">
                      {r.name}
                    </h3>
                    <span className="flex">
                      {Array.from({ length: r.rating }).map((_, j) => (
                        <img className="mx-1" key={j} src={RewStar} alt="star" />
                      ))}
                    </span>
                  </div>
                  <p className="text-xl text-gray-400 mb-2">{r.location}</p>
                  <h4 className="text-lg font-medium text-white mb-2">
                    {r.title}
                  </h4>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {r.text}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-12"
            >
              There are no reviews for the specified filters.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Пагинация в стиле TestimonialsSection */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-neutral-15 rounded-full hover:bg-neutral-20 text-white disabled:opacity-50"
              aria-label="Previous page"
            >
              <img src={ArrowLeft} alt="prev" />
            </button>
            <span className="text-lg text-neutral-60">
              {String(currentPage).padStart(2, '0')} of {String(totalPages).padStart(2, '0')}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2  bg-neutral-15 rounded-full hover:bg-neutral-20 text-white disabled:opacity-50"
              aria-label="Next page"
            >
              <img src={ArrowRight} alt="next" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
