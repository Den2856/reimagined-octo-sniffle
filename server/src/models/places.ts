import { Schema, model, Document, Types } from 'mongoose'

export interface PlaceDoc extends Document {
  _id: Types.ObjectId
  name: string
}

const placeSchema = new Schema<PlaceDoc>({
  name: { type: String, required: true, unique: true },
})

export const Place = model<PlaceDoc>('Place', placeSchema)