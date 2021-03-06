const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema(
  {
    amount: { type: Number },
    description: { type: String },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Purchase', PurchaseSchema);
