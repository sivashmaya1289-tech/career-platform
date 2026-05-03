const mongoose = require('mongoose');

const counsellingBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    slot: {
      type: String,
      enum: ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'],
    },
    date: {
      type: String,
    },
    amount: {
      type: Number,
      default: 49900, // in paise = ₹499
    },
    counsellorName: {
      type: String,
      default: 'Expert Career Counsellor',
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/placeholder-link',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CounsellingBooking', counsellingBookingSchema);
