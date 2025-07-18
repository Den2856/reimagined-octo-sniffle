import { RequestHandler } from 'express'
import { Types } from 'mongoose'
import { Trip } from '../models/trip'
import { Review } from '../models/rewiew'  // проверьте название файла!

/**
 * Возвращает все туры с подсчитанными средним рейтингом и количеством отзывов.
 */
export const getAllTrips: RequestHandler = async (_req, res, next): Promise<void> => {
  try {
    const trips = await Trip.find().lean().exec()

    // соберём статистику по отзывам для всех туров
    const stats = await Review.aggregate([
      { $match: { trip: { $in: trips.map(t => t._id) } } },
      {
        $group: {
          _id: '$trip',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]).exec()

    const statsMap = new Map<string, { avgRating: number; count: number }>()
    stats.forEach(s => {
      statsMap.set(s._id.toString(), {
        avgRating: parseFloat(s.avgRating.toFixed(2)),
        count: s.count,
      })
    })

    const result = trips.map(t => {
      const id = t._id.toString()
      const st = statsMap.get(id) ?? { avgRating: 0, count: 0 }
      return {
        id,
        title: t.title,
        location: t.location,
        description: t.description,
        price: t.price,
        continent: t.continent,
        coords: t.coords as [number, number],
        imageUrl: `../src/assets/trips/${t.imagePath}`,  // скорректируйте согласно раздаче статики
        rating: st.avgRating,
        reviewsCount: st.count,
      }
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
}

/**
 * Возвращает «избранные» туры (первые 8), с подсчитанным средним рейтингом и количеством отзывов.
 */
export const getFeaturedTrips: RequestHandler = async (_req, res, next): Promise<void> => {
  try {
    // получаем первые 8 туров
    const trips = await Trip.find().limit(9).lean().exec()

    // статистика по отзывам для этих туров
    const stats = await Review.aggregate([
      { $match: { trip: { $in: trips.map(t => t._id) } } },
      {
        $group: {
          _id: '$trip',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]).exec()

    const statsMap = new Map<string, { avgRating: number; count: number }>()
    stats.forEach(s => {
      statsMap.set(s._id.toString(), {
        avgRating: parseFloat(s.avgRating.toFixed(2)),
        count: s.count,
      })
    })

    const result = trips.map(t => {
      const id = t._id.toString()
      const st = statsMap.get(id) ?? { avgRating: 0, count: 0 }
      return {
        id,
        title: t.title,
        location: t.location,
        description: t.description,
        price: t.price,
        continent: t.continent,
        coords: t.coords as [number, number],
        imageUrl: `../src/assets/trips/${t.imagePath}`,
        rating: st.avgRating,
        reviewsCount: st.count,
      }
    })

    res.json(result)
  } catch (err) {
    next(err)
  }
}

/**
 * Возвращает один тур по его ID, плюс статистику отзывов.
 */
export const getTripById: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { id } = req.params

    // проверим, что id валиден ObjectId
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid trip ID' })
      return
    }

    const t = await Trip.findById(id).lean().exec()
    if (!t) {
      res.status(404).json({ message: 'Trip not found' })
      return
    }

    // агрегируем отзывы только для этого тура
    const agg = await Review.aggregate([
      { $match: { trip: t._id } },
      {
        $group: {
          _id: '$trip',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]).exec()

    const { avgRating = 0, count = 0 } = agg[0] ?? {}

    res.json({
      id: t._id.toString(),
      title: t.title,
      location: t.location,
      description: t.description,
      price: t.price,
      coords: t.coords as [number, number],
      imageUrl: `../src/assets/trips/${t.imagePath}`,
      rating: parseFloat(avgRating.toFixed(2)),
      reviewsCount: count,
    })
  } catch (err) {
    next(err)
  }
}
