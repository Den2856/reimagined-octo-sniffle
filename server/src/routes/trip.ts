import { Router } from 'express'
import { getAllTrips, getFeaturedTrips, getTripById } from '../controllers/trip'
const router = Router()

router.get('/', getAllTrips)
router.get('/featured', getFeaturedTrips)
router.get('/:id', getTripById)

export default router
