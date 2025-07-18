import { RequestHandler } from 'express'
import { Review } from '../models/rewiew'
import { Trip } from '../models/trip'

/**
 * GET /api/reviews
 */
export const getReviews: RequestHandler = async (req, res, next) => {
  try {
    const filter: Record<string, any> = {}
    if (req.query.trip) filter.trip = req.query.trip
    if (req.query.rating) filter.rating = Number(req.query.rating)

    let query = Review.find(filter)
      .populate<{ trip: { _id: any; location: string } }>('trip', 'location')
      .lean()

    if (req.query.limit) {
      const lim = parseInt(req.query.limit as string, 10)
      if (!isNaN(lim) && lim > 0) {
        query = query.limit(lim)
      }
    }

    const docs = await query.exec()

    const reviews = docs.map(d => ({
      rating: d.rating,
      title: d.title,
      text: d.text,
      name: d.name,
      avatar: d.avatarUrl || '/assets/trips/avatars/default.png',
      location: (d.trip as any).location,
      trip: (d.trip as any)._id.toString(),
    }))

    res.json(reviews)
  } catch (err) {
    next(err)
  }
}


/**
 * POST /api/reviews
 */
export const createReview: RequestHandler = async (req, res, next) => {
  try {
    const { trip, rating, title, text, name } = req.body as {
      trip: string
      rating: number
      title: string
      text: string
      name: string
    }

    // 0) найдём тур, чтобы получить его location
    const tripDoc = await Trip.findById(trip).lean()
    if (!tripDoc) {
      // просто вызываем res, без return-response
      res.status(400).json({ error: 'Invalid trip ID' })
      return
    }

    // 1) создаём отзыв с обязательными полями
    const reviewDoc = await Review.create({
      trip: tripDoc._id,
      rating,
      title,
      text,
      name,
      location: tripDoc.location,
      avatarUrl: req.body.avatarUrl || '/assets/trips/avatars/default.png',
    })

    // 2) возвращаем ответ — без return
    res.status(201).json({
      rating: reviewDoc.rating,
      title: reviewDoc.title,
      text: reviewDoc.text,
      name: reviewDoc.name,
      avatar: reviewDoc.avatarUrl,
      location: reviewDoc.location,
      trip: reviewDoc.trip.toString(),
    })
  } catch (err) {
    next(err)
  }
}
