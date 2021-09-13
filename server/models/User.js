const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    googleProfileId: { type: String },
    picture: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
