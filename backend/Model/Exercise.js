const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, 
    required: true
  },
  exercises: {
    pushups: { type: Number, default: 0 },
    squats: { type: Number, default: 0 },
    bicep_curl: { type: Number, default: 0 },
    shoulder_taps: { type: Number, default: 0 }
  }
}, { timestamps: true });

exerciseSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Exercise', exerciseSchema);
