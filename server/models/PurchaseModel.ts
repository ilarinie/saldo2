import mongoose from 'mongoose';

export type PurchaseType = {
  amount: number;
  description: string;
  deleted: boolean;
  budgetId: any;
  createdBy: any;
  createdAt: string;
  updatedAt: string;
  benefactors: Array<{
    amountPaid: number;
    amountBenefitted: number;
    user: string;
  }>;
};
// Schema for purchase
const PurchaseSchema = new mongoose.Schema<PurchaseType>(
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
  },
  {
    timestamps: true,
  }
);

export interface BenefactorDocument {
  amountPaid: number;
  amountBenefitted: number;
  user: string;
}

export default mongoose.model('Purchase', PurchaseSchema);
