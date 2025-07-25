import { Schema, model, Document } from 'mongoose'

export interface UserDoc extends Document {
  email: string
  passwordHash: string
  name?: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    role: { type: String, enum: ['user','admin'], default: 'user' },
  },
  { timestamps: true }
)

export const User = model<UserDoc>('User', userSchema)
