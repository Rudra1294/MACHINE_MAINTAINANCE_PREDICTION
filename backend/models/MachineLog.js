const mongoose = require('mongoose');

const machineLogSchema = new mongoose.Schema({
  udi: { type: Number, required: true, unique: true },
  productId: { type: String, required: true },
  type: { type: String, enum: ['L', 'M', 'H'], required: true },
  airTemperatureK: { type: Number, required: true }, // Maps to Air temperature [K]
  processTemperatureK: { type: Number, required: true }, // Maps to Process temperature [K][cite: 1]
  rotationalSpeedRPM: { type: Number, required: true }, // Maps to Rotational speed [rpm][cite: 1]
  torqueNm: { type: Number, required: true }, // Maps to Torque [Nm][cite: 1]
  toolWearMin: { type: Number, required: true }, // Maps to Tool wear [min][cite: 1]
  machineFailure: { type: Number, enum: [0, 1], required: true }, // Binary failure label[cite: 1]
  failureModes: {
    twf: { type: Number, enum: [0, 1], default: 0 },
    hdf: { type: Number, enum: [0, 1], default: 0 },
    pwf: { type: Number, enum: [0, 1], default: 0 },
    osf: { type: Number, enum: [0, 1], default: 0 },
    rnf: { type: Number, enum: [0, 1], default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('MachineLog', machineLogSchema);