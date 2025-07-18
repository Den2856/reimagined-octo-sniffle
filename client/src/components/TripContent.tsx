import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import ExpandableText from './ExpandableText'
import TestimonialsSection from './TestimonialsSection'
import LeaveReviewForm from './LeaveReviewForm'
import RewStar from '../../public/assets/swiper/rewiew-star.svg'
import type { BannerVariant } from './Banner'
import Spinner from './Spinner'

type Trip = {
  id: string
  title: string
  location: string
  description: string
  price: number
  rating: number
  reviewsCount: number
  imageUrl: string
  coords: [number, number]
}

interface TripContentProps {
  bannerVariant: BannerVariant
  setBannerVariant: React.Dispatch<React.SetStateAction<BannerVariant>>
}

export default function TripContent({
  setBannerVariant,
}: TripContentProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()

  const [trip, setTrip] = useState<Trip | null>(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  useEffect(() => {
    axios
      .get<Trip>(`${import.meta.env.VITE_API_URL}/api/trips/${id}`)
      .then(res => setTrip(res.data))
      .catch(console.error)
  }, [id])

  if (!trip) {
    return (
      <div className="p-12 text-center text-white">
        <Spinner />
      </div>
    )
  }

  const handleBookNow = () => {
    if (!user) {
      setBannerVariant('alert')
      return
    }
    if (!checkIn || !checkOut) {
      setBannerVariant('info')
      return
    }
    addToCart({
      tripId: trip.id,
      location: trip.location,
      price: trip.price,
      imagePath: trip.imageUrl,
      checkIn,
      checkOut,
      guests,
      coords: trip.coords
    })
    navigate('/cart')
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Hero */}
      <div className="flex flex-col lg:flex-row bg-neutral-15 rounded-2xl overflow-hidden shadow-lg">
        <div className="lg:flex-1 relative group overflow-hidden">
          <img
            src={trip.imageUrl}
            alt={trip.title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="lg:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">
              {trip.title}
            </h1>
            <p className="text-lg text-gray-100 mb-4">
              {trip.location}
            </p>
            <p className="text-3xl font-semibold text-button-primary mb-6">
              ${trip.price.toFixed(2)}
            </p>
            <ExpandableText
              text={trip.description}
              maxChars={300}
              className="text-gray-300 leading-relaxed"
            />
          </div>
          <div className="mt-6 flex items-center space-x-2">
            <div className="flex space-x-1">
              {Array.from({ length: trip.rating }).map((_, j) => (
                <img key={j} src={RewStar} alt="star" />
              ))}
            </div>
            <span className="text-gray-100">
              ({trip.rating})
            </span>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-neutral-15 p-8 rounded-2xl shadow-lg transform hover:shadow-2xl transition-shadow">
        <h2 className="text-2xl font-bold text-white mb-6">
          Book Your Stay
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <label className="flex flex-col">
            <span className="text-gray-100 mb-2">Check-in</span>
            <input
              type="date"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="px-4 py-3 bg-neutral-10 text-white rounded-lg focus:ring-2 focus:ring-button-primary focus:outline-none transition"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-100 mb-2">Check-out</span>
            <input
              type="date"
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().slice(0, 10)}
              className="px-4 py-3 bg-neutral-10 text-white rounded-lg focus:ring-2 focus:ring-button-primary focus:outline-none transition"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-100 mb-2">Guests</span>
            <select
              value={guests}
              onChange={e => setGuests(+e.target.value)}
              className="px-4 py-3 bg-neutral-10 text-white rounded-lg focus:ring-2 focus:ring-button-primary focus:outline-none transition"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          onClick={handleBookNow}
          className="mt-8 w-full md:w-auto px-8 py-4 bg-button-primary hover:bg-button-hover text-white font-semibold rounded-lg transition-transform transform hover:-translate-y-1"
        >
          Book Now
        </button>
      </div>

      {/* Reviews */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">
          Reviews ({trip.reviewsCount})
        </h2>
        <TestimonialsSection tripId={id!} />

        <LeaveReviewForm 
          tripId={id!}
          onSuccess={() => window.location.reload()}
        />
      </section>
    </main>
  )
}
