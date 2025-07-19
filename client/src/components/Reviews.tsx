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
    axios
      .get<Review[]>('/api/reviews')
      .then(res => setReviews(res.data))
      .catch(console.error)
  }, [])

  const countries = useMemo(() => {
    const setC = new Set(reviews.map(r => r.location))
    return ['All', ...Array.from(setC)]
  }, [reviews])

  const filtered = useMemo(() => {
    return reviews.filter(r => {
      const byRating = ratingFilter === 0 || r.rating === ratingFilter
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
    <div className="bg-neutral-8 min-h-screen py-12 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-24">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-100 mb-8 sm:mb-10 md:mb-12">
          Reviews
        </h1>

        {/* Фильтры */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <select
              value={ratingFilter}
              onChange={e => setRatingFilter(+e.target.value)}
              className="w-full bg-neutral-15 text-white border border-neutral-20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-8 text-sm sm:text-base md:text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            >
              <option value={0}>All ratings</option>
              {[5, 4, 3, 2, 1].map(n => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'star' : 'stars'}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <select
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
              className="w-full bg-neutral-15 text-white border border-neutral-20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-8 text-sm sm:text-base md:text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            >
              {countries.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Список отзывов */}
        <AnimatePresence>
          {paginated.length > 0 ? (
            paginated.map((r, idx) => (
              <motion.div
                key={`${r.trip}-${(currentPage - 1) * pageSize + idx}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-neutral-15 border border-neutral-20 rounded-2xl shadow-md p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 transition-shadow hover:shadow-lg"
              >
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-sky-500 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-100">
                      {r.name}
                    </h3>
                    <span className="flex mt-2 sm:mt-0">
                      {Array.from({ length: r.rating }).map((_, j) => (
                        <img
                          className="mx-0.5 sm:mx-1"
                          key={j}
                          src={RewStar}
                          alt="star"
                        />
                      ))}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-2">
                    {r.location}
                  </p>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-medium text-white mb-2">
                    {r.title}
                  </h4>
                  <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
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
              className="text-center text-gray-500 mt-12 text-base sm:text-lg"
            >
              There are no reviews for the specified filters.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 sm:p-3 bg-neutral-15 rounded-full hover:bg-neutral-20 text-white disabled:opacity-50 transition"
              aria-label="Previous page"
            >
              <img src={ArrowLeft} alt="prev" />
            </button>
            <span className="text-base sm:text-lg md:text-xl text-neutral-60">
              {String(currentPage).padStart(2, '0')} of{' '}
              {String(totalPages).padStart(2, '0')}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 sm:p-3 bg-neutral-15 rounded-full hover:bg-neutral-20 text-white disabled:opacity-50 transition"
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