const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  twoFactorSecret: { type: String }, // Stores the generated secret for OTP validation
  is2FAEnabled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
