const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const User = require('../models/User');
const CounsellingBooking = require('../models/CounsellingBooking');
const { sendCounsellingBookingEmail, sendStudentConfirmationEmail } = require('../utils/mailer');

// Initialize Razorpay
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { name, phone, email, class: studentClass } = req.body;

    if (!name || !phone || !studentClass) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and class are required.',
      });
    }

    const razorpay = getRazorpayInstance();

    // Amount in paise (₹499 = 49900 paise)
    const amount = 49900;
    const currency = 'INR';

    const orderOptions = {
      amount,
      currency,
      receipt: `order_${Date.now()}`,
      notes: {
        studentName: name,
        studentPhone: phone,
        studentClass: studentClass,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // Temporarily store user data in booking as pending
    let user = await User.findOne({ phone, type: 'counselling' });
    if (!user) {
      user = await User.create({
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        class: studentClass,
        type: 'counselling',
      });
    } else {
      // Update email if provided
      if (email) {
        user.email = email.trim();
        await user.save();
      }
    }

    // Create a pending booking
    const booking = await CounsellingBooking.create({
      userId: user._id,
      razorpayOrderId: order.id,
      paymentStatus: 'pending',
      amount,
    });

    return res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        bookingId: booking._id,
        keyId: process.env.RAZORPAY_KEY_ID,
        prefill: {
          name: user.name,
          contact: user.phone,
          email: user.email || '',
        },
      },
    });
  } catch (error) {
    console.error('Create order error:', error);

    if (error.message === 'Razorpay credentials not configured') {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured. Please contact support.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order. Please try again.',
    });
  }
});

// POST /api/payment/verify
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification fields.',
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      // Mark booking as failed
      await CounsellingBooking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'failed',
        razorpayPaymentId: razorpay_payment_id,
      });

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.',
      });
    }

    // Update booking with payment details
    const booking = await CounsellingBooking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully!',
      data: {
        bookingId: booking._id,
        paymentId: razorpay_payment_id,
      },
    });
  } catch (error) {
    console.error('Payment verify error:', error);
    return res.status(500).json({ success: false, message: 'Server error during verification.' });
  }
});

// POST /api/counselling/book
router.post('/book', async (req, res) => {
  try {
    const { bookingId, slot, date } = req.body;

    if (!bookingId || !slot || !date) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID, slot, and date are required.',
      });
    }

    const validSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
    if (!validSlots.includes(slot)) {
      return res.status(400).json({ success: false, message: 'Invalid slot selected.' });
    }

    // Find booking and verify payment
    const booking = await CounsellingBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed. Cannot book slot.',
      });
    }

    // Update slot
    booking.slot = slot;
    booking.date = date;
    await booking.save();

    // Get user for email
    const user = await User.findById(booking.userId);

    // Send notifications (non-blocking)
    if (user) {
      sendCounsellingBookingEmail({ user, booking });
      sendStudentConfirmationEmail({ user, booking });
    }

    return res.status(200).json({
      success: true,
      message: 'Counselling session booked successfully!',
      data: {
        bookingId: booking._id,
        slot: booking.slot,
        date: booking.date,
        counsellorName: booking.counsellorName,
        studentName: user ? user.name : 'Student',
      },
    });
  } catch (error) {
    console.error('Book counselling error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

module.exports = router;
