import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FiSearch, FiArrowRight } from 'react-icons/fi'
import Spinner from './Spinner'
import { Link } from 'react-router-dom'

type Trip = {
  id: string
  title: string
  location: string
  description: string
  price: number
  rating: number
  reviewsCount: number
  imageUrl: string
  continent: 'Europe' | 'Asia' | 'Americas' | 'Oceania' | 'Africa'
}

export default function ExplorePlacesPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [search, setSearch] = useState('')
  const [continentFilter, setContinentFilter] =
    useState<'All' | Trip['continent']>('All')
  const [isLoading, setIsLoading] = useState(true)

  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    setIsLoading(true)
    axios
      .get<Trip[]>(`${API}/api/trips`)
      .then(res => setTrips(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [API])

  const continents = useMemo<Array<'All' | Trip['continent']>>(() => {
    const setC = new Set(trips.map(t => t.continent))
    return ['All', ...Array.from(setC)]
  }, [trips])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return trips.filter(t => {
      const matchCont =
        continentFilter === 'All' || t.continent === continentFilter
      const matchSearch =
        term === '' ||
        t.title.toLowerCase().includes(term) ||
        t.location.toLowerCase().includes(term)
      return matchCont && matchSearch
    })
  }, [trips, search, continentFilter])

  return (
    <div className="min-h-screen bg-neutral-8 text-white flex flex-col">
      {/* Hero + Search */}
      <motion.header
        className="relative h-48 sm:h-64 md:h-72 lg:h-96 xl:h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url('/assets/features/hero-explore.jpg')` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-8 lg:px-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
            Explore Trips
          </h1>
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex items-center bg-neutral-15 rounded-full overflow-hidden px-2 sm:px-4 py-1 sm:py-2">
            <FiSearch className="text-gray-400 flex-shrink-0" size={20} />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent placeholder-gray-400 text-white focus:outline-none px-2 sm:px-3 py-1 sm:py-2"
            />
          </div>
        </motion.div>
      </motion.header>

      {/* Continent Tabs */}
      <motion.nav
        className="hidden sm:flex px-4 sm:px-6 md:px-8 lg:px-10 mt-8 overflow-x-auto space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {continents.map(c => (
          <button
            key={c}
            onClick={() => {
              setContinentFilter(c)
              if (c === 'All') setSearch('')
            }}
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full whitespace-nowrap transition text-sm sm:text-base ${
              continentFilter === c
                ? 'bg-button-primary hover:bg-button-hover text-white'
                : 'bg-neutral-15 hover:bg-neutral-20 text-gray-200'
            }`}
          >
            {c}
          </button>
        ))}
      </motion.nav>

      {/* Grid of Trips */}
      <motion.section
        className="mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 sm:py-16 md:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10"
        initial="hidden"
        whileInView="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          filtered.map(t => (
            <motion.div
              key={t.id}
              className="relative bg-neutral-15 rounded-xl overflow-hidden shadow-lg group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
                <img
                  src={t.imageUrl}
                  alt={t.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition"
                />
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1">
                  {t.title}
                </h3>
                <p className="text-gray-400 text-base sm:text-lg md:text-xl">
                  {t.location}
                </p>
              </div>
              <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-center p-3 sm:p-4 md:p-6 opacity-0 group-hover:opacity-100 transition">
                <p className="text-gray-200 mb-2 sm:mb-3">
                  {t.description.slice(0, 100)}…
                </p>
                <Link
                  to={`/trips/${t.id}`}
                  className="inline-flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full bg-button-primary hover:bg-button-hover text-white transition text-sm sm:text-base md:text-lg"
                >
                  Learn More <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </motion.section>
    </div>
  )
}