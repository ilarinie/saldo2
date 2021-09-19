import mongoose from 'mongoose';
import { UserType } from './User';

export type BudgetType = {
  _id: string;
  name: string;
  owners: UserType[];
  members: UserType[];
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  type: 'saldo' | 'budget';
};

const BudgetSchema = new mongoose.Schema<BudgetType, any, BudgetType>(
  {
    name: { type: String },
    owners: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    members: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    deleted: { type: Boolean, default: false },
    type: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Budget', BudgetSchema);
