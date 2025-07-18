import { Schema, model, Document, Types } from 'mongoose'

export interface TourTypeDoc extends Document {
  _id: Types.ObjectId
  name: string
}

const tourTypeSchema = new Schema<TourTypeDoc>({
  name: { type: String, required: true, unique: true },
})

export const TourType = model<TourTypeDoc>('TourType', tourTypeSchema)

