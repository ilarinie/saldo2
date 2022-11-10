import mongoose from 'mongoose'

export type UserModelType = {
  _id: string
  name: string
  picture: string
  googleProfileId: string
  defaultBudgetId: string
}

const UserSchema = new mongoose.Schema<UserModelType>(
  {
    name: { type: String, unique: true, index: true },
    googleProfileId: { type: String, unique: true, index: true },
    picture: { type: String },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('User', UserSchema)
