const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema(
  {
    name: { type: String },
    owners: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    members: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Budget', BudgetSchema);
