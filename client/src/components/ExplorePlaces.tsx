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

  // уникальные континенты + "All"
  const continents = useMemo<Array<'All' | Trip['continent']>>(() => {
    const setC = new Set(trips.map(t => t.continent))
    return ['All', ...Array.from(setC)]
  }, [trips])

  // фильтрация по континенту и строке поиска
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
        className="relative h-72 bg-cover bg-center"
        style={{ backgroundImage: `url('/assets/features/hero-explore.jpg')` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center text-center px-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Explore Trips</h1>
          <div className="w-full max-w-md flex items-center bg-neutral-15 rounded-full overflow-hidden">
            <FiSearch className="text-gray-400 ml-4" size={20} />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 bg-transparent placeholder-gray-400 text-white focus:outline-none"
            />
          </div>
        </motion.div>
      </motion.header>

      {/* Continent Tabs */}
      <motion.nav
        className="px-4 mt-8 flex space-x-4 max-[570px]:hidden"
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
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              continentFilter === c
                ? 'bg-button-primary hover:bg-button-hover text-white'
                : 'bg-neutral-15 hover:bg-neutral-20'
            }`}
          >
            {c}
          </button>
        ))}
      </motion.nav>

      {/* Grid of Trips */}
      <motion.section
        className="mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
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
              <div className="h-48 overflow-hidden">
                <img
                  src={t.imageUrl}
                  alt={t.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{t.title}</h3>
                <p className="text-gray-400 text-lg">{t.location}</p>
              </div>
              <div
                className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-center p-4 opacity-0 group-hover:opacity-100 transition"
              >
                <p className="text-gray-200 mb-4">
                  {t.description.slice(0, 100)}…
                </p>
                <Link
                  to={`/trips/${t.id}`}
                  className="inline-flex items-center px-4 py-2 bg-button-primary hover:bg-button-hover rounded-full text-white transition"
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
