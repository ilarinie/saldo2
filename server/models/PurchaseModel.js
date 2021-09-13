const mongoose = require('mongoose');

// Schema for purchase
const PurchaseSchema = new mongoose.Schema(
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

module.exports = mongoose.model('Purchase', PurchaseSchema);
