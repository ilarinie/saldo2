import mongoose from 'mongoose'
import { UserModelType } from './User'

export type BudgetModelType = {
  _id: string
  name: string
  owners: UserModelType[]
  members: UserModelType[]
  deleted: boolean
  createdAt: string
  updatedAt: string
  type: 'saldo' | 'budget'
}

const BudgetSchema = new mongoose.Schema<BudgetModelType, any, BudgetModelType>(
  {
    name: { type: String },
    owners: [{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }],
    members: [{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }],
    deleted: { type: Boolean, default: false },
    type: { type: String },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Budget', BudgetSchema)
