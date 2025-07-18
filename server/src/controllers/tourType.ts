import { Request, Response, NextFunction } from 'express'
import { TourType } from '../models/tourType'

export async function getTourTypes(req: Request, res: Response, next: NextFunction) {
  try {
    const types = await TourType.find().sort('name')
    res.json(types)
  } catch (err) {
    next(err)
  }
}
