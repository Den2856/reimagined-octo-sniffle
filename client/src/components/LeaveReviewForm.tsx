import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

interface LeaveReviewFormProps {
  tripId: string
  onSuccess?: () => void
}

export default function LeaveReviewForm({ tripId, onSuccess }: LeaveReviewFormProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [title, setTitle]  = useState('')
  const [text, setText]   = useState('')
  const [error, setError]  = useState('')
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Please login to leave a review.')
      return
    }
    try {
      await axios.post('/api/reviews', {
        trip:   tripId,
        rating,
        title,
        text,
        name:   user.name || user.email
      })
      // очистим форму
      setRating(5)
      setTitle('')
      setText('')
      setError('')
      if (onSuccess) onSuccess()
    } catch {
      setError('Failed to submit review.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-15 p-6 rounded-2xl shadow-lg space-y-4"
    >
      <h3 className="text-xl font-semibold text-white">Leave a Review</h3>
      {error && <p className="text-red-400">{error}</p>}

      <div className="flex items-center space-x-2">
        <span className="text-gray-100">Rating:</span>
        <select
          value={rating}
          onChange={e => setRating(+e.target.value)}
          className="px-3 py-1 bg-neutral-10 text-white rounded focus:ring-2 focus:ring-button-primary transition"
        >
          {[5,4,3,2,1].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Review title"
        required
        className="w-full px-4 py-2 bg-neutral-10 text-white rounded focus:ring-2 focus:ring-button-primary transition"
      />

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Your comments..."
        rows={4}
        required
        className="w-full min-h-[111px] px-4 py-2 bg-neutral-10 text-white rounded focus:ring-2 focus:ring-button-primary transition"
      />

      <button
        type="submit"
        className="px-6 py-2 bg-button-primary hover:bg-button-hover text-white font-semibold rounded-lg transition-transform transform hover:-translate-y-1"
      >
        Submit Review
      </button>
    </form>
  )
}
