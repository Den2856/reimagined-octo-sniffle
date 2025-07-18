import { Schema, model, Document, Types } from 'mongoose'

export interface ReviewDoc extends Document {
  trip: Types.ObjectId      // ссылка на Trip
  rating: number
  title: string
  text: string
  name: string
  location: string
  avatarUrl: string
}

const reviewSchema = new Schema<ReviewDoc>({
  trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  rating: { type: Number, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  avatarUrl: { type: String, required: true },
})

export const Review = model<ReviewDoc>('Review', reviewSchema)
