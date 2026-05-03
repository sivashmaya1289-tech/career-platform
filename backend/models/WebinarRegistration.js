const mongoose = require('mongoose');

const webinarRegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    webinarDate: {
      type: String,
      default: 'TBD - You will receive details via SMS',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WebinarRegistration', webinarRegistrationSchema);
