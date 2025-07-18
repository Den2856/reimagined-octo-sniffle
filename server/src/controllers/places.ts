import { Request, Response, NextFunction } from 'express'
import { Place } from '../models/places'

export async function getPlaces(req: Request, res: Response, next: NextFunction) {
  try {
    const places = await Place.find().sort('name')
    res.json(places)
  } catch (err) {
    next(err)
  }
}
