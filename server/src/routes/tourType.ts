import { Router, Request, Response, NextFunction } from 'express'
import { TourType, TourTypeDoc } from '../models/tourType'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const docs = await TourType.find().sort('name').exec() as TourTypeDoc[]

    const types = docs.map(t => ({
      id:   t._id.toString(),
      name: t.name,
    }))

    res.json(types)
  } catch (err) {
    next(err)
  }
})

export default router
