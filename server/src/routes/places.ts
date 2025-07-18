// server/src/routes/places.ts
import { Router, Request, Response, NextFunction } from 'express'
import { Place, PlaceDoc } from '../models/places'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const docs = await Place.find().sort('name').exec() as PlaceDoc[]

    const places = docs.map(p => ({
      id: p._id.toString(),
      name: p.name,
    }))

    res.json(places)
  } catch (err) {
    next(err)
  }
})

export default router
