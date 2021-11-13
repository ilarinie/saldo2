import mongoose from 'mongoose'
import { BudgetModelType } from './BudgetModel'
import { UserModelType } from './User'

export type BudgetActionLogActionType = 'create_purchase' | 'delete_purchase'

export type BudgetActionLogModelType = {
  _id: string
  budgetId: typeof mongoose.Types.ObjectId | BudgetModelType | string
  action: BudgetActionLogActionType
  user: typeof mongoose.Types.ObjectId | UserModelType | string
  meta: any
  createdAt: string
  updatedAt: string
}

const BudgetActionLogSchema = new mongoose.Schema<BudgetActionLogModelType, any, BudgetActionLogModelType>(
  {
    budgetId: { type: mongoose.Types.ObjectId, ref: 'Budget', index: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    action: { type: String },
    meta: { type: Object },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('BudgetActionLog', BudgetActionLogSchema)
