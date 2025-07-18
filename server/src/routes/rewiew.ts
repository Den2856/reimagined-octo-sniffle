import { Router } from 'express'
import { getReviews, createReview }  from '../controllers/rewiew'

const router = Router()

// GET /api/reviews or /api/reviews?trip=<tripId>
router.get('/', getReviews)
router.post('/', createReview)

export default router
