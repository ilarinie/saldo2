import mongoose from 'mongoose';

export type PurchaseType = {
  amount: number;
  description: string;
  deleted: boolean;
  budgetId: any;
  payer: any;
  createdBy: any;
  createdAt: string;
  updatedAt: string;
};
// Schema for purchase
const PurchaseSchema = new mongoose.Schema<PurchaseType>(
  {
    amount: { type: Number },
    description: { type: String },
    deleted: { type: Boolean, default: false },
    budgetId: { type: mongoose.Types.ObjectId, ref: 'Budget' },
    payer: { type: mongoose.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Purchase', PurchaseSchema);
