import mongoose from 'mongoose';

export type UserType = {
  _id: string;
  name: string;
  picture: string;
  googleProfileId: string;
};

const UserSchema = new mongoose.Schema<UserType>(
  {
    name: { type: String, unique: true, index: true },
    googleProfileId: { type: String },
    picture: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', UserSchema);
