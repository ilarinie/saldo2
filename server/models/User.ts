import mongoose from 'mongoose'

export type UserModelType = {
  _id: string
  name: string
  picture: string
  googleProfileId: string
}

const UserSchema = new mongoose.Schema<UserModelType>(
  {
    name: { type: String, unique: true, index: true },
    googleProfileId: { type: String },
    picture: { type: String },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('User', UserSchema)
