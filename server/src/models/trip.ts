import { Schema, model, Document, Types } from 'mongoose'

export interface TripDoc extends Document {
  _id: Types.ObjectId
  title: string
  location: string
  description: string
  price: number
  rating: number
  reviewsCount: number
  imagePath: string
  continent: 'Europe' | 'Asia' | 'Americas' | 'Oceania' | 'Africa'
  coords: [number, number]
}

const TripSchema = new Schema<TripDoc>(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    reviewsCount: { type: Number, required: true },
    imagePath: { type: String, required: true },
    continent: {
      type: String,
      required: true,
      enum: ['Europe','Asia','Americas','Oceania','Africa']
    },
    coords: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr: any) => Array.isArray(arr) && arr.length === 2,
        message: 'coords must be [lat, lon]'
      }
    },
  },
  { timestamps: true }
)

export const Trip = model<TripDoc>('Trip', TripSchema)
