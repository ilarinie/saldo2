import mongoose from 'mongoose'
import { BudgetModelType } from './BudgetModel'
import { UserModelType } from './User'

export type PurchaseModelType = {
  amount: number
  description: string
  deleted: boolean
  budgetId: typeof mongoose.Types.ObjectId | BudgetModelType | string
  createdBy: typeof mongoose.Types.ObjectId | UserModelType | string
  createdAt: string
  updatedAt: string
  benefactors: Array<BenefactorDocument>
  type: 'transfer' | 'purchase'
  purchaseId: string
}
// Schema for purchase
const PurchaseSchema = new mongoose.Schema<PurchaseModelType>(
  {
    amount: { type: Number },
    description: { type: String },
    deleted: { type: Boolean, default: false },
    budgetId: { type: mongoose.Types.ObjectId, ref: 'Budget' },
    benefactors: [
      {
        amountPaid: Number,
        amountBenefitted: Number,
        user: { type: mongoose.Types.ObjectId, ref: 'User' },
      },
    ],
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    type: { type: String },
    purchaseId: { type: String, index: true },
  },
  {
    timestamps: true,
  }
)

export interface BenefactorDocument {
  amountPaid: number
  amountBenefitted: number
  user: string
}

export default mongoose.model('Purchase', PurchaseSchema)
