const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length === 15 && v.every((a) => ['yes', 'sometimes', 'no'].includes(a));
        },
        message: 'Answers must be 15 valid responses (yes/sometimes/no)',
      },
    },
    scores: {
      engineering: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
      commerce: { type: Number, default: 0 },
    },
    result: {
      type: String,
      required: true,
      enum: ['Engineering & Technology', 'Medical & Life Sciences', 'Commerce & Business'],
    },
    resultDescription: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TestResult', testResultSchema);
