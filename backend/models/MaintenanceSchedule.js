const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  machineId: { type: Number, required: true },
  status: { type: String, enum: ['HEALTHY', 'FAILURE_RISK'], required: true },
  prediction: { type: Number, enum: [0, 1], required: true },
  action: { type: String, default: 'NO_ACTION' },
  scheduledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MaintenanceSchedule', scheduleSchema);